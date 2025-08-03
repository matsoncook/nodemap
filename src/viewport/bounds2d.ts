export class Bounds2d
{
    private _x: number = 0;
    private _y: number = 0;
    private _x1: number = 0;
    private _y1: number = 0;
    private _sizeX: number = 0;
    private _sizeY: number = 0;

    private _halfSizeX: number = 0;
    private _halfSizeY: number = 0;

    constructor()
    {

    }
    
    setFromTo(x0 : number,y0 : number,x1 : number,y1: number) 
    {
        this._x = x0;
        this._y = y0;
        this._x1 = x1;
        this._x1 = y1;

        this.setBounds(x1-x0,y1-y0);
    }
    setBounds(sizeX: number,sizeY: number)
    {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.halfSizeX = sizeX/2;
        this.halfSizeY = sizeY/2;
    }

    public get x(): number {
        return this._x;
    }
    public set x(value: number) {
        this._x = value;
    }
    
    public get y(): number {
        return this._y;
    }
    public set y(value: number) {
        this._y = value;
    }

    public get sizeX(): number {
        return this._sizeX;
    }
    public set sizeX(value: number) {
        this._sizeX = value;
    }

    public get sizeY(): number {
        return this._sizeY;
    }
    public set sizeY(value: number) {
        this._sizeY = value;
    }

    public get halfSizeX(): number {
        return this._halfSizeX;
    }
    public set halfSizeX(value: number) {
        this._halfSizeX = value;
    }

    public get halfSizeY(): number {
        return this._halfSizeY;
    }
    public set halfSizeY(value: number) {
        this._halfSizeY = value;
    }
    public get x1(): number {
        return this._x1;
    }
    public set x1(value: number) {
        this._x1 = value;
    }
    public get y1(): number {
        return this._y1;
    }
    public set y1(value: number) {
        this._y1 = value;
    }
}