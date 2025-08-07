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

var zoom = 2;

var mercatorViewportPixel = 360/512;

//Tests
// let testMapProject = new MercatorWeb();
// let testViewport = new Viewport2d();
// let testViewportMercator : MercatorViewport = new MercatorViewport(testMapProject,testViewport);
// //testViewportMercator.applyViewportMagnificationForZoom(zoom);
// let gc = new GridCalculator(testViewportMercator);



const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

var viewport = new Viewport2d();
var mapProject = new MercatorWeb();
var viewportMercator : MercatorViewport = new MercatorViewport(mapProject,viewport,zoom);



viewportMercator.applyViewportMagnificationForZoom(zoom);



var viewportPosition = new Point2d(180 / mercatorViewportPixel,0);
var canvasPosition = new Point2d(256,256);
viewport.setCanvasPositionOfViewportCenter(viewportPosition,canvasPosition);

//this.viewport: _canvasBounds:(x=0, y=0, sizeX=512, sizeY=512), _viewPortCanvasMagnification:Point(x=0.4018775720164611, y=0.4018775720164611), _canvasPositionOfViewportCenter:Point(x=-388.4424746666666, y=254.3598826666668))

// viewport.viewPortCanvasMagnification.set2(0.06490547151887452, 0.06490547151887452);
// viewport.canvasPositionOfViewportCenter.set2(-2936.5758251383163, -797.048546367439)
//this.viewport: _canvasBounds:(x=0, y=0, sizeX=2160, sizeY=399), _viewPortCanvasMagnification:Point(x=0.06490547151887452, y=0.06490547151887452), _canvasPositionOfViewportCenter:Point(x=-2936.5758251383163, y=-797.048546367439))

// viewport.viewPortCanvasMagnification.set2(0.007279580562775083, 0.007279580562775083);
// viewport.canvasPositionOfViewportCenter.set2(-32885.035985341856, -9258.080997512228);
// this.viewport: _canvasBounds:(x=0, y=0, sizeX=1585, sizeY=431), _viewPortCanvasMagnification:Point(x=0.007279580562775083, y=0.007279580562775083), _canvasPositionOfViewportCenter:Point(x=-32885.035985341856, y=-9258.080997512228))




//viewportMercator.applyViewportMagnificationForZoom(zoom);

var map = new OcsMap(canvas,ctx,viewportMercator);

var resizer1 = new Resizer(canvas,ctx,viewport,()=>{
    map.draw();
});


var canvasEvent = new CanvasEvent(canvas,viewportMercator);
canvasEvent.addWheelEvent(()=>{ 
    map.mapGrid.loadAll(viewportMercator.zoom,(image)=>{
        map.draw();
    });
    map.draw();

})
canvasEvent.addDraggingEvent(()=>{ map.draw();})




var webServerInterface : WebServerInterface = new WebServerInterface();

webServerInterface.makeAjaxCall('/map_static/go_fixes.json', onSuccess);

function onSuccess(json : any)
{

    map.fixes.fixList = json;
    
    map.draw();
}



webServerInterface.makeAjaxCall('/api/get_route_list?id=AAA', (json:any)=>{
    
    var latLonConverter : LatLonConverter = new LatLonConverter()
    for (var route_json of json)
    {
        //var route_json = JSON.parse(route_str);
        var route = new Route(route_json["acid"],route_json["route"]);
        var routeRenderer = new RouteRenderer(route);
        routeRenderer.prepare(latLonConverter);
        map.routeRendererList.push(routeRenderer)
    }

    console.log(json);
});




map.mapGrid.loadAll(zoom,(image)=>{
    map.draw();
});



