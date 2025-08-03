import { Point2d } from "../viewport/point2d";
import { Viewport2d } from "../viewport/viewport2d";

export default class CanvasEvent{

    currentPosition = new Point2d();
    previousViewPortPosition = new Point2d();

    constructor(private canvas: HTMLCanvasElement,
        private viewport: Viewport2d
    )
    {

    }
    addWheelEvent(callback: () => void = () => { })
    {
        this.canvas.addEventListener(
            'wheel',
            (event: WheelEvent) => {
                event.preventDefault(); // Prevent page scroll
        
                const delta = event.deltaY;
        

                this.currentPosition.set2(event.offsetX,event.offsetY);
                this.viewport.canvasToViewPort(this.currentPosition,this.previousViewPortPosition);

                var dir = 1;
                if (delta < 0) {



                    this.viewport.viewPortCanvasMagnification.scale((dir + 0.2));
                } else {

                    this.viewport.viewPortCanvasMagnification.scale(1/(dir + 0.2));
                   
                }
        
                
                this.viewport.setCanvasPositionOfViewportCenter(this.previousViewPortPosition,this.currentPosition);
 
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
            console.log('Mouse down at', event.offsetX, event.offsetY);
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
            console.log('Mouse up - drag ended',(drag.x - event.offsetX),(drag.y - event.offsetY));
            this.viewport.canvasPositionOfViewportCenter.x = this.viewport.canvasPositionOfViewportCenter.x - (drag.x - event.offsetX);
            this.viewport.canvasPositionOfViewportCenter.y = this.viewport.canvasPositionOfViewportCenter.y - (drag.y - event.offsetY);
            //draw(fixes.fixList);
            callback();
        

        });

        // Also end drag if mouse leaves canvas
        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
    }

}