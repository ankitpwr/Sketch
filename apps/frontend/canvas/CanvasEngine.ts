import {
  drawArrow,
  drawDiamond,
  drawEllipse,
  drawLine,
  drawPencil,
  drawRectangle,
} from "./draw";
import { getExistingShape } from "./http";
import { Action, Points, Shape, Tool } from "./types";

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
  public points: Points[];
  public lastX: number | null;
  public lastY: number | null;

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
    this.points = [];
    this.lastX = null;
    this.lastY = null;
    this.init();
    this.mouseHandler();
  }

  async init() {
    this.existingShapes = getExistingShape();
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.existingShapes.forEach((storedShape, index) => {
      const shape = storedShape;
      const minX = Math.min(shape.startX, shape.endX);
      const minY = Math.min(shape.startY, shape.endY);
      const maxX = Math.max(shape.startX, shape.endX);
      const maxY = Math.max(shape.startY, shape.endY);
      if (shape.type == "Rectangle") {
        drawRectangle({
          ctx: this.ctx,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        });
      } else if (shape.type == "Ellipse") {
        drawEllipse({
          ctx: this.ctx,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        });
      } else if (shape.type == "Diamond") {
        drawDiamond({
          ctx: this.ctx,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        });
      } else if (shape.type == "Line") {
        drawLine({
          ctx: this.ctx,
          startX: shape.startX,
          startY: shape.startY,
          endX: shape.endX,
          endY: shape.endY,
        });
      } else if (shape.type == "Arrow") {
        drawArrow({
          ctx: this.ctx,
          startX: shape.startX,
          startY: shape.startY,
          endX: shape.endX,
          endY: shape.endY,
        });
      }
    });

    if (this.previewShape) {
      const shape = this.previewShape;
      const minX = Math.min(shape.startX, shape.endX);
      const minY = Math.min(shape.startY, shape.endY);
      const maxX = Math.max(shape.startX, shape.endX);
      const maxY = Math.max(shape.startY, shape.endY);

      if (this.previewShape.type == "Rectangle") {
        drawRectangle({
          ctx: this.ctx,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        });
      } else if (this.previewShape.type == "Ellipse") {
        drawEllipse({
          ctx: this.ctx,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        });
      } else if (this.previewShape.type == "Diamond") {
        drawDiamond({
          ctx: this.ctx,
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY,
        });
      } else if (this.previewShape.type == "Line") {
        drawLine({
          ctx: this.ctx,
          startX: shape.startX,
          startY: shape.startY,
          endX: shape.endX,
          endY: shape.endY,
        });
      } else if (this.previewShape.type == "Arrow") {
        drawArrow({
          ctx: this.ctx,
          startX: shape.startX,
          startY: shape.startY,
          endX: shape.endX,
          endY: shape.endY,
        });
      } else if (shape.type == "Pencil") {
        this.points.push([shape.endX, shape.endY]);
        if (!this.lastX || !this.lastY) {
          this.lastX = shape.startX;
          this.lastY = shape.startY;
          this.points.push([shape.startX, shape.startY]);
        }
        drawPencil({
          ctx: this.ctx,
          points: this.points,
          lastX: this.lastX,
          lastY: this.lastY,
        });
        this.lastX = shape.endX;
        this.lastY = shape.endY;
      }
    }
    this.ctx.restore();
  }

  handleMouseDown = (e: MouseEvent) => {
    console.log("mousedown");

    this.mouseDown = true;
    this.startX = this.getCoordinates(e)[0];
    this.startY = this.getCoordinates(e)[1];
  };
  handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup");

    this.mouseDown = false;
    this.points = [];
    this.lastX = null;
    this.lastY = null;
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];

    if (
      this.currentTool == "Rectangle" ||
      this.currentTool == "Ellipse" ||
      this.currentTool == "Diamond" ||
      this.currentTool == "Line" ||
      this.currentTool == "Arrow" ||
      this.currentTool == "Pencil"
    ) {
      const currentShape = this.currentTool;
      const tempShape: Shape = {
        type: currentShape,
        startX: this.startX,
        startY: this.startY,
        endX: currentX,
        endY: currentY,
      };
      this.existingShapes.push(tempShape);
    }
  };
  handleMouseMove = (e: MouseEvent) => {
    if (!this.mouseDown) return;
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];

    if (
      this.currentTool == "Rectangle" ||
      this.currentTool == "Ellipse" ||
      this.currentTool == "Diamond" ||
      this.currentTool == "Line" ||
      this.currentTool == "Arrow" ||
      this.currentTool == "Pencil"
    ) {
      const currentShape = this.currentTool;
      const tempShape: Shape = {
        type: currentShape,
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
