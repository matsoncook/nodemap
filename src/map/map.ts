
import MapGrid from "../mapimage/MapGrid";

import RouteRenderer from "../route/RouteRenderer";

import { Point2d } from "../viewport/point2d";

import Fixes from "./fixes";
import LatLon from "./LatLon";
import MercatorViewport from "./MercatorViewport";


export default class OcsMap{

    fixes = new Fixes();
    routeRendererList : RouteRenderer[] = [];
    mapGrid : MapGrid; 

    // mapProject : MercatorWeb;
    // mercatorViewport : MercatorViewport  = new MercatorViewport(this.mapProject,this.viewport);

    constructor(private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D | null,
        private mercatorViewport : MercatorViewport)
    {
        this.mapGrid = new MapGrid(mercatorViewport);
    }
    // transformLat(lat:number, base : number) : number
    // {
    //     return lat;
    // }

    // transformLon(lon:number, base : number) : number
    // {
    //     if (lon < 0)
    //     {
    //         lon = 360 + lon; 
    //     }
    //     if (lon > base)
    //     {
    //         lon = base - lon;
    //     } 
    //     return lon;
    // }

    
    draw()
    {
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMapGrid();
        this.drawFixes();
        this.drawRoutes();
    }
    drawRoutes()
    {

       
        var pp : Point2d = new Point2d();
        var ll : LatLon = new LatLon();

        if (this.ctx) {
            this.ctx.strokeStyle = 'blue';
            this.ctx.lineWidth = 2;
        }
 
        for(var rr of this.routeRendererList)
        {
            if (this.ctx) {
                this.ctx.beginPath();
            }
            var first = true;
            for(var ll of rr.latLonList)
            {
                // var x_lon = this.transformLon(ll.lon, 360);
                // var y_lat = this.transformLat(ll.lat, 360);
    
                // var x = this.viewport.viewPortToCanvasX(x_lon);
                // var y = this.viewport.viewPortToCanvasY(y_lat);
        
                 this.mercatorViewport.latLonToViewport(ll, pp);
        
                if (this.ctx) {
                    if (first)
                    {
                        this.ctx.moveTo(pp.x, pp.y);
                        first = false; 
                    }
                    else{
                        this.ctx.lineTo(pp.x, pp.y); 
                    }
                    
                }
            }
            if (this.ctx) {
                this.ctx.stroke();
            }
        }
    }
    drawFixes()
    {
    
        
        var pp : Point2d = new Point2d();
        var ll : LatLon = new LatLon();
        
        for(var wp of this.fixes.fixList)
        {
            var coords = wp.geometry.coordinates;
            //console.log(`Lat: ${coords[1]}, Lon: ${coords[0]}`);

            ll.lon = coords[0];
            ll.lat = coords[1];
            this.mercatorViewport.latLonToViewport(ll, pp);
    
            // var x_lon = coords[0];
            // var y_lat = coords[1];
    
            // x_lon = this.transformLon(x_lon, 360);
            // y_lat = this.transformLat(y_lat, 360);
    
            // var x = this.viewport.viewPortToCanvasX(x_lon);
            // var y = this.viewport.viewPortToCanvasY(y_lat);
    
            
    
            if (this.ctx) {
                this.ctx.fillStyle = "red"; // Box color
                this.ctx.fillRect(pp.x, pp.y, 2, 2); // x, y, width, height
            }
        }
    }
    // latLonToViewport(latLon : LatLon, point : Point2d)
    // {
    //     var x_lon_f = latLon.lon;
    //     var y_lat_f = latLon.lat;

    //     x_lon_f = this.transformLon(x_lon_f, 360);
    //     y_lat_f = this.transformLat(y_lat_f, 360);

    //     var pix_x =  this.mapProject.lonToPixels(x_lon_f, 1);
    //     var pix_y =  this.mapProject.latToPixels(y_lat_f, 1);

    //     var x_f = this.viewport.viewPortToCanvasX(pix_x);
    //     var y_f  = this.viewport.viewPortToCanvasY(pix_y);

    //     point.x = x_f;
    //     point.y = y_f;
    // }
    drawMapGrid()
    {

        var from : Point2d = new Point2d();
        var to : Point2d = new Point2d();


        var grid = this.mapGrid.grid;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                //console.log(`grid[${i}][${j}] = ${grid[i][j]}`);
                var subImage = grid[i][j];

                if(!subImage.isLoaded)
                {

                    continue;
                }

                
                this.mercatorViewport.latLonToViewport(subImage.latLonFrom, from);
                this.mercatorViewport.latLonToViewport(subImage.latLonTo, to)


                this.ctx?.drawImage(subImage.anImage,0,0, 256,256, from.x,from.y,(to.x - from.x)*1,(to.y - from.y)*1)

            }
        }
    }
}