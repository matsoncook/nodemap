import Resizer from "../event/Resizer";
import OcsMap from "../map/map";
import MercatorViewport from "../map/MercatorViewport";
import { Point2d } from "../viewport/point2d";
import { Viewport2d } from "../viewport/viewport2d";

export default class Control {
  input: HTMLElement = document.getElementById("nameInput") as HTMLElement;
  btn: HTMLElement = document.getElementById("doRefresh") as HTMLElement;
  result: HTMLInputElement = document.getElementById(
    "result",
  ) as HTMLInputElement;
  gridCalculatorResult: HTMLDivElement = document.getElementById(
    "gridCalculatorResult",
  ) as HTMLDivElement;
  redrawMapGrid: HTMLInputElement = document.getElementById(
    "redrawMapGrid",
  ) as HTMLInputElement;
  zoom: HTMLInputElement = document.getElementById("zoom") as HTMLInputElement;
  viewportCanvasMagnification: HTMLInputElement = document.getElementById(
    "viewportCanvasMagnification",
  ) as HTMLInputElement;
  canvasPositionOfViewportCenterX: HTMLInputElement = document.getElementById(
    "canvasPositionOfViewportCenterX",
  ) as HTMLInputElement;
  canvasPositionOfViewportCenterY: HTMLInputElement = document.getElementById(
    "canvasPositionOfViewportCenterY",
  ) as HTMLInputElement;

  /*
<input id="doCenterLat" type="number" value="0"  />
  </label>
  <label>
<input id="doCenterLon" type="number" value="180"  />
    </label>
<button id="doCenterLatLon">doCenterLatLon</button>

  
  */

  doCenterLat: HTMLInputElement = document.getElementById(
    "doCenterLat",
  ) as HTMLInputElement;
  doCenterLon: HTMLInputElement = document.getElementById(
    "doCenterLon",
  ) as HTMLInputElement;
  doCenterLatLon: HTMLButtonElement = document.getElementById(
    "doCenterLatLon",
  ) as HTMLButtonElement;
  /*
  <input id="doCanvasSizeChangeX" type="number" value="512"  />
    </label>
    <label>
  <input id="doCanvasSizeChangeY" type="number" value="512"  />
      </label>
  <button id="doCanvasSizeChange">doCanvasSizeChange</button>
  */
  doCanvasSizeChangeX: HTMLInputElement = document.getElementById(
    "doCanvasSizeChangeX",
  ) as HTMLInputElement;
  doCanvasSizeChangeY: HTMLInputElement = document.getElementById(
    "doCanvasSizeChangeY",
  ) as HTMLInputElement;
  doCanvasSizeChange: HTMLButtonElement = document.getElementById(
    "doCanvasSizeChange",
  ) as HTMLButtonElement;

  /*
  <input id="pixelToLat_pixel" type="number" value="512"  />
    </label>
    <label>Lat:
  <input id="pixelToLat_lat" type="number" value="512"  />
      </label>
  <button id="pixelToLat">pixelToLat</button>
  */

  pixelToLat_pixel: HTMLInputElement = document.getElementById(
    "pixelToLat_pixel",
  ) as HTMLInputElement;
  pixelToLat_lat: HTMLInputElement = document.getElementById(
    "pixelToLat_lat",
  ) as HTMLInputElement;
  pixelToLat: HTMLButtonElement = document.getElementById(
    "pixelToLat",
  ) as HTMLButtonElement;


  constructor(
    private map: OcsMap,
    private mercatorViewport: MercatorViewport,
    private viewport: Viewport2d,
    private resizer: Resizer,
  ) {
    //this.setup();
  }

  setup() {
    this.populateInputs();

    this.btn.addEventListener("click", this.refreshButtonEvent);
    this.doCanvasSizeChange.addEventListener(
      "click",
      this.doCanvasSizeChangeButtonEvent,
    );
    this.doCenterLatLon.addEventListener(
      "click",
      this.doCenterLatLonButtonEvent,
    );

    this.pixelToLat.addEventListener(
      "click",
      this.pixelToLatButtonEvent,
    )
  }

  refreshButtonEvent = (event: Event) => {
    this.populateMapParameters();

    this.map.draw();
    if (this.redrawMapGrid.value.trim() === "1") {
      this.map.mapGrid.load1(this.mercatorViewport.zoom, (image) => {
        this.map.draw();
      });
    }
    this.populateDescription();
  };
  doCanvasSizeChangeButtonEvent = (event: Event) => {
    this.populateMapParameters();
    this.resizer.width = this.doCanvasSizeChangeX.valueAsNumber;
    this.resizer.height = this.doCanvasSizeChangeY.valueAsNumber;
    this.resizer.handleResize();

    this.populateDescription();
  };
  doCenterLatLonButtonEvent = (event: Event) => {

    let viewportPosition = new Point2d(this.doCenterLon.valueAsNumber * (512/360), this.doCenterLat.valueAsNumber);
    let canvasPosition = new Point2d(this.resizer.width/2, this.resizer.height/2);
    this.viewport.setCanvasPositionOfViewportCenter(viewportPosition,canvasPosition);
    

    //this.populateMapParameters();

    this.map.draw();
    if (this.redrawMapGrid.value.trim() === "1") {
      this.map.mapGrid.load1(this.mercatorViewport.zoom, (image) => {
        this.map.draw();
      });
    }
    this.populateInputs();
    this.populateDescription();
  };
  pixelToLatButtonEvent = (event: Event) => {

      let lat = this.mercatorViewport.mercatorWeb.pixelsToLatDeg(this.pixelToLat_pixel.valueAsNumber, this.mercatorViewport.zoom);
      this.pixelToLat_lat.valueAsNumber = lat;
    };
  

  populateDescription() {
    let a = `Zoom: ${this.mercatorViewport.zoom}, ${this.viewport.toString()}`;
    let b = this.map.mapGrid.gridCalculator.toString();

    this.result.textContent = a;
    this.gridCalculatorResult.textContent = b;
  }

  populateInputs() {
    this.result.textContent = `Viewport, ${this.viewport.toString()}!`;
    this.viewportCanvasMagnification.valueAsNumber =
      this.viewport.viewPortCanvasMagnification.x;
    this.canvasPositionOfViewportCenterX.valueAsNumber =
      this.viewport.canvasPositionOfViewportCenter.x;
    this.canvasPositionOfViewportCenterY.valueAsNumber =
      this.viewport.canvasPositionOfViewportCenter.y;
    this.zoom.valueAsNumber = this.mercatorViewport.zoom;

    this.populateDescription();
  }

  populateMapParameters() {
    this.viewport.viewPortCanvasMagnification.set2(
      this.viewportCanvasMagnification.valueAsNumber,
      this.viewportCanvasMagnification.valueAsNumber,
    );
    this.viewport.canvasPositionOfViewportCenter.set2(
      this.canvasPositionOfViewportCenterX.valueAsNumber,
      this.canvasPositionOfViewportCenterY.valueAsNumber,
    );
    this.mercatorViewport.zoom = this.zoom.valueAsNumber;
  }
}
