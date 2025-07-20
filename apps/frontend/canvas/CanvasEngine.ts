import { Action, Points, Shape, ShapeType, Tool } from "./types/types";
import { drawRectangle } from "./draw/drawRectangle";
import { drawEllipse } from "./draw/drawEllipse";
import { drawDiamond } from "./draw/drawDiamond";
import { drawLine } from "./draw/drawLine";
import { drawArrow } from "./draw/drawArrow";
import { drawPencil } from "./draw/drawPencil";
import { getExistingShape } from "./utils/storage";
import { isNeartheShape } from "./utils/geometry";

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
  private scaleOffset: { x: number; y: number };

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
    this.init();
    this.mouseHandler();
    this.pressedKey = null;
  }

  async init() {
    this.existingShapes = await getExistingShape();
    this.render();
  }

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
        case "Pencil":drawPencil({ctx:this.ctx, points:s.points}); break;

         
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
    if (this.currentTool == "Select") {
      for (let i = 0; i < this.existingShapes.length; i++) {
        if (isNeartheShape(this.startX, this.startY, this.existingShapes[i])) {
          this.selectedShape.index = i;
          this.selectedShape.type = this.existingShapes[i].type;
          this.selectedShape.offsetX = this.startX;
          this.selectedShape.offsetY = this.startY;
          break;
        }
      }
    }
    console.log(this.selectedShape.type);
  };
  handleMouseUp = (e: MouseEvent) => {
    console.log("mouseup");

    this.mouseDown = false;

    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];

    if (this.currentTool == "Select" && this.selectedShape.index != -1) {
      localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      this.selectedShape = { type: null, index: -1, offsetX: 0, offsetY: 0 };
    }

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
      localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      this.render();
      this.points = [];
    }
  };

  handleShapeMovement = (currentX: number, currentY: number) => {
    const index = this.selectedShape.index;
    const shape = this.existingShapes[index];
    const deltaX = currentX - this.selectedShape.offsetX;
    const deltaY = currentY - this.selectedShape.offsetY;
    switch (shape.type) {
      case "Rectangle":
      case "Diamond":
      case "Ellipse":
      case "Line":
      case "Arrow":
        shape.startX += deltaX;
        shape.startY += deltaY;
        shape.endX += deltaX;
        shape.endY += deltaY;
        this.render();
      case "Pencil":
        if (shape.type == "Pencil") {
          shape.points = shape.points.map((point) => {
            return [point[0] + deltaX, point[1] + deltaY];
          });
        }
        this.render();
    }

    this.selectedShape.offsetX = currentX;
    this.selectedShape.offsetY = currentY;
  };

  handleMouseMove = (e: MouseEvent) => {
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];
    if (!this.mouseDown) return;
    else if (this.currentTool == "Select" && this.selectedShape.index != -1) {
      this.handleShapeMovement(currentX, currentY);
    } else if (this.currentTool == "Eraser") {
      const shapeToKeep = this.existingShapes.filter((s, index) => {
        return !isNeartheShape(currentX, currentY, s);
      });
      if (shapeToKeep.length < this.existingShapes.length) {
        this.existingShapes = shapeToKeep;
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
      this.render();
      this.previewShape = null;
    }
  };

  handleWheelEvent = (e: WheelEvent) => {
    if (this.pressedKey == "Control") {
      console.log("clicked");
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
    console.log(this.pressedKey);
  };
  handleKeyUp = (e: KeyboardEvent) => {
    this.pressedKey = null;
    console.log(this.pressedKey);
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
