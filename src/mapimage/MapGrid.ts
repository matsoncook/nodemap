import LatLon from "../map/LatLon";
import MercatorViewport from "../map/MercatorViewport";
import MercatorWeb from "../project/MercatorWeb";
import Util from "../util/Util";
import SubImage from "./SubImage";

export default class MapGrid
{
    zoom = 1;
    grid : SubImage[][] = [[]];
    mapProject : MercatorWeb;
    constructor(private mercatorViewport : MercatorViewport)
    {
        this.mapProject = mercatorViewport.mercatorWeb;
    }
    calculateGrid()
    {
        this.mercatorViewport.viewport.calculateViewportCanvasBounds();

        let b = this.mercatorViewport.viewport.viewportCanvasBounds;

        let lonFrom = this.mercatorViewport.viewportToLonDeg(b.x);
        let lonTo = this.mercatorViewport.viewportToLonDeg(b.x1);

        let grid_count = Math.pow(2,this.zoom);
        let latFrom = this.mercatorViewport.viewportToLatDeg(b.y) ?? 0;
        let latTo = this.mercatorViewport.viewportToLatDeg(b.y) ?? grid_count;
        
        

        let tileXFrom = this.lonToTileX(lonFrom,this.zoom,grid_count,256);
        let tileXTo = this.lonToTileX(lonTo,this.zoom,grid_count,256);
        
        let tileYFrom = this.latToTileY(lonFrom,this.zoom,grid_count,256);
        let tileYTo = this.latToTileY(lonTo,this.zoom,grid_count,256);

        console.log(`tileXFrom: ${tileXFrom}, tileXTo: ${tileXTo}`);
        console.log(`tileYFrom: ${tileYFrom}, tileYTo: ${tileYTo}`);
        console.log(`tm`);

        
        
    }  

    load(zoom : number,callback: (image:HTMLImageElement ) => void = () => { } )
    {
        
        this.zoom = zoom;

        this.calculateGrid()

        this.grid = [[]];

        var grid_count = Math.pow(2,zoom);
        var h_grid_count = grid_count /2;
        //var grid_count = zoom+1;
        var tileSize = 256 ;

        var xx = grid_count - 1;
        
        for(var x_count = 0; x_count < grid_count ; x_count++)
        {
            //if(x_count == 1)continue;
            for(var y_count = 0; y_count < grid_count; y_count++)
            {
                
                //zoom = 4

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
            xx = xx -1;
        }


        // var subImage00 = new SubImage(1,1,1,  new LatLon( 0,lat90),       new LatLon(lon180, 0),(image)=>{
        //     map.draw();
        // }).load();
        
        // var subImage01 = new SubImage(1,1,0,  new LatLon( 0,0),           new LatLon(lon180, -lat90),(image)=>{
        //     map.draw();
        // }).load();
        
        // var subImage10 = new SubImage(1,0,1,  new LatLon( -lon180,lat90),  new LatLon(lon360, 0),(image)=>{
        //     map.draw();
        // }).load();
        
        // var subImage11 = new SubImage(1,0,0,  new LatLon( -lon180,0),      new LatLon(lon360, -lat90),(image)=>{
        //     map.draw();
        // }).load();
    }

    latToTileY(lat: number,  zoom: number, grid_count: number, tileSize: number) {
        
        const py = this.mapProject.latDegToPixels(lat, zoom);


        const factor_y = Math.floor(py / tileSize);


        const y_count = factor_y + (grid_count / 2);

        return y_count ;
    }

    lonToTileX(lon: number, zoom: number, grid_count: number, tileSize: number) {
        const px = this.mapProject.lonDegToPixels(lon, zoom);


        const factor_x = Math.floor(px / tileSize);


        const x_count = factor_x + (grid_count / 2);


        return x_count;
    }

    latLonToTileXY(lat: number, lon: number, zoom: number, grid_count: number, tileSize: number) {
        const px = this.mapProject.lonDegToPixels(lon, zoom);
        const py = this.mapProject.latDegToPixels(lat, zoom);

        const factor_x = Math.floor(px / tileSize);
        const factor_y = Math.floor(py / tileSize);

        const x_count = factor_x + (grid_count / 2);
        const y_count = factor_y + (grid_count / 2);

        return { x_count, y_count };
    }
}