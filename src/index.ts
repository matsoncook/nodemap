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

var mercatorViewportPixel = 360 / 512;

doTests();

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
viewport.viewPortCanvasMagnification.scale(0.9);

let viewportPosition = new Point2d(180 / mercatorViewportPixel, 0);
var canvasPosition = new Point2d(256, 256);
viewport.setCanvasPositionOfViewportCenter(viewportPosition, canvasPosition);

var map = new OcsMap(canvas, ctx, viewportMercator);

var resizer1 = new Resizer(canvas, ctx, viewport, () => {
    map.draw();
});

var canvasEvent = new CanvasEvent(canvas, viewportMercator);
canvasEvent.addWheelEvent(() => {
    map.mapGrid.load1(viewportMercator.zoom, (image) => {
        map.draw();
    });
    map.draw();
});
canvasEvent.addDraggingEvent(() => {
    map.draw();
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

function registerInputs() {
    const input: HTMLElement | null = document.getElementById("nameInput");
    const btn: HTMLElement | null = document.getElementById("doRefresh");
    const result: HTMLElement | null = document.getElementById("result");
    const redrawMapGrid: HTMLInputElement | null = document.getElementById("redrawMapGrid")  as HTMLInputElement;
    const viewportCanvasMagnification: HTMLInputElement | null = document.getElementById("viewportCanvasMagnification")  as HTMLInputElement;
    viewportCanvasMagnification.value = viewport.viewPortCanvasMagnification.x.toString();
    if (btn && input && result && redrawMapGrid) {
        btn.addEventListener("click", () => {
            viewport.viewPortCanvasMagnification.set2(parseFloat(viewportCanvasMagnification.value),parseFloat(viewportCanvasMagnification.value));
            map.draw();
            if(redrawMapGrid.value.trim() === "1")
            {
                map.mapGrid.load1(zoom, (image) => {
                    map.draw();
                });
            }
            var value = input.textContent.trim();
            if (!value) {
                result.textContent = "Please enter a name.";
                value = "World";
            }
            result.textContent = `Hello, ${value}!`;
            
        });
    }
}
registerInputs();

function doTests() {
    //doTest1();
    //doTest2();
    doTest3();
}
function doTest1(): MercatorViewport {
    //TestsdoTest1()
    let testZoom = 2;
    let testMapProject = new MercatorWeb();
    let testViewport = new Viewport2d();
    let testViewportMercator: MercatorViewport = new MercatorViewport(
        testMapProject,
        testViewport,
        testZoom,
    );
    testViewport.canvasBounds.setBounds(512, 512);
    testViewportMercator.applyViewportMagnificationForZoom(testZoom);
    testViewport.viewPortCanvasMagnification.scale(0.95);

    let viewportPosition = new Point2d(180 / mercatorViewportPixel, 0);
    var canvasPosition = new Point2d(256, 256);
    testViewport.setCanvasPositionOfViewportCenter(
        viewportPosition,
        canvasPosition,
    );

    let gc = new GridCalculator(testViewportMercator);
    let tileBounds = gc.calculateGrid();
    return testViewportMercator;
}

function doTest2() {
    // let mapProject = new MercatorWeb();
    // var lat = mapProject.pixelsToLatDeg(128,zoom);
    // console.log("z2 lat at 128px",lat);
    //z2 lat at 128px 40.97989806962015
    /*
lat = mapProject.pixelsToLatDeg(256,zoom);
console.log("z2 lat at 256px",lat);
//lat at 256 66.51326044311188 zoom 2
lat = mapProject.pixelsToLatDeg(512,zoom);
console.log("z2 lat at 512px",lat);
//lat at 512 85.0511287798066

//This is kind of wrong
var viewportPosition = new Point2d(180 / mercatorViewportPixel,-90/ (mercatorViewportPixel));
*/
    /*
// to put map center a tile down at zoom level 2 (4 tiles) (map size 512x512)
let x = mapProject.latDegToPixels(66.51326044311188,zoom);
var viewportPosition = new Point2d(180 / mercatorViewportPixel,-x/zoom);
*/
    //this.viewport: _canvasBounds:(x=0, y=0, sizeX=512, sizeY=512), _viewPortCanvasMagnification:Point(x=0.4018775720164611, y=0.4018775720164611), _canvasPositionOfViewportCenter:Point(x=-388.4424746666666, y=254.3598826666668))
    // viewport.viewPortCanvasMagnification.set2(0.06490547151887452, 0.06490547151887452);
    // viewport.canvasPositionOfViewportCenter.set2(-2936.5758251383163, -797.048546367439)
    //this.viewport: _canvasBounds:(x=0, y=0, sizeX=2160, sizeY=399), _viewPortCanvasMagnification:Point(x=0.06490547151887452, y=0.06490547151887452), _canvasPositionOfViewportCenter:Point(x=-2936.5758251383163, y=-797.048546367439))
    // viewport.viewPortCanvasMagnification.set2(0.007279580562775083, 0.007279580562775083);
    // viewport.canvasPositionOfViewportCenter.set2(-32885.035985341856, -9258.080997512228);
    // this.viewport: _canvasBounds:(x=0, y=0, sizeX=1585, sizeY=431), _viewPortCanvasMagnification:Point(x=0.007279580562775083, y=0.007279580562775083), _canvasPositionOfViewportCenter:Point(x=-32885.035985341856, y=-9258.080997512228))
    //viewportMercator.applyViewportMagnificationForZoom(zoom);
}

function doTest3(): MercatorViewport {
    //TestsdoTest1()
    let testZoom = 3;
    let testMapProject = new MercatorWeb();
    let testViewport = new Viewport2d();
    let testViewportMercator: MercatorViewport = new MercatorViewport(
        testMapProject,
        testViewport,
        testZoom,
    );
    testViewport.canvasBounds.setBounds(512, 512);
    testViewportMercator.applyViewportMagnificationForZoom(testZoom);
    testViewport.viewPortCanvasMagnification.scale(0.95);

    let viewportPosition = new Point2d(180 / mercatorViewportPixel, 0);
    var canvasPosition = new Point2d(256, 256);
    testViewport.setCanvasPositionOfViewportCenter(
        viewportPosition,
        canvasPosition,
    );

    let gc = new GridCalculator(testViewportMercator);
    let tileBounds = gc.calculateGrid();
    return testViewportMercator;
}
