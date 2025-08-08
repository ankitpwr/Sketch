import { drawRoundedRectangle } from "./draw/drawRoundedRectangle";
import { SocketHandler } from "./SocketHandler";
import { ResizeHandlers, Shape, ShapeType } from "./types/types";
import { BoundingBorderStyles, StrokeColor } from "./utils/drawingConfig";

interface ShapeManagerDependencies {
  ctx: CanvasRenderingContext2D;
  existingShapes: Shape[];
  selectedShape: {
    type: ShapeType | null;
    index: number;
    offsetX: number;
    offsetY: number;
  };
  scale: number;
  triggerRender: () => void;
  socketHandler?: SocketHandler;
}
export class ShapeManager {
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  private selectedShape: {
    type: ShapeType | null;
    index: number;
    offsetX: number;
    offsetY: number;
  };
  public scale: number;
  public resizeHandlers: ResizeHandlers[];
  public resizeSide:
    | "TopLeft"
    | "TopRight"
    | "BottomLeft"
    | "BottomRight"
    | null;
  private triggerRender: () => void;
  private socketHandler: SocketHandler | null = null;

  constructor(dependencies: ShapeManagerDependencies) {
    this.ctx = dependencies.ctx;
    this.existingShapes = dependencies.existingShapes;
    this.selectedShape = dependencies.selectedShape;
    this.resizeHandlers = [];
    this.scale = dependencies.scale;
    this.triggerRender = dependencies.triggerRender;
    this.resizeSide = null;
    console.log(`socket is active`);
    console.log(dependencies.socketHandler);
    if (dependencies.socketHandler) {
      this.socketHandler = dependencies.socketHandler;
    }
  }

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
        this.triggerRender();
        break;
      case "Pencil":
        shape.points = shape.points.map((point) => {
          return [point[0] + deltaX, point[1] + deltaY];
        });
        this.triggerRender();

        break;
    }
    if (this.socketHandler) {
      this.socketHandler.shapeMove(shape);
    }

    this.selectedShape.offsetX = currentX;
    this.selectedShape.offsetY = currentY;
  };

  handleResizeShape = (currentX: number, currentY: number) => {
    console.log("resizing");
    const index = this.selectedShape.index;
    const shape = this.existingShapes[index];
    if (!shape) {
      console.log("error shape not defined");
      return;
    }

    switch (true) {
      case this.resizeSide == "TopLeft" && "endX" in shape:
        shape.startX = currentX;
        shape.startY = currentY;
        break;
      case this.resizeSide == "BottomRight" && "endX" in shape:
        shape.endX = currentX;
        shape.endY = currentY;
        break;
      case this.resizeSide == "TopRight" && "endX" in shape:
        shape.startY = currentY;
        shape.endX = currentX;
        break;
      case this.resizeSide == "BottomLeft" && "endX" in shape:
        shape.startX = currentX;
        shape.endY = currentY;
        break;
    }

    this.triggerRender();
    if (this.socketHandler) {
      this.socketHandler.shapeResize(shape);
    }
  };

  clearResizeHandler = () => {
    this.resizeHandlers = [];
  };
  drawBoundBox = () => {
    const index = this.selectedShape.index;
    const shape = this.existingShapes[index];

    const extra = shape.type == "Arrow" ? 16 : shape.type == "Line" ? 10 : 5;
    const width = 5 / this.scale;
    this.resizeHandlers = [];
    switch (shape.type) {
      case "Rectangle":
      case "Diamond":
      case "Ellipse":
      case "Line":
      case "Arrow":
        const minX = Math.min(shape.startX, shape.endX) - extra;
        const minY = Math.min(shape.startY, shape.endY) - extra;
        const maxX = Math.max(shape.startX, shape.endX) + extra;
        const maxY = Math.max(shape.startY, shape.endY) + extra;
        this.ctx.strokeStyle = StrokeColor.PrimaryViolet;
        this.ctx.lineWidth = 1 / this.scale;
        this.ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

        drawRoundedRectangle(
          this.ctx,
          {
            type: "Rectangle",
            startX: minX - width,
            startY: minY - width,
            endX: minX + width,
            endY: minY + width,
            style: BoundingBorderStyles,
          },
          { isBoundingBox: true, scale: this.scale }
        );
        //prettier-ignore
        const rect1:ResizeHandlers= {type:"Rectangle",side:"TopLeft", startX:minX-width, startY:minY-width, endX:minX+width, endY:minY+width, style:BoundingBorderStyles};
        this.resizeHandlers.push(rect1);
        drawRoundedRectangle(
          this.ctx,
          {
            type: "Rectangle",
            startX: minX - width,
            startY: maxY - width,
            endX: minX + width,
            endY: maxY + width,
            style: BoundingBorderStyles,
          },
          { isBoundingBox: true, scale: this.scale }
        );
        const rect2: ResizeHandlers = {
          type: "Rectangle",
          side: "BottomLeft",
          startX: minX - width,
          startY: maxY - width,
          endX: minX + width,
          endY: maxY + width,
          style: BoundingBorderStyles,
        };
        this.resizeHandlers.push(rect2);
        drawRoundedRectangle(
          this.ctx,
          {
            type: "Rectangle",
            startX: maxX - width,
            startY: maxY - width,
            endX: maxX + width,
            endY: maxY + width,
            style: BoundingBorderStyles,
          },
          { isBoundingBox: true, scale: this.scale }
        );
        const rect3: ResizeHandlers = {
          type: "Rectangle",
          side: "BottomRight",
          startX: maxX - width,
          startY: maxY - width,
          endX: maxX + width,
          endY: maxY + width,
          style: BoundingBorderStyles,
        };
        this.resizeHandlers.push(rect3);
        drawRoundedRectangle(
          this.ctx,
          {
            type: "Rectangle",
            startX: maxX - width,
            startY: minY - width,
            endX: maxX + width,
            endY: minY + width,
            style: BoundingBorderStyles,
          },
          { isBoundingBox: true, scale: this.scale }
        );
        const rect4: ResizeHandlers = {
          type: "Rectangle",
          side: "TopRight",
          startX: minX - width,
          startY: minY - width,
          endX: maxX + width,
          endY: minY + width,
          style: BoundingBorderStyles,
        };
        this.resizeHandlers.push(rect4);
        break;
    }
  };
}
