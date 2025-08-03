import LatLon from "../map/LatLon";

export default class LatLonConverter
{
    convertDDMMHDDDMMH(coord:string)
    {
        var latString = coord.slice(0, 5);
        var lonString= coord.slice(5, 11);

        const lat = this.parseDDMMH(latString);
        const lon = this.parseDDMMH(lonString);

        return new LatLon(lon, lat);
    }

    parseDDMMH(coord: string){
        var dir = "";
        const value = coord.slice(0);

        var deg = 0;
        var min = 0;
        var sec = 0;
        if (value.length == 5) {

            deg = parseInt(value.slice(0, 2), 10);
            min = parseInt(value.slice(2, 4), 10);
            dir = value.slice(4, 5)
            //sec = parseInt(value.slice(4, 6), 10);

        } else if (value.length == 6) {
            deg = parseInt(value.slice(0, 3), 10);
            min = parseInt(value.slice(3, 5), 10);
            dir = value.slice(5, 6)
            //sec = parseInt(value.slice(5, 7), 10);
        }
        else {
            throw new Error(`Invalid coordinate format: ${coord}`);
        }

        let decimal = deg + min / 60 + sec / 3600;
        if (dir === 'S' || dir === 'W') {
            decimal *= -1;
        }

        return decimal;
    };
}