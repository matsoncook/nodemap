import MercatorViewport from "../map/MercatorViewport";
import { Point2d } from "../viewport/point2d";
import { Viewport2d } from "../viewport/viewport2d";

export default class CanvasEvent{

    currentCanvasPosition = new Point2d();
    previousViewPortPosition = new Point2d();
    viewport : Viewport2d;

    constructor(private canvas: HTMLCanvasElement,
        private mercatorViewport: MercatorViewport
    )
    {
        this.viewport = mercatorViewport.viewport;
    }
    addWheelEvent(callback: () => void = () => { })
    {
        this.canvas.addEventListener(
            'wheel',
            (event: WheelEvent) => {
                event.preventDefault(); // Prevent page scroll
        
                const delta = event.deltaY;
        
                //This setup the viewport magic
                this.currentCanvasPosition.set2(event.offsetX,event.offsetY);
                this.viewport.canvasToViewPort(this.currentCanvasPosition,this.previousViewPortPosition);
                //---
                
                var dir = 1;
                if (delta < 0) {
                    this.viewport.viewPortCanvasMagnification.scale(1/(dir + 0.2));
                } else {
                    this.viewport.viewPortCanvasMagnification.scale((dir + 0.2));       
                }
                if (delta < 0) {
                    this.mercatorViewport.zoom += 1;
                }
                else{
                    this.mercatorViewport.zoom -= 1;
                }

                this.mercatorViewport.applyViewportMagnificationForZoom(this.mercatorViewport.zoom);
                
                //This does the viewport magic
                this.viewport.setCanvasPositionOfViewportCenter(this.previousViewPortPosition,this.currentCanvasPosition);
                // console.log()
 
                console.log("this.viewport: " +this.viewport);

                callback();

            },
            { passive: false } // Important to allow preventDefault
        );
    }

    addDraggingEvent(callback: () => void = () => { })
    {
        let isDragging = false;
        var drag = new Point2d();

        this.canvas.addEventListener('mousedown', (event: MouseEvent) => {
            isDragging = true;
            //console.log('Mouse down at', event.offsetX, event.offsetY);
            drag.x = event.offsetX;
            drag.y = event.offsetY;
        });

// canvas.addEventListener('mousemove', (event: MouseEvent) => {
//     if (isDragging) {
//         console.log('Dragging at', event.offsetX, event.offsetY);
//         // Your drag handling logic here
//     }
// });

// End drag on mouse up
        this.canvas.addEventListener('mouseup', (event: MouseEvent) => {
            isDragging = false;
            //console.log('Mouse up - drag ended',(drag.x - event.offsetX),(drag.y - event.offsetY));
            this.viewport.canvasPositionOfViewportCenter.x = this.viewport.canvasPositionOfViewportCenter.x - (drag.x - event.offsetX);
            this.viewport.canvasPositionOfViewportCenter.y = this.viewport.canvasPositionOfViewportCenter.y - (drag.y - event.offsetY);

            console.log("this.viewport: " +this.viewport);
            //draw(fixes.fixList);
            callback();
        

        });

        // Also end drag if mouse leaves canvas
        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }

}