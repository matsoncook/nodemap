import MercatorWeb from "../project/MercatorWeb";
import { Point2d } from "../viewport/point2d";
import { Viewport2d } from "../viewport/viewport2d";
import LatLon from "./LatLon";

export default class MercatorViewport
{
    
    zoomMagnificationMultiplier  = 360.0/512.0;
    
    
    constructor(private _mercatorWeb: MercatorWeb, private _viewport: Viewport2d, private _zoom: number)
    {

    }

    applyViewportMagnificationForZoom(zoom : number)
    {
        //let mag = Math.pow(this.zoomMagnificationMultiplier, zoom);
        let mag = 1/Math.pow(2, zoom-1)
        this._viewport.viewPortCanvasMagnification.set2(mag,mag)
    }

    viewportToLatDeg(viewportY : number) :number
    {
        return viewportY * 360.0/512.0;
    }
    viewportToLonDeg(viewportX : number) :number
    {
        return viewportX * 360.0/512.0;
    }
    transformLat(lat:number, base : number) : number
    {
        return lat;
    }

    transformLon(lon:number, base : number) : number
    {
        if (lon < 0)
        {
            lon = 360 + lon; 
        }
        if (lon > base)
        {
            lon = base - lon;
        } 
        return lon;
    }

   latLonToViewport(latLon : LatLon, point : Point2d)
    {
        var x_lon_f = latLon.lon;
        var y_lat_f = latLon.lat;

        x_lon_f = this.transformLon(x_lon_f, 360);
        y_lat_f = this.transformLat(y_lat_f, 360);

        var pix_x =  this._mercatorWeb.lonDegToPixels(x_lon_f, 1);
        var pix_y =  this._mercatorWeb.latDegToPixels(y_lat_f, 1);

        var x_f = this._viewport.viewPortToCanvasX(pix_x);
        var y_f  = this._viewport.viewPortToCanvasY(pix_y);

        point.x = x_f;
        point.y = y_f;
    }

    // optimalZoomForMagnification(viewportMagnification: number): number {
    //     const metersPerPixel = 1.0 / viewportMagnification;
    //     const zoom = Math.log2(
    //         MercatorWeb.EARTH_CIRCUMFERENCE_METERS /
    //         MercatorWeb.TILE_SIZE /
    //         metersPerPixel
    //     );
    //     return Math.floor(zoom); // use Math.round for closest match
    // }

    // zoomToViewportMagnification(zoom : number) : number
    // {
    //     return MercatorWeb.TILE_SIZE  / 360 * Math.pow(2,zoom);
    // }
    // viewportMagnificationToZoom(viewportMagnification : number) : number
    // {
    //     const zoom = Math.log2(viewportMagnification * 360 / MercatorWeb.TILE_SIZE);
    //     return zoom;
    // }

    // tileRangeForZoomX(zoom : number) : [number,number]
    // {
    //     //where is the LatLon(0,0)
    //     const cx = 0;//this.viewport.canvasPositionOfViewportCenterX;
    //     const mag = this._viewport.viewPortCanvasMagnification.x;
    //     const centerLon : number = 0; 
    //     return [0,0]  
    // }

    // bounds()
    // {
    //     this._viewport.calculateViewportCanvasBounds();
    //     let lonFrom = this._viewport.viewportCanvasBounds.x;
    //     let lonTo = this._viewport.viewportCanvasBounds.x1;
    //     let latFrom = this._viewport.viewportCanvasBounds.y;
    //     let latTo = this._viewport.viewportCanvasBounds.y1;

        
    // }
    public get mercatorWeb(): MercatorWeb {
        return this._mercatorWeb;
    }
    public set mercatorWeb(value: MercatorWeb) {
        this._mercatorWeb = value;
    }

    public get viewport(): Viewport2d {
        return this._viewport;
    }
    public set viewport(value: Viewport2d) {
        this._viewport = value;
    }
    public get zoom(): number {
        return this._zoom;
    }
    public set zoom(value: number) {
        this._zoom = value;
    }
    
}