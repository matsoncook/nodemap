import Control from "./control/Control";
import CanvasEvent from "./event/CanvasEvent";
import Resizer from "./event/Resizer";
import LatLon from "./map/LatLon";

import OcsMap from "./map/map";
import MercatorViewport from "./map/MercatorViewport";
import GridCalculator from "./mapimage/GridCalculator";
import SubImage from "./mapimage/SubImage";
import MercatorWeb from "./project/MercatorWeb";
import Route from "./route/Route";
import RouteRenderer from "./route/RouteRenderer";
import WebServerInterface from "./server/webserverinterface";
import LatLonConverter from "./util/LatLonConverter";
import Util from "./util/Util";
import { Point2d } from "./viewport/point2d";

import { Viewport2d } from "./viewport/viewport2d";

var zoom = 4;



//doTests();

const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

var viewport = new Viewport2d();
var mapProject = new MercatorWeb();
var viewportMercator: MercatorViewport = new MercatorViewport(
    mapProject,
    viewport,
    zoom,
);

viewportMercator.applyViewportMagnificationForZoom(zoom);
//viewport.viewPortCanvasMagnification.scale(0.9);
var mercatorViewportPixel = 360 / 512;
let viewportPosition = new Point2d(180 / mercatorViewportPixel, 0);
var canvasPosition = new Point2d(256, 256);
viewport.setCanvasPositionOfViewportCenter(viewportPosition, canvasPosition);

var map = new OcsMap(canvas, ctx, viewportMercator);
let control :  Control| null= null;
var resizer = new Resizer(canvas, ctx, viewport, () => {
    map.mapGrid.load1(viewportMercator.zoom, (image) => {
        map.draw();
    });
    map.draw();
    control?.populateInputs();
});

control = new Control(map, viewportMercator, viewport,resizer);
control?.setup();

var canvasEvent = new CanvasEvent(canvas, viewportMercator);
canvasEvent.addWheelEvent(() => {
    map.mapGrid.load1(viewportMercator.zoom, (image) => {
        map.draw();
    });
    map.draw();
    control?.populateInputs();
});
canvasEvent.addDraggingEvent(() => {
    map.mapGrid.load1(viewportMercator.zoom, (image) => {
        map.draw();
    });
    map.draw();
    control?.populateInputs();
});

var webServerInterface: WebServerInterface = new WebServerInterface();

webServerInterface.makeAjaxCall("/map_static/go_fixes.json", onSuccess);

function onSuccess(json: any) {
    map.fixes.fixList = json;

    map.draw();
}

webServerInterface.makeAjaxCall("/api/get_route_list?id=AAA", (json: any) => {
    var latLonConverter: LatLonConverter = new LatLonConverter();
    for (var route_json of json) {
        //var route_json = JSON.parse(route_str);
        var route = new Route(route_json["acid"], route_json["route"]);
        var routeRenderer = new RouteRenderer(route);
        routeRenderer.prepare(latLonConverter);
        map.routeRendererList.push(routeRenderer);
    }

    console.log(json);
});

map.mapGrid.load1(zoom, (image) => {
    map.draw();
});

/*
zoom 2 -256 but was -104 ratio 2.4615384615384615
zoom 3 -768 but was -464 ratio 1.6578947368421053

zoom 4 not quite spot on -1785 but was -1184 ratio 1.5161290322580645
zoom 5  -3571 but was -2624 ratio 1.5080645161290323
*/

