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

    this.init();
    this.mouseHandler();
  }

  async init() {
    this.existingShapes = getExistingShape();
  }

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const drawShape = (s: Shape) => {
      //prettier-ignore
      switch (s.type) {
        case "Rectangle":
        case "Ellipse":
        case "Diamond":
          const minX = Math.min(s.startX, s.endX);
          const minY = Math.min(s.startY, s.endY);
          const maxX = Math.max(s.startX, s.endX);
          const maxY = Math.max(s.startY, s.endY);
          if(s.type=="Rectangle") drawRectangle({ctx:this.ctx, minX:minX, minY:minY, maxX:maxX, maxY:maxY});
          if(s.type=="Ellipse") drawEllipse({ctx:this.ctx, minX:minX, minY:minY, maxX:maxX, maxY:maxY});
          if(s.type=="Diamond") drawDiamond({ctx:this.ctx, minX:minX, minY:minY, maxX:maxX, maxY:maxY});
          break;

        case "Line": drawLine({ctx:this.ctx, startX:s.startX, startY:s.startY ,endX:s.endX, endY:s.endY}); break;
        case "Arrow": drawArrow({ctx:this.ctx, startX:s.startX, startY:s.startY ,endX:s.endX, endY:s.endY});break;
        case "Pencil":drawPencil({ctx:this.ctx, points:s.points})

         
      }
    };
    this.existingShapes.forEach(drawShape);
    if (this.previewShape) {
      drawShape(this.previewShape);
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
      if (currentShape == "Pencil") {
        if (this.points.length == 0)
          this.points.push([this.startX, this.startY]);
        this.points.push([currentX, currentY]);
        const tempShape: Shape = {
          type: "Pencil",
          points: this.points,
        };
        this.existingShapes.push(tempShape);
      } else {
        const tempShape: Shape = {
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
        };
        this.existingShapes.push(tempShape);
      }
    }
    this.points = [];
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
      if (currentShape == "Pencil") {
        if (this.points.length == 0)
          this.points.push([this.startX, this.startY]);
        this.points.push([currentX, currentY]);
        this.previewShape = {
          type: "Pencil",
          points: this.points,
        };
      } else {
        const tempShape: Shape = {
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
        };
        this.previewShape = tempShape;
      }
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
