import { getExistingShape } from "./http";
import { Action, Shape, Tool } from "./types";

export class CanvasEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private action: Action;
  public currentTool: Tool;
  private mouseDown: boolean;
  private startX: number;
  private startY: number;
  private previewShape: Shape | null;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.existingShapes = [];
    this.action = "none";
    this.currentTool = "Pan";
    this.mouseDown = false;
    this.startX = 0;
    this.startY = 0;
    this.previewShape = null;
    this.init();
    this.mouseHandler();
  }

  async init() {
    this.existingShapes = getExistingShape();
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.previewShape) {
      if (this.previewShape.type == "Rectangle") {
        console.log("Creating reactangle");
        const shape = this.previewShape;
        const minX = Math.min(shape.startX, shape.endX);
        const minY = Math.min(shape.startY, shape.endY);
        const maxX = Math.max(shape.startX, shape.endX);
        const maxY = Math.max(shape.startY, shape.endY);
        const width = maxX - minX;
        const height = maxY - minY;
        const radius = Math.min(width, height) / 4;
        this.ctx.beginPath();
        this.ctx.roundRect(minX, minY, width, height, radius);
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (this.previewShape.type == "Ellipse") {
        const shape = this.previewShape;
        const minX = Math.min(shape.startX, shape.endX);
        const minY = Math.min(shape.startY, shape.endY);
        const maxX = Math.max(shape.startX, shape.endX);
        const maxY = Math.max(shape.startY, shape.endY);
        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = minX + width / 2;
        const centerY = minY + height / 2;
        this.ctx.beginPath();
        this.ctx.ellipse(
          centerX,
          centerY,
          width / 2,
          height / 2,
          0,
          0,
          2 * Math.PI
        );
        this.ctx.closePath();
        this.ctx.stroke();
      } else if (this.previewShape.type == "Diamond") {
        const shape = this.previewShape;
        const minX = Math.min(shape.startX, shape.endX);
        const minY = Math.min(shape.startY, shape.endY);
        const maxX = Math.max(shape.startX, shape.endX);
        const maxY = Math.max(shape.startY, shape.endY);
        this.ctx.beginPath();
        this.ctx.moveTo(minX, minY + (maxY - minY) / 2);
        this.ctx.lineTo(minX + (maxX - minX) / 2, minY);
        this.ctx.lineTo(maxX, minY + (maxY - minY) / 2);
        this.ctx.lineTo(minX + (maxX - minX) / 2, maxY);
        this.ctx.lineTo(minX, minY + (maxY - minY) / 2);

        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  handleMouseDown = (e: MouseEvent) => {
    this.mouseDown = true;
    this.startX = this.getCoordinates(e)[0];
    this.startY = this.getCoordinates(e)[1];
  };
  handleMouseUp = () => {
    this.mouseDown = false;
  };
  handleMouseMove = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];
    console.log(currentX);
    if (this.currentTool == "Rectangle") {
      console.log("Mouse move is forming Rectangle");
      const tempShape: Shape = {
        type: "Rectangle",
        startX: this.startX,
        startY: this.startY,
        endX: currentX,
        endY: currentY,
      };
      this.previewShape = tempShape;
    } else if (this.currentTool == "Ellipse") {
      const tempShape: Shape = {
        type: "Ellipse",
        startX: this.startX,
        startY: this.startY,
        endX: currentX,
        endY: currentY,
      };
      this.previewShape = tempShape;
    } else if (this.currentTool == "Diamond") {
      const tempShape: Shape = {
        type: "Diamond",
        startX: this.startX,
        startY: this.startY,
        endX: currentX,
        endY: currentY,
      };
      this.previewShape = tempShape;
    }

    this.render();
    this.previewShape = null;
  };

  destroy() {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }
  mouseHandler() {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }
  getCoordinates = (e: MouseEvent) => {
    const X = e.offsetX;
    const Y = e.offsetY;
    return [X, Y];
  };
}
