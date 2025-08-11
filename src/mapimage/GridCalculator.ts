import MercatorViewport from "../map/MercatorViewport";
import MercatorWeb from "../project/MercatorWeb";
import { Bounds2d } from "../viewport/bounds2d";
import { Viewport2d } from "../viewport/viewport2d";
import TileBounds from "./TileBounds";

export default class GridCalculator
{
    mapProject : MercatorWeb;
    viewport : Viewport2d;
    //private _zoom: number = 1;
    viewportBounds : Bounds2d = new Bounds2d();


    lonFrom = 0;
    lonTo = 0;

    grid_count = 0;
    latFrom = 0 ;
    latTo = 0 ;

    tileXFrom = 0;
    tileXTo = 0;

    tileYFrom =  0;
    tileYTo = 0; 
    

    boundsArr :  TileBounds[] = [];
    constructor(private mercatorViewport : MercatorViewport)
    {
        this.mapProject = mercatorViewport.mercatorWeb;
        this.viewport = mercatorViewport.viewport;
        
    }

    calculateGrid()
    {
        this.mercatorViewport.viewport.calculateViewportCanvasBounds();
        let b = this.viewport.viewportCanvasBounds;
        let zoom = this.mercatorViewport.zoom;


        this.viewportBounds = b;

        this.lonFrom = this.mercatorViewport.viewportToLonDeg(b.x);
        this.lonTo = this.mercatorViewport.viewportToLonDeg(b.x1);

        this.grid_count = Math.pow(2,zoom);
        this.latFrom = this.mercatorViewport.viewportToLatDeg(b.y) ;
        this.latTo = this.mercatorViewport.viewportToLatDeg(b.y1) ;
        
        

        this.tileXFrom = this.lonToTileX(this.lonFrom,zoom,this.grid_count,256);
        this.tileXTo = this.lonToTileX(this.lonTo,zoom,this.grid_count,256);
        
        this.tileYFrom = this.latToTileY(this.latFrom,zoom,this.grid_count,256) || 0;
        this.tileYTo = this.latToTileY(this.latTo,zoom,this.grid_count,256) || this.grid_count -1; 

        this.boundsArr = [];
        let boundsArr :  TileBounds[] = this.boundsArr;

        if(this.tileXFrom % this.grid_count > this.tileXTo % this.grid_count)
        {
            boundsArr.push(new TileBounds(0, this.tileXTo % this.grid_count, this.tileYFrom, this.tileYTo));
            boundsArr.push(new TileBounds(this.tileXFrom % this.grid_count, this.grid_count -1, this.tileYFrom, this.tileYTo))
        }
        else{
            boundsArr.push(new TileBounds(this.tileXFrom % this.grid_count, this.tileXTo % this.grid_count, this.tileYFrom, this.tileYTo));
        }

        // console.log(`tileXFrom: ${tileXFrom}, tileXTo: ${tileXTo}`);
        // console.log(`tileYFrom: ${tileYFrom}, tileYTo: ${tileYTo}`);
        // console.log(`tm`);
        return boundsArr;

        
        
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
    toString(): string
    {
        return `GridCalculator: bounds:${this.viewportBounds}, lonFrom:${this.lonFrom}, lonTo:${this.lonTo}, latFrom:${this.latFrom}, latTo:${this.latTo}, tileXFrom:${this.tileXFrom}, tileXTo:${this.tileXTo}, tileYFrom:${this.tileYFrom}, tileYTo:${this.tileYTo}`;
    }
/*
    tests() {

        this.test1();
        this.test2();
        this.test3();
    }

    test1()
    {
        let zoom = this.mercatorViewport.zoom;
        let grid_count = Math.pow(2,zoom);
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
        let zoom = this.mercatorViewport.zoom;
        let grid_count = Math.pow(2,zoom);
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
        let zoom = 2;

        let grid_count = Math.pow(2,zoom);
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

        let tileXFrom = this.lonToTileX(lonFrom,zoom,grid_count,256);
        let tileXTo = this.lonToTileX(lonTo,zoom,grid_count,256);

        let tileYFrom = this.latToTileY(latFrom, zoom, grid_count, 256) || 0;
        let tileYTo = this.latToTileY(latTo, zoom, grid_count, 256) || grid_count - 1;

        console.log(`tileX ${tileXFrom}, ${tileXTo}`);
        console.log(`tileY ${tileYFrom}, ${tileYTo}`);
    }
        */
}


