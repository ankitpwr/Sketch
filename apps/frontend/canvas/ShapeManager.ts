import { drawRoundedRectangle } from "./draw/drawRoundedRectangle";
import { SocketHandler } from "./SocketHandler";
import { ResizeHandlers, Shape, ShapeType } from "@repo/types/canvasTypes";
import {
  BoundingBorderStyles,
  getThemeColors,
} from "@repo/types/drawingConfig";

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
  theme: "light" | "dark";
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
  public theme: "light" | "dark";
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
    this.theme = dependencies.theme;

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
      case ShapeType.RECTANGLE:
      case ShapeType.DIAMOND:
      case ShapeType.ELLIPSE:
      case ShapeType.LINE:
      case ShapeType.ARROW:
        shape.startX += deltaX;
        shape.startY += deltaY;
        shape.endX += deltaX;
        shape.endY += deltaY;
        this.triggerRender();
        break;
      case ShapeType.PENCIL:
        shape.points = shape.points.map((point) => {
          return [point[0] + deltaX, point[1] + deltaY];
        });
        this.triggerRender();
        break;
      case ShapeType.TEXT:
        shape.startX += deltaX;
        shape.startY += deltaY;
        this.triggerRender();
    }
    if (this.socketHandler) {
      this.socketHandler.shapeMove(shape, false);
    }

    this.selectedShape.offsetX = currentX;
    this.selectedShape.offsetY = currentY;
  };

  handleResizeShape = (currentX: number, currentY: number) => {
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
      this.socketHandler.shapeResize(shape, false);
    }
  };

  clearResizeHandler = () => {
    this.resizeHandlers = [];
  };
  drawBoundBox = () => {
    const index = this.selectedShape.index;
    const shape = this.existingShapes[index];
    const themeColors = getThemeColors(this.theme);

    const extra =
      shape.type == ShapeType.ARROW
        ? 16
        : shape.type == ShapeType.LINE
          ? 10
          : 5;
    const width = 5 / this.scale;
    this.resizeHandlers = [];
    switch (shape.type) {
      case ShapeType.RECTANGLE:
      case ShapeType.DIAMOND:
      case ShapeType.ELLIPSE:
      case ShapeType.LINE:
      case ShapeType.ARROW:
      case ShapeType.TEXT:
        let minX, minY, maxX, maxY;

        minX =
          shape.type != ShapeType.TEXT
            ? Math.min(shape.startX, shape.endX) - extra
            : shape.startX;
        minY =
          shape.type != ShapeType.TEXT
            ? Math.min(shape.startY, shape.endY) - extra
            : shape.startY;
        maxX =
          shape.type != ShapeType.TEXT
            ? Math.max(shape.startX, shape.endX) + extra
            : shape.startX + shape.width;
        maxY =
          shape.type != ShapeType.TEXT
            ? Math.max(shape.startY, shape.endY) + extra
            : shape.startY + shape.height;

        this.ctx.strokeStyle = themeColors["Stroke_Violet"];
        this.ctx.lineWidth = 1 / this.scale;
        this.ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);

        drawRoundedRectangle(
          this.ctx,
          {
            type: ShapeType.RECTANGLE,
            startX: minX - width,
            startY: minY - width,
            endX: minX + width,
            endY: minY + width,
            style: BoundingBorderStyles,
          },
          themeColors,
          { isBoundingBox: true, scale: this.scale }
        );

        const rect1: ResizeHandlers = {
          type: ShapeType.RECTANGLE,
          side: "TopLeft",
          startX: minX - width,
          startY: minY - width,
          endX: minX + width,
          endY: minY + width,
          style: BoundingBorderStyles,
        };
        this.resizeHandlers.push(rect1);
        drawRoundedRectangle(
          this.ctx,
          {
            type: ShapeType.RECTANGLE,
            startX: minX - width,
            startY: maxY - width,
            endX: minX + width,
            endY: maxY + width,
            style: BoundingBorderStyles,
          },
          themeColors,
          { isBoundingBox: true, scale: this.scale }
        );
        const rect2: ResizeHandlers = {
          type: ShapeType.RECTANGLE,
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
            type: ShapeType.RECTANGLE,
            startX: maxX - width,
            startY: maxY - width,
            endX: maxX + width,
            endY: maxY + width,
            style: BoundingBorderStyles,
          },
          themeColors,
          { isBoundingBox: true, scale: this.scale }
        );
        const rect3: ResizeHandlers = {
          type: ShapeType.RECTANGLE,
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
            type: ShapeType.RECTANGLE,
            startX: maxX - width,
            startY: minY - width,
            endX: maxX + width,
            endY: minY + width,
            style: BoundingBorderStyles,
          },
          themeColors,
          { isBoundingBox: true, scale: this.scale }
        );
        const rect4: ResizeHandlers = {
          type: ShapeType.RECTANGLE,
          side: "TopRight",
          startX: maxX - width,
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
