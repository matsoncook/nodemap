import LatLon from "../map/LatLon";

export default class SubImage
{
    public _anImage: HTMLImageElement  = new Image();
    public imageName : string = "";
    public imagePath : string = "/mapimage/";

    public latLonCenter = new LatLon(0,0);
    // public latLonFrom = new LatLon(0,0);
    // public latLonTo = new LatLon(0,0);
    public get anImage(): any {
        return this._anImage;
    }
    public set anImage(value: any) {
        this._anImage = value;
    }

    public isLoaded = false;
    constructor(private zoom : number, private  x : number, private y : number, public latLonFrom : LatLon, public latLonTo : LatLon,private callback: (image:HTMLImageElement ) => void = () => { } )
    {
    }
    load() : SubImage{
        

        var that = this;
        this._anImage.onload= function() {

            that.isLoaded = true;
            that.callback(that._anImage);
            
        }
        this._anImage.onerror = (err:any) => {
            console.error("Failed to load image", err);
        };
        this.imageName = `satellite${this.zoom.toString().padStart(2, "0")}-${this.x.toString().padStart(6, "0")}-${this.y.toString().padStart(6, "0")}.png`;


        this._anImage.src = this.imagePath + this.imageName;//texPath+"earth-"+x+"-"+y+".png"

        return this;
        
        
    }


}