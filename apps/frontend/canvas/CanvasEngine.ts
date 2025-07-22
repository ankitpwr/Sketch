import {
  Action,
  Points,
  ResizeHandlers,
  Shape,
  ShapeType,
  Tool,
} from "./types/types";
import { drawRoundedRectangle } from "./draw/drawRoundedRectangle";
import { drawEllipse } from "./draw/drawEllipse";
import { drawDiamond } from "./draw/drawDiamond";
import { drawLine } from "./draw/drawLine";
import { drawArrow } from "./draw/drawArrow";
import { drawPencil } from "./draw/drawPencil";
import { getExistingShape } from "./utils/storage";
import { isNeartheShape } from "./utils/geometry";
import { ShapeManager } from "./ShapeManager";
import { ShieldPlus } from "lucide-react";

//------0-0-0-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
  private panX: number;
  private panY: number;
  private scale: number;
  private pressedKey: string | null;
  private selectedShape: {
    type: ShapeType | null;
    index: number;
    offsetX: number;
    offsetY: number;
  };
  private resizeHandlers: ResizeHandlers[];
  private resizeoffset: { x: number; y: number };
  private resizeSide:
    | "TopLeft"
    | "TopRight"
    | "BottomLeft"
    | "BottomRight"
    | null;
  private scaleOffset: { x: number; y: number };
  private shapeMangager: ShapeManager;

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
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;
    this.scaleOffset = { x: 0, y: 0 };
    this.selectedShape = { type: null, index: -1, offsetX: 0, offsetY: 0 };
    this.resizeoffset = { x: 0, y: 0 };
    this.resizeHandlers = [];
    this.resizeSide = null;
    this.init();
    this.mouseHandler();
    this.pressedKey = null;

    this.shapeMangager = new ShapeManager({
      ctx: this.ctx,
      existingShapes: this.existingShapes,
      selectedShape: this.selectedShape,
      scale: this.scale,
      triggerRender: () => this.render(),
    });
  }

  async init() {
    const loadedShaped = await getExistingShape();
    this.existingShapes.push(...loadedShaped);
    this.render();
  }
  handleCanvasResize = () => {
    this.render();
  };

  render() {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(
      this.panX * this.scale - this.scaleOffset.x,
      this.panY * this.scale - this.scaleOffset.y
    );
    this.ctx.scale(this.scale, this.scale);
    const drawShape = (s: Shape) => {
      //prettier-ignore
      switch (s.type) {
        case "Rectangle":
        case "Ellipse":
        case "Diamond":
          if(s.type=="Rectangle") drawRoundedRectangle({ctx:this.ctx, minX:s.startX, minY:s.startY, maxX:s.endX, maxY:s.endY});
          if(s.type=="Ellipse") drawEllipse({ctx:this.ctx, minX:s.startX, minY:s.startY, maxX:s.endX, maxY:s.endY});
          if(s.type=="Diamond") drawDiamond({ctx:this.ctx, minX:s.startX, minY:s.startY, maxX:s.endX, maxY:s.endY});
          break;

        case "Line": drawLine({ctx:this.ctx, startX:s.startX, startY:s.startY ,endX:s.endX, endY:s.endY}); break;
        case "Arrow": drawArrow({ctx:this.ctx, startX:s.startX, startY:s.startY ,endX:s.endX, endY:s.endY});break;
        case "Pencil":drawPencil({ctx:this.ctx, points:s.points}); break;

         
      }
    };
    this.existingShapes.forEach(drawShape);
    if (this.previewShape) {
      drawShape(this.previewShape);
    }

    if (this.selectedShape.index != -1) {
      this.shapeMangager.drawBoundBox();
    }
    this.ctx.restore();
  }

  handleMouseDown = (e: MouseEvent) => {
    console.log("mousedown");
    this.mouseDown = true;
    this.startX = this.getCoordinates(e)[0];
    this.startY = this.getCoordinates(e)[1];

    if (this.currentTool == "Select" && this.selectedShape.index != -1) {
      const resizeHandlers = this.shapeMangager.resizeHandlers;

      for (let i = 0; i < resizeHandlers.length; i++) {
        const currentHandler = resizeHandlers[i];
        if (isNeartheShape(this.startX, this.startY, currentHandler)) {
          this.shapeMangager.resizeSide = currentHandler.side;
          this.action = "resizing";
          this.render();
          return;
        }
      }
    }
    let shapeFound = false;
    if (this.currentTool == "Select") {
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        if (isNeartheShape(this.startX, this.startY, this.existingShapes[i])) {
          this.selectedShape.index = i;
          this.selectedShape.type = this.existingShapes[i].type;
          this.selectedShape.offsetX = this.startX;
          this.selectedShape.offsetY = this.startY;
          this.action = "moving";
          shapeFound = true;
          this.render();
          break;
        }
      }
    }

    if (!shapeFound) {
      this.selectedShape.type = null;
      this.selectedShape.index = -1;
      this.selectedShape.offsetX = 0;
      this.selectedShape.offsetY = 0;
      this.shapeMangager.clearResizeHandler();
      this.render();
    }
  };
  handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup");
    this.mouseDown = false;
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];

    if (this.action == "resizing") {
      const index = this.selectedShape.index;
      const shape = this.existingShapes[index];
      if (
        shape &&
        (shape.type === "Rectangle" ||
          shape.type === "Ellipse" ||
          shape.type === "Diamond")
      ) {
        const tempStartX = shape.startX;
        const tempStartY = shape.startY;
        const tempEndX = shape.endX;
        const tempEndY = shape.endY;

        shape.startX = Math.min(tempStartX, tempEndX);
        shape.startY = Math.min(tempStartY, tempEndY);
        shape.endX = Math.max(tempStartX, tempEndX);
        shape.endY = Math.max(tempStartY, tempEndY);
      }
      this.action = "none";
      localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      this.shapeMangager.clearResizeHandler();
      console.log(this.selectedShape);
      this.render();
    }
    if (this.action == "moving") {
      localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      this.action = "none";
      this.render();
    } else if (
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
      } else if (currentShape == "Line" || currentShape == "Arrow") {
        const tempShape: Shape = {
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
        };
        this.existingShapes.push(tempShape);
      } else {
        const tempShape = {
          type: currentShape,
          startX: Math.min(this.startX, currentX),
          startY: Math.min(this.startY, currentY),
          endX: Math.max(this.startX, currentX),
          endY: Math.max(this.startY, currentY),
        };
        this.existingShapes.push(tempShape);
      }

      localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      this.render();
      this.points = [];
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];
    if (!this.mouseDown) return;
    else if (this.action == "resizing") {
      this.shapeMangager.handleResizeShape(currentX, currentY);
    } else if (this.action == "moving") {
      this.shapeMangager.handleShapeMovement(currentX, currentY);
    } else if (this.currentTool == "Eraser") {
      const shapeToKeep = this.existingShapes.filter((s, index) => {
        return !isNeartheShape(currentX, currentY, s);
      });
      if (shapeToKeep.length < this.existingShapes.length) {
        this.existingShapes.length = 0;
        this.existingShapes.push(...shapeToKeep);
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
        this.render();
      }
    } else if (
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
      } else if (currentShape == "Line" || currentShape == "Arrow") {
        const tempShape: Shape = {
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
        };
        this.previewShape = tempShape;
      } else {
        const tempShape = {
          type: currentShape,
          startX: Math.min(this.startX, currentX),
          startY: Math.min(this.startY, currentY),
          endX: Math.max(this.startX, currentX),
          endY: Math.max(this.startY, currentY),
        };
        this.previewShape = tempShape;
      }
      this.render();
      this.previewShape = null;
    }
  };

  handleWheelEvent = (e: WheelEvent) => {
    if (this.pressedKey == "Control") {
      this.handleZoom(e.deltaY * -0.01);
    } else {
      this.panX -= e.deltaX;
      this.panY -= e.deltaY;
    }
    this.render();
  };
  handleZoom = (val: number) => {
    this.scale = this.scale + val;
    const scaledWidth = this.canvas.width * this.scale;
    const scaleHeigth = this.canvas.height * this.scale;
    this.scaleOffset.x = (scaledWidth - this.canvas.width) / 2;
    this.scaleOffset.y = (scaleHeigth - this.canvas.height) / 2;
  };
  handleKeyDown = (e: KeyboardEvent) => {
    this.pressedKey = e.key;
  };
  handleKeyUp = (e: KeyboardEvent) => {
    this.pressedKey = null;
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
    this.canvas.addEventListener("wheel", this.handleWheelEvent);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }
  getCoordinates = (e: MouseEvent) => {
    const X =
      (e.offsetX - this.panX * this.scale + this.scaleOffset.x) / this.scale;
    const Y =
      (e.offsetY - this.panY * this.scale + this.scaleOffset.y) / this.scale;
    return [X, Y];
  };
}
