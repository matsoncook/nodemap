import MercatorViewport from "../map/MercatorViewport";
import MercatorWeb from "../project/MercatorWeb";
import { Bounds2d } from "../viewport/bounds2d";
import { Viewport2d } from "../viewport/viewport2d";

export default class GridCalculator
{
    mapProject : MercatorWeb;
    viewport : Viewport2d;
    private _zoom: number = 1;
    viewportBounds : Bounds2d = new Bounds2d();
    


    constructor(private mercatorViewport : MercatorViewport)
    {
        this.mapProject = mercatorViewport.mercatorWeb;
        this.viewport = mercatorViewport.viewport;
        
    }

    calculateGrid()
    {
        this.mercatorViewport.viewport.calculateViewportCanvasBounds();
        let b = this.viewport.viewportCanvasBounds;
        this._zoom = this.mercatorViewport.zoom;


        this.viewportBounds = b;

        let lonFrom = this.mercatorViewport.viewportToLonDeg(b.x);
        let lonTo = this.mercatorViewport.viewportToLonDeg(b.x1);

        let grid_count = Math.pow(2,this.zoom);
        let latFrom = this.mercatorViewport.viewportToLatDeg(b.y) ;
        let latTo = this.mercatorViewport.viewportToLatDeg(b.y1) ;
        
        

        let tileXFrom = this.lonToTileX(lonFrom,this.zoom,grid_count,256);
        let tileXTo = this.lonToTileX(lonTo,this.zoom,grid_count,256);
        
        let tileYFrom = this.latToTileY(latFrom,this.zoom,grid_count,256) || 0;
        let tileYTo = this.latToTileY(latTo,this.zoom,grid_count,256) || grid_count -1;

        console.log(`tileXFrom: ${tileXFrom}, tileXTo: ${tileXTo}`);
        console.log(`tileYFrom: ${tileYFrom}, tileYTo: ${tileYTo}`);
        console.log(`tm`);
        return {
            x0 : tileXFrom,
            x1 : tileXTo,
            y0 : tileYFrom,
            y1 : tileYTo

        }

        
        
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

    public get zoom(): number {
        return this._zoom;
    }
    public set zoom(value: number) {
        this._zoom = value;
    }
    tests() {

        this.test1();
        this.test2();
        this.test3();
    }

    test1()
    {
        let grid_count = Math.pow(2,this.zoom);
        this.viewport.canvasBounds.setFromTo(0,0,1000,500);
        this.viewport.canvasPositionOfViewportCenter.set2(500,250);
        //this.viewport.viewPortCanvasMagnification.set2(1,1);
        this.viewport.viewPortCanvasMagnification.set2(0.5,0.5);
        this.viewport.calculateViewportCanvasBounds();
        //this.calculateGrid();
        console.log("Grid Calculator test: bounds:" + this.viewport.viewportCanvasBounds);
    }
    test2()
    {
        let grid_count = Math.pow(2,this.zoom);
        this.viewport.canvasBounds.setFromTo(0,0,512,512);
        this.viewport.canvasPositionOfViewportCenter.set2(256,256);
        //this.viewport.viewPortCanvasMagnification.set2(1,1);
        this.viewport.viewPortCanvasMagnification.set2(0.5,0.5);
        this.viewport.calculateViewportCanvasBounds();
        //this.calculateGrid();
        console.log("Grid Calculator test: bounds:" + this.viewport.viewportCanvasBounds);
        

        let b = this.viewport.viewportCanvasBounds;
        //this.mercatorViewport.zoo
        let lonFrom = this.mercatorViewport.viewportToLonDeg(b.x);
        let lonTo = this.mercatorViewport.viewportToLonDeg(b.x1);

        
        let latFrom = this.mercatorViewport.viewportToLatDeg(b.y) ;
        let latTo = this.mercatorViewport.viewportToLatDeg(b.y1) ;

        console.log(`lonFrom ${lonFrom}, ${lonTo}`);
        console.log(`latFrom ${latFrom}, ${latTo}`);
    }
    test3()
    {
        this.zoom = 2;
        let grid_count = Math.pow(2,this.zoom);
        this.viewport.canvasBounds.setFromTo(0,0,512,512);
        this.viewport.canvasPositionOfViewportCenter.set2(256,256);
        //this.viewport.viewPortCanvasMagnification.set2(1,1);
        let zoomLevel = 360.0/512.0;
        //this.viewport.viewPortCanvasMagnification.set2(0.9,0.9);
        //this.viewport.viewPortCanvasMagnification.set2(1,1);
        this.viewport.viewPortCanvasMagnification.set2(zoomLevel*zoomLevel-0.01,zoomLevel*zoomLevel-0.01);
        this.viewport.calculateViewportCanvasBounds();
        //this.calculateGrid();
        console.log("Grid Calculator test: bounds:" + this.viewport.viewportCanvasBounds);
        

        let b = this.viewport.viewportCanvasBounds;
        //this.mercatorViewport.zoo
        let lonFrom = this.mercatorViewport.viewportToLonDeg(b.x);
        let lonTo = this.mercatorViewport.viewportToLonDeg(b.x1);

        
        let latFrom = this.mercatorViewport.viewportToLatDeg(b.y) ;
        let latTo = this.mercatorViewport.viewportToLatDeg(b.y1) ;

        console.log(`lonFrom ${lonFrom}, ${lonTo}`);
        console.log(`latFrom ${latFrom}, ${latTo}`);

        let tileXFrom = this.lonToTileX(lonFrom,this.zoom,grid_count,256);
        let tileXTo = this.lonToTileX(lonTo,this.zoom,grid_count,256);

        let tileYFrom = this.latToTileY(latFrom, this.zoom, grid_count, 256) || 0;
        let tileYTo = this.latToTileY(latTo, this.zoom, grid_count, 256) || grid_count - 1;

        console.log(`tileX ${tileXFrom}, ${tileXTo}`);
        console.log(`tileY ${tileYFrom}, ${tileYTo}`);
    }
}


