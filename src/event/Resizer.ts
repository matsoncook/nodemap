import { Viewport2d } from "../viewport/viewport2d";

export default class Resizer {

    private _width = 512;
    private _height = 512;

    constructor(private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D | null,
        private viewport: Viewport2d,
        private callback: () => void = () => { }) {
        window.addEventListener("resize", this.handleResize);
        this.handleResize(); // initial call
    }

    public handleResize = () => {

        //console.log(`New size: ${window.innerWidth} x ${window.innerHeight}`);

        // this.canvas.width = window.innerWidth -2 -16; // the 16 is because the body has margins of 8 ??
        // this.canvas.height = window.innerHeight -2 -16 -2;

        this.canvas.width = this.width; // the 16 is because the body has margins of 8 ??
        this.canvas.height = this.height;

        // Optionally: clear and redraw if needed
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.viewport.canvasPositionOfViewportCenter.x = this.canvas.width /2;
        // this.viewport.canvasPositionOfViewportCenter.y = this.canvas.height /2;

        this.viewport.canvasBounds.setBounds(this.canvas.width,this.canvas.height);

        this.callback();
        //draw(fixes.fixList);
        
    };

    public get width() {
        return this._width;
    }
    public set width(value) {
        this._width = value;
    }
    public get height() {
        return this._height;
    }
    public set height(value) {
        this._height = value;
    }
}