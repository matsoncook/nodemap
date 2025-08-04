import CanvasEvent from "./event/CanvasEvent";
import Resizer from "./event/Resizer";
import LatLon from "./map/LatLon";

import OcsMap from "./map/map";
import MercatorViewport from "./map/MercatorViewport";
import SubImage from "./mapimage/SubImage";
import MercatorWeb from "./project/MercatorWeb";
import Route from "./route/Route";
import RouteRenderer from "./route/RouteRenderer";
import WebServerInterface from "./server/webserverinterface";
import LatLonConverter from "./util/LatLonConverter";
import Util from "./util/Util";

import { Viewport2d } from "./viewport/viewport2d";

var zoom = 1;


const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

var viewport = new Viewport2d();
var mapProject = new MercatorWeb();
var viewportMercator : MercatorViewport = new MercatorViewport(mapProject,viewport);

var map = new OcsMap(canvas,ctx,viewportMercator);

var resizer1 = new Resizer(canvas,ctx,viewport,()=>{
    map.draw();
});


var canvasEvent = new CanvasEvent(canvas,viewport);
canvasEvent.addWheelEvent(()=>{ map.draw();})
canvasEvent.addDraggingEvent(()=>{ map.draw();})




var webServerInterface : WebServerInterface = new WebServerInterface();

webServerInterface.makeAjaxCall('/map_static/go_fixes.json', onSuccess);

function onSuccess(json : any)
{

    map.fixes.fixList = json;
    
    map.draw();
}

// webServerInterface.makeAjaxCall('/api/get_route_list?id=AAA', (json)=>{
//     var routes = JSON.parse(json);
//     var latLonConverter : LatLonConverter = new LatLonConverter()
//     for (var route_json in routes)
//     {
//         var route = new Route(route_json[0],route_json[1]);
//         var routeRenderer = new RouteRenderer(route);
//         routeRenderer.prepare(latLonConverter);
//         map.routeRendererList.push(routeRenderer)
//     }

//     console.log(json);
// });

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







// var tileSize = 256;
// var lat90 = projectLat(tileSize,zoom);
// var lon180_1 = projectLon(tileSize,zoom);
// var lon360_1 = projectLon(tileSize*2,zoom);
// var lon180 = 180; //projectLon(tileSize,zoom);
// var lon360 = 360; //projectLon(tileSize*2,zoom);


// var subImage00 = new SubImage(1,1,1,  new LatLon( 0,lat90),       new LatLon(lon180, 0),(image)=>{
//     map.draw();
// }).load();

// var subImage01 = new SubImage(1,1,0,  new LatLon( 0,0),           new LatLon(lon180, -lat90),(image)=>{
//     map.draw();
// }).load();

// var subImage10 = new SubImage(1,0,1,  new LatLon( -lon180,lat90),  new LatLon(lon360, 0),(image)=>{
//     map.draw();
// }).load();

// var subImage11 = new SubImage(1,0,0,  new LatLon( -lon180,0),      new LatLon(lon360, -lat90),(image)=>{
//     map.draw();
// }).load();


map.mapGrid.load(zoom,(image)=>{
    map.draw();
});


//map.mapGrid.grid = [[subImage00, subImage01, subImage11,subImage10]];
//map.mapGrid.grid = [[subImage00]];


