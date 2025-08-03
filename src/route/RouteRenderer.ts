import LatLon from "../map/LatLon";
import LatLonConverter from "../util/LatLonConverter";
import Route from "./Route";

export default class RouteRenderer{

    latLonList : LatLon[] = [];
    constructor(private route:Route)
    {

    }
    prepare(latLonConverter : LatLonConverter)
    {
        var routeStr = this.route.route_string;
        var splits = routeStr.split(" ");

        for (var coord of splits)
        {
            if(coord.length == 11)
            {
                var latLon = latLonConverter.convertDDMMHDDDMMH(coord);
                this.latLonList.push(latLon);
            }
        }

    }
}