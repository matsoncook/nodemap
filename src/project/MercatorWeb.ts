import Util from "../util/Util";


export default class MercatorWeb
{
    
  public static TILE_SIZE = 256.0;
  public static EARTH_RADIUS_METERS = 6378137.0;
  public static EARTH_CIRCUMFERENCE_METERS = 2 * MercatorWeb.EARTH_RADIUS_METERS * Math.PI;
  public static METERS_PER_PIXEL_ZOOM_LEVEL_0 = MercatorWeb.EARTH_CIRCUMFERENCE_METERS / MercatorWeb.TILE_SIZE;
  public static METERS_PER_DEGREE  = MercatorWeb.EARTH_CIRCUMFERENCE_METERS / 360;

  
  private tileSize = MercatorWeb.TILE_SIZE;
  


  private radius = MercatorWeb.EARTH_RADIUS_METERS;
  private circumference = MercatorWeb.EARTH_CIRCUMFERENCE_METERS

  constructor()
  {

  }


  
  public  metersPerPixel( zoom : number)
  {

    var meterPerPixelZoomLevel0 = this.circumference / ( this.tileSize );

    var zoomPow = Math.pow( 2, zoom );

    return meterPerPixelZoomLevel0 / zoomPow;
  }



  public  pixelsToMeters(  pixels: number,  zoom: number )
  {
    var metersPerPixel = this.metersPerPixel( zoom );
    return pixels * metersPerPixel;
  }

  public  metersToPixels(  meters: number,  zoom: number )
  {

    var metersPerPixel = this.metersPerPixel( zoom );
    return meters / metersPerPixel;
  }

  public  latDegToMeters(  lat: number )
  {

    var shift = ( Util.toRadians( lat ) / 2.0 ) + ( Math.PI / 4.0 );
    var meters = this.radius * Math.log( Math.tan( shift ) );

    return meters;

  }

  public  metersToLatRad(  meters: number )
  {
    //  shift = Math.atan(Math.exp(meters/EARTH_RADIUS_METERS));
    // lat = 2*(shift - (Math.PI/4.0))

    var rads = 2 * ( Math.atan( Math.exp( ( meters ) / ( this.radius ) ) ) - Math.PI / 4.0 );
    return rads;
  }


  public  latDegToPixels(  latitude: number,  zoom: number )
  {
    var meters = this.latDegToMeters( latitude );
    var pixels = this.metersToPixels( meters, zoom );
    return pixels;
  }

  public   metersToLonRad(  meters: number )
  {
    
    return (meters/this.circumference) * 2 * Math.PI;
  }
  public   lonDegToPixels(  longitude: number,  zoom: number )
  {
    var meters = this.lonDegToMeters( longitude );
    var pixels = this.metersToPixels( meters, zoom );
    return pixels;
  }
  public  totalLonPixels(  zoom: number )
  {
    return this.tileSize * Math.pow( 2, zoom );
  }

  public  totalPixels(  zoom: number )
  {
    return this.tileSize * Math.pow( 2, zoom );
  }
  public   lonDegToMeters(  longitude: number )
  {

    return longitude * MercatorWeb.METERS_PER_DEGREE ;
  }
  public pixelsToLonRad(pixel : number,zoom: number) : number
  {
    const m = this.pixelsToMeters(pixel,zoom);
    const lr = this.metersToLonRad(m);
    return lr;
  }
  public pixelsToLatRad(pixel : number,zoom: number) : number
  {
    const m = this.pixelsToMeters(pixel,zoom);
    const lr = this.metersToLatRad(m);
    return lr;
  }

   pixelsToLatDeg (pixel: number,zoom: number): number
    {
        var m = this.pixelsToMeters(pixel,zoom);
        var lr = this.metersToLatRad(m);
        var ld = Util.toDeg(lr);
        return ld;
    }

    pixelsToLonDeg (pixel: number,zoom: number): number
    {
        var m = this.pixelsToMeters(pixel,zoom);
        var lr = this.metersToLonRad(m);
        var ld = Util.toDeg(lr);
        return ld;
    }


  
}
