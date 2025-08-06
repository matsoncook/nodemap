import LatLon from "../map/LatLon";
import MercatorViewport from "../map/MercatorViewport";
import MercatorWeb from "../project/MercatorWeb";
import Util from "../util/Util";
import GridCalculator from "./GridCalculator";
import SubImage from "./SubImage";

export default class MapGrid
{
    zoom = 1;
    grid : SubImage[][] = [[]];
    mapProject : MercatorWeb;
    latLonFrom = new LatLon();
    latLonTo = new LatLon();
    gridCalculator :GridCalculator;
    constructor(private mercatorViewport : MercatorViewport)
    {
        this.mapProject = mercatorViewport.mercatorWeb;
        this.gridCalculator = new GridCalculator(mercatorViewport);
    }
    // calculateGrid()
    // {
    //     this.mercatorViewport.viewport.calculateViewportCanvasBounds();

    //     let b = this.mercatorViewport.viewport.viewportCanvasBounds;

    //     let lonFrom = this.mercatorViewport.viewportToLonDeg(b.x);
    //     let lonTo = this.mercatorViewport.viewportToLonDeg(b.x1);

    //     let grid_count = Math.pow(2,this.zoom);
    //     let latFrom = this.mercatorViewport.viewportToLatDeg(b.y) ;
    //     let latTo = this.mercatorViewport.viewportToLatDeg(b.y1) ;
        
        

    //     let tileXFrom = this.lonToTileX(lonFrom,this.zoom,grid_count,256);
    //     let tileXTo = this.lonToTileX(lonTo,this.zoom,grid_count,256);
        
    //     let tileYFrom = this.latToTileY(latFrom,this.zoom,grid_count,256) || 0;
    //     let tileYTo = this.latToTileY(latTo,this.zoom,grid_count,256) || grid_count -1;

    //     console.log(`tileXFrom: ${tileXFrom}, tileXTo: ${tileXTo}`);
    //     console.log(`tileYFrom: ${tileYFrom}, tileYTo: ${tileYTo}`);
    //     console.log(`tm`);
    //     return {
    //         x0 : tileXFrom,
    //         x1 : tileXTo,
    //         y0 : tileYFrom,
    //         y1 : tileYTo

    //     }

        
        
    // }
    load1(zoom : number,callback: (image:HTMLImageElement ) => void = () => { } )
    {
        this.zoom = zoom;

        let bounds : any = this.gridCalculator.calculateGrid();

        this.grid = [[]];

        var grid_count = Math.pow(2,zoom);
        var h_grid_count = grid_count /2;

        var tileSize = 256 ;

        var xx = grid_count - 1;
        
        for(var x_count = bounds.x0; x_count <=  bounds.x1 ; x_count++)
        {
            let x = x_count;
            if(x_count < 0  )
            {
                //x = x_count % grid_count;
                continue;
            }
            if(x_count > (grid_count - 1) )
            {
                continue;
            }
            for(var y_count = bounds.y0; y_count <= bounds.y1; y_count++)
            
            {
                if(y_count < 0 
                    || y_count > (grid_count - 1) )
                {
                    continue;
                }

                this.loadTile(zoom , x, y_count, callback );
            }
        }
    }  

    loadAll(zoom : number,callback: (image:HTMLImageElement ) => void = () => { } )
    {
        
        this.zoom = zoom;

        this.gridCalculator.calculateGrid()

        this.grid = [[]];

        var grid_count = Math.pow(2,zoom);
        var h_grid_count = grid_count /2;

        var tileSize = 256 ;

        var xx = grid_count - 1;
        
        for(var x_count = 0; x_count < grid_count ; x_count++)
        {
            //if(x_count == 1)continue;
            for(var y_count = 0; y_count < grid_count; y_count++)
            {

                this.loadTile(zoom , x_count, y_count, callback );
                
                
            }
            xx = xx -1;
        }


    }

    loadTile(zoom : number, x_count : number, y_count : number, callback: (image:HTMLImageElement ) => void = () => { } )
    {
        var grid_count = Math.pow(2,zoom);
        var h_grid_count = grid_count /2;
        var tileSize = 256 ;
        var factor_x = -(grid_count/2) + x_count;
        var factor_y = -(grid_count/2) + y_count;

        var latFrom = this.mapProject.pixelsToLatDeg(tileSize * (factor_y),zoom);
        var latTo = this.mapProject.pixelsToLatDeg(tileSize * (factor_y+1),zoom);
        var lonFrom = this.mapProject.pixelsToLonDeg(tileSize* factor_x,zoom);
        var lonTo = this.mapProject.pixelsToLonDeg(tileSize* (factor_x+1),zoom);

        let metersYFrom = this.mapProject.pixelsToMeters(tileSize * (factor_y),zoom);
        var metersYTo = this.mapProject.pixelsToMeters(tileSize * (factor_y+1),zoom);
        var metersXFrom = this.mapProject.pixelsToMeters(tileSize* factor_x,zoom);
        var metersXTo = this.mapProject.pixelsToMeters(tileSize* (factor_x+1),zoom);


        if(x_count == (h_grid_count-1))
        {
            lonTo = 360;
        }


        console.log(`x_count: ${x_count}, factor_x: ${factor_x},lonFrom: ${lonFrom}, lonTo: ${lonTo}`);

        // var latFrom = this.projectLat(tileSize * (y_count-1),zoom);
        // var latTo = this.projectLat(tileSize * (y_count+0),zoom);
        // var lonFrom = this.projectLon(tileSize* xx-0,zoom);
        // var lonTo = this.projectLon(tileSize* (xx+1),zoom);

        var llFrom = new LatLon( lonFrom,latFrom);
        var llTo = new LatLon( lonTo,latTo);
        var sub_image = new SubImage(zoom,x_count,y_count,  llFrom, llTo,callback).load();
        this.grid[0].push(sub_image)
                
    }

    // latToTileY(lat: number,  zoom: number, grid_count: number, tileSize: number) {
        
    //     const py = this.mapProject.latDegToPixels(lat, zoom);


    //     const factor_y = Math.floor(py / tileSize);


    //     const y_count = factor_y + (grid_count / 2);

    //     return y_count ;
    // }

    // lonToTileX(lon: number, zoom: number, grid_count: number, tileSize: number) {
    //     const px = this.mapProject.lonDegToPixels(lon, zoom);


    //     const factor_x = Math.floor(px / tileSize);


    //     const x_count = factor_x + (grid_count / 2);


    //     return x_count;
    // }

    // latLonToTileXY(lat: number, lon: number, zoom: number, grid_count: number, tileSize: number) {
    //     const px = this.mapProject.lonDegToPixels(lon, zoom);
    //     const py = this.mapProject.latDegToPixels(lat, zoom);

    //     const factor_x = Math.floor(px / tileSize);
    //     const factor_y = Math.floor(py / tileSize);

    //     const x_count = factor_x + (grid_count / 2);
    //     const y_count = factor_y + (grid_count / 2);

    //     return { x_count, y_count };
    // }
}