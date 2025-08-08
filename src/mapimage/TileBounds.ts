export default class TileBounds
{

    constructor(private _x0: number, private _x1: number, private _y0: number, private _y1: number)
    {

    }

    public get y1(): number {
        return this._y1;
    }
    public set y1(value: number) {
        this._y1 = value;
    }
    public get y0(): number {
        return this._y0;
    }
    public set y0(value: number) {
        this._y0 = value;
    }
    public get x1(): number {
        return this._x1;
    }
    public set x1(value: number) {
        this._x1 = value;
    }
    public get x0(): number {
        return this._x0;
    }
    public set x0(value: number) {
        this._x0 = value;
    }


} 