export default class LatLon{

    constructor(
        private _lon: number = 0.0,
        private _lat: number = 0.0,
    ) { }
    public get lat(): number {
        return this._lat;
    }
    public set lat(value: number) {
        this._lat = value;
    }
    public get lon(): number {
        return this._lon;
    }
    public set lon(value: number) {
        this._lon = value;
    }
}