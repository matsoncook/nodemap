
import {Point2d} from './point2d';
import {Bounds2d} from './bounds2d';

export class Viewport2d{

    private _worldBounds: Bounds2d = new Bounds2d();
   

    //Magnification of world from viewport view
    private _viewPortWorldMagnification: Point2d = new Point2d().set(1.0,1.0);


    //World position of the center of viewport
    private _viewPortWorldPosition : Point2d  = new Point2d();

    //The viewport bounds of the canvas bounds taking into account magnification
    private _viewportCanvasBounds: Bounds2d = new Bounds2d();



    //Magnification of canvas from viewport view if viewPort is 1 and canvas is 1000 then its 1000
    private _viewPortCanvasMagnification: Point2d = new Point2d(1.0,1.0);
    

    //Canvas position of the center of viewport
    private _canvasPositionOfViewportCenter: Point2d = new Point2d();
    

    //This is bacically half of the canvas bounds
    public canvasCenterPosition : Point2d = new Point2d();

    private _canvasBounds: Bounds2d = new Bounds2d();


    private _aspect: number = 1; // if y is bigger then this is less than .001 
    

    /*
	
	vtcm = vb / cb
	
	position of the center of the viewport on the canvas = vtcp
	center viewport vtcp = cb/2
	
	viewport to canvas c = v * vtcm  + vtcp
	
    */
   /*
   AI Generated
    Definitions:
    - vtcm = viewport-to-canvas magnification = viewPortBounds / canvasBounds
    - vtcp = canvas position of viewport center = usually canvasBounds / 2
    - canvas = (viewport / vtcm) + vtcp
   */

    constructor() {
       //this.worldBounds = worldBounds;
    }

    //ViewPort To Canvas------------------------------------------------------------------------- 
	
	public  viewPortToCanvas(fromPoint : Point2d,toPoint : Point2d) : Point2d
	{
		toPoint.x = this.viewPortToCanvasX(fromPoint.x);
		toPoint.y = this.viewPortToCanvasY(fromPoint.y);
		
		return toPoint;
		
    }
    
    public viewPortToCanvasX(viewPortX : number) : number
	{

        let canvasX = (viewPortX / this.viewPortCanvasMagnification.x)  + this._canvasPositionOfViewportCenter.x;
        return canvasX;
    }
    

    public viewPortToCanvasY(viewPortY : number) : number
	{
        //Note the minus sign
        let canvasY = -(viewPortY / this.viewPortCanvasMagnification.y) + this._canvasPositionOfViewportCenter.y ;
        return canvasY;
    }

    public  canvasToViewPort(fromPoint : Point2d,toPoint : Point2d) : Point2d
	{
		toPoint.x = this.canvasToViewPortX(fromPoint.x);
		toPoint.y = this.canvasToViewPortY(fromPoint.y);
		
		return toPoint;
		
    }

    public canvasToViewPortX(canvasX : number) : number
	{
        var viewPortX = ((canvasX - this._canvasPositionOfViewportCenter.x  ) * this.viewPortCanvasMagnification.x );
        return viewPortX;
    }

    public canvasToViewPortY(canvasY : number) : number
	{
        var viewPortY = (-(canvasY - this._canvasPositionOfViewportCenter.y  ) * this.viewPortCanvasMagnification.y );
        return viewPortY;
    }


    calculateCanvasAspect()
    {
        this.aspect = this._canvasBounds.sizeX / this._canvasBounds.sizeY;
    }
    getViewportToCanvasBorderX(viewOffset? : number)
    {
        viewOffset = viewOffset ?? 0;

        var canvasX = this.canvasBounds.halfSizeX;


        var viewX = this.canvasToViewPortX(canvasX);
        var viewXPlusOffset = viewX - viewOffset;
        var newCanvasX = this.viewPortToCanvasX(viewXPlusOffset);

        return newCanvasX;

    }
    getViewportToCanvasBorderY(viewOffset? : number)
    {
        viewOffset = viewOffset ?? 0;

        var canvasY = this.canvasBounds.halfSizeY;

        var viewY = this.canvasToViewPortY(canvasY);
        var viewYPlusOffset = viewY - viewOffset;
        var newCanvasY = this.viewPortToCanvasY(viewYPlusOffset);

        return newCanvasY;

    }
    calculateViewPortCanvasMagnification()
    {
        this._viewPortCanvasMagnification.x = this._viewportCanvasBounds.sizeX / this._canvasBounds.sizeX;
        this._viewPortCanvasMagnification.y = this._viewportCanvasBounds.sizeY / this._canvasBounds.sizeY;
    }

    calculateViewportCanvasBounds()
    {
        let x0 = this.canvasToViewPortX(0);
        let y0 = this.canvasToViewPortY(0);
        let x1 = this.canvasToViewPortX(0);
        let y1 = this.canvasToViewPortY(0);
        this.viewportCanvasBounds.setFromTo(x0,y0,x1,y1);
    }

    setCanvasPositionOfViewportCenter(viewPortPosition : Point2d,canvasPosition: Point2d)
    {
        this._canvasPositionOfViewportCenter.x = this.canvasPositionOfViewportCenterX(viewPortPosition.x, canvasPosition.x);
        this._canvasPositionOfViewportCenter.y = this.canvasPositionOfViewportCenterY(viewPortPosition.y, canvasPosition.y);
    }

    canvasPositionOfViewportCenterX(viewPortX:number, canvasX:number) : number
    {
        //let canvasX = (viewPortX / this.viewPortCanvasMagnification.x)  + this._canvasPositionOfViewportCenter.x;
        //var viewPortX = ((canvasX - this._canvasPositionOfViewportCenter.x  ) * this.viewPortCanvasMagnification.x );

        var vpcx = canvasX - (viewPortX / this.viewPortCanvasMagnification.x);

        return vpcx;
    }
    canvasPositionOfViewportCenterY(viewPortY:number, canvasY:number) : number
    {
        //let canvasY = -(viewPortY / this.viewPortCanvasMagnification.y) + this._canvasPositionOfViewportCenter.y ;
        

        var vpcy = canvasY + (viewPortY / this.viewPortCanvasMagnification.y);
        //console.log("newViewportCenterY",this._canvasPositionOfViewportCenter.y,prev,vpcy)
        return vpcy;
    }



    public get worldBounds(): Bounds2d {
        return this._worldBounds;
    }
    public set worldBounds(value: Bounds2d) {
        this._worldBounds = value;
    }

    public get viewPortWorldMagnification(): Point2d {
        return this._viewPortWorldMagnification;
    }
    public set viewPortWorldMagnification(value: Point2d) {
        this._viewPortWorldMagnification = value;
    }
    public get viewPortCanvasMagnification(): Point2d {
        return this._viewPortCanvasMagnification;
    }
    public set viewPortCanvasMagnification(value: Point2d) {
        this._viewPortCanvasMagnification = value;
    }

    public get viewportCanvasBounds(): Bounds2d {
        return this._viewportCanvasBounds;
    }
    public set viewportCanvasBounds(value: Bounds2d) {
        this._viewportCanvasBounds = value;
    }

    public get canvasBounds(): Bounds2d {
        return this._canvasBounds;
    }
    public set canvasBounds(value: Bounds2d) {
        this._canvasBounds = value;
    }

    public get canvasPositionOfViewportCenter(): Point2d {
        return this._canvasPositionOfViewportCenter;
    }
    public set canvasPositionOfViewportCenter(value: Point2d) {
        this._canvasPositionOfViewportCenter = value;
    }

    public get aspect(): number {
        return this._aspect;
    }
    public set aspect(value: number) {
        this._aspect = value;
    }
    
}