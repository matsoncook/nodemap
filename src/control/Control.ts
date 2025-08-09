import OcsMap from "../map/map";
import MercatorViewport from "../map/MercatorViewport";
import { Viewport2d } from "../viewport/viewport2d";

export default class Control
{
  input: HTMLElement | null = document.getElementById("nameInput");
  btn: HTMLElement | null = document.getElementById("doRefresh");
  result: HTMLElement | null = document.getElementById("result");
  redrawMapGrid: HTMLInputElement | null = document.getElementById("redrawMapGrid")  as HTMLInputElement;
  viewportCanvasMagnification: HTMLInputElement | null = document.getElementById("viewportCanvasMagnification")  as HTMLInputElement;
  canvasPositionOfViewportCenterX: HTMLInputElement | null = document.getElementById("canvasPositionOfViewportCenterX")  as HTMLInputElement;
  canvasPositionOfViewportCenterY: HTMLInputElement | null = document.getElementById("canvasPositionOfViewportCenterY")  as HTMLInputElement;
  constructor(private map : OcsMap, private mercatorViewport : MercatorViewport, private viewport : Viewport2d){

    //this.setup();
  }

  setup(){
        
        if (this.btn && this.input && this.result && this.redrawMapGrid && this.viewportCanvasMagnification && this.canvasPositionOfViewportCenterX && this.canvasPositionOfViewportCenterY) {
          this.populateInputs();

          this.btn.addEventListener("click", this.buttonEvent);
        }
    }

    buttonEvent()
  {
    if (this.btn && this.input && this.result && this.redrawMapGrid && this.viewportCanvasMagnification && this.canvasPositionOfViewportCenterX && this.canvasPositionOfViewportCenterY) {
        
      this.populateMapParameters();

      this.map.draw();
        if(this.redrawMapGrid.value.trim() === "1")
        {
          this.map.mapGrid.load1(this.mercatorViewport.zoom, (image) => {
            this.map.draw();
            });
        }
        var value = this.input.textContent.trim();
        if (!value) {
          this.result.textContent = "Please enter a name.";
            value = "World";
        }
    this.result.textContent = `Hello, ${this.viewport.toString()}!`;
  }
  }

  populateInputs()
  {
      if (this.btn && this.input && this.result && this.redrawMapGrid && this.viewportCanvasMagnification && this.canvasPositionOfViewportCenterX && this.canvasPositionOfViewportCenterY)
      {
        this.result.textContent = `Hello, ${this.viewport.toString()}!`;
        this.viewportCanvasMagnification.valueAsNumber = this.viewport.viewPortCanvasMagnification.x;
        this.canvasPositionOfViewportCenterX.valueAsNumber = this.viewport.canvasPositionOfViewportCenter.x;
        this.canvasPositionOfViewportCenterY.valueAsNumber = this.viewport.canvasPositionOfViewportCenter.y;
      }
  }

  populateMapParameters()
  {
      if (this.btn && this.input && this.result && this.redrawMapGrid && this.viewportCanvasMagnification && this.canvasPositionOfViewportCenterX && this.canvasPositionOfViewportCenterY)
      {
        this.viewport.viewPortCanvasMagnification.set2(this.viewportCanvasMagnification.valueAsNumber,this.viewportCanvasMagnification.valueAsNumber);
        this.viewport.canvasPositionOfViewportCenter.set2(this.canvasPositionOfViewportCenterX.valueAsNumber,this.canvasPositionOfViewportCenterY.valueAsNumber);
      }
  }
  
}