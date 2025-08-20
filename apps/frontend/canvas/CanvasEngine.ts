import {
  Action,
  ActionTool,
  Points,
  Shape,
  ShapeType,
  TextShape,
  Tool,
} from "@repo/types/canvasTypes";
import { drawRoundedRectangle } from "./draw/drawRoundedRectangle";
import { drawEllipse } from "./draw/drawEllipse";
import { drawDiamond } from "./draw/drawDiamond";
import { drawLine } from "./draw/drawLine";
import { drawArrow } from "./draw/drawArrow";
import { drawPencil } from "./draw/drawPencil";
import { getExistingShape } from "./utils/storage";
import { isNeartheShape } from "./utils/geometry";
import { ShapeManager } from "./ShapeManager";
import { SocketHandler } from "./SocketHandler";
import cuid from "cuid";

import { drawText } from "./draw/drawText";
import {
  DefaultPencilStyles,
  DefaultShapeStyles,
  ShapeStyles,
  PencilStyles,
  TextStyle,
  DefaultTextStyle,
  CanvasColorKey,
  THEME_PALETTE,
  StrokeColorKey,
  BackgroundColorkey,
  getThemeColors,
} from "@repo/types/drawingConfig";

export class CanvasEngine {
  public canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: Shape[];
  public action: Action;
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
  private dpr: number;

  private shapeMangager: ShapeManager;
  private textArea: HTMLTextAreaElement;
  public CurrentShapeStyles: ShapeStyles;
  public CurrentPencilStyles: PencilStyles;
  public CurrentTextStyle: TextStyle;
  public CanvasColor: string;
  public CanvasColorKey: CanvasColorKey;
  private theme: "light" | "dark" = "light";
  private initialPintchDistance: number | null = null;
  private initialPintchMidPoint: { x: number; y: number } | null = null;
  private lastScale: number = 1;
  private standalone: boolean;
  private sockethandler?: SocketHandler;
  private roomId: string | null = null;
  private userId: string | null = null;
  private shapeToRemove: Shape[] = [];
  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    textArea: HTMLTextAreaElement,
    dpr: number,
    standalone: boolean,
    socket: WebSocket | null,
    roomId: string | null,
    userId: string | null
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.textArea = textArea;
    this.standalone = standalone;
    this.dpr = dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.existingShapes = [];
    this.action = Action.IDLE;
    this.currentTool = ActionTool.HAND;
    this.mouseDown = false;
    this.startX = 0;
    this.startY = 0;
    this.previewShape = null;
    this.points = [];
    this.panX = 0;
    this.panY = 0;
    this.scale = 1;

    this.selectedShape = { type: null, index: -1, offsetX: 0, offsetY: 0 };
    this.CurrentShapeStyles = DefaultShapeStyles;
    this.CurrentPencilStyles = DefaultPencilStyles;
    this.CurrentTextStyle = DefaultTextStyle;
    this.CanvasColor = THEME_PALETTE.light.White;
    this.CanvasColorKey = "White";
    this.pressedKey = null;

    if (!standalone && socket && roomId && userId) {
      this.roomId = roomId;
      this.userId = userId;
      console.log("socket in canvas engine is ");
      console.log(socket);
      this.sockethandler = new SocketHandler(
        socket,
        this.existingShapes,
        this.render,
        roomId,
        this.setPreviewShape,
        userId,
        this.addShape,
        this.removeShapesByIds,
        this.manageShape
      );
    }
    this.shapeMangager = new ShapeManager({
      ctx: this.ctx,
      existingShapes: this.existingShapes,
      selectedShape: this.selectedShape,
      scale: this.scale,
      triggerRender: () => this.render(),
      socketHandler: this.sockethandler,
      theme: this.theme,
    });

    this.init();
    this.mouseHandler();
  }

  init = async () => {
    console.log(`standalone is ${this.standalone}`);
    const loadedShaped = await getExistingShape(this.standalone, this.roomId);

    this.existingShapes.push(...loadedShaped);
    this.render();
  };

  public setPreviewShape = (shape: Shape | null) => {
    this.previewShape = shape;
  };

  public addShape = (shape: Shape) => {
    const shapeExists = this.existingShapes.some((s) => s.id === shape.id);
    if (!shapeExists) {
      this.existingShapes.push(shape);
    }
    this.render();
  };

  public removeShapesByIds = (shapeIdsToRemove: any) => {
    const shapesToKeep = this.existingShapes.filter(
      (shape) => !shapeIdsToRemove.includes(shape.id)
    );
    this.existingShapes.length = 0;
    this.existingShapes.push(...shapesToKeep);
    this.render();
  };

  public manageShape = (shape: Shape) => {
    const shapeIndex = this.existingShapes.findIndex((s) => s.id == shape.id);
    if (shapeIndex != -1) {
      this.existingShapes[shapeIndex] = shape;
      this.render();
    }
  };

  handleCanvasResize = () => {
    this.render();
  };
  ChangeCanvasColor = (colorKey: CanvasColorKey) => {
    this.CanvasColorKey = colorKey;
    const themeColors = getThemeColors(this.theme);
    this.CanvasColor = themeColors[colorKey];
    this.render();
  };
  ChangeStrokeColor = (colorKey: StrokeColorKey) => {
    this.CurrentShapeStyles.strokeColorKey = colorKey;
    this.CurrentTextStyle.strokeColorKey = colorKey;
    this.CurrentPencilStyles.strokeColorKey = colorKey;
  };

  ChangeBackgroundColor = (colorKey: BackgroundColorkey) => {
    this.CurrentShapeStyles.backgroundColorKey = colorKey;
    this.CurrentTextStyle.backgroundColorKey = colorKey;
    this.CurrentPencilStyles.backgroundColorKey = colorKey;
  };

  public setCanvasTheme = (theme: "light" | "dark") => {
    if (theme == this.theme) return;
    this.theme = theme;
    this.shapeMangager.theme = theme;
    const themeColors = getThemeColors(this.theme);
    this.CanvasColor = themeColors[this.CanvasColorKey];
    this.render();
  };
  render = () => {
    const themeColors = getThemeColors(this.theme);
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.CanvasColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    const drawShape = (s: Shape) => {
      //prettier-ignore

      switch (s.type) {
        case ShapeType.RECTANGLE:
        case ShapeType.ELLIPSE:
        case ShapeType.DIAMOND:
          if (s.type == ShapeType.RECTANGLE) drawRoundedRectangle(this.ctx, s, themeColors );
          if (s.type == ShapeType.ELLIPSE) drawEllipse(this.ctx, s, themeColors);
          if (s.type == ShapeType.DIAMOND) drawDiamond(this.ctx, s,  themeColors);
          break;

        case ShapeType.LINE:
          drawLine(this.ctx, s, themeColors);
          break;
        case ShapeType.ARROW:
          drawArrow(this.ctx, s, themeColors);
          break;
        case ShapeType.PENCIL:
          drawPencil(this.ctx, s, themeColors);
          break;
        case ShapeType.TEXT:
          drawText(this.ctx, s, themeColors);
          break;
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
  };

  clearCanvas = () => {
    this.existingShapes.length = 0;
    localStorage.removeItem("shape");
    this.render();
  };

  handleText = (x: number, y: number) => {
    const themeColors = getThemeColors(this.theme);
    const textColor = themeColors[this.CurrentTextStyle.strokeColorKey];
    this.textArea.style.left = x + "px";
    this.textArea.style.top = y + "px";
    this.textArea.style.fontSize = this.CurrentTextStyle.fontsize;
    this.textArea.style.fontFamily = this.CurrentTextStyle.fontfamily;
    this.textArea.style.color = textColor;
    this.textArea.style.height = "auto";
    this.textArea.style.resize = "none";
    this.textArea.style.outline = "none";
    this.textArea.style.border = "none";
    this.textArea.value = "";
    this.textArea.oninput = this.autoResizeTextArea;
    this.textArea.style.width = "2px";
    this.autoResizeTextArea();
    this.textArea.style.display = "block";
    this.textArea.focus();

    this.textArea.onblur = () => this.finalizeText();
  };
  autoResizeTextArea = () => {
    const text = this.textArea.value || this.textArea.placeholder || "";
    let mirror = document.getElementById(`texxt-mirror-span`);
    if (!mirror) {
      mirror = document.createElement("span");
      mirror.id = "text-mirror-span";
      mirror.style.visibility = "hidden";
      mirror.style.position = "fixed";
      mirror.style.whiteSpace = "pre";
      document.body.appendChild(mirror);
    }

    mirror.style.fontSize = this.CurrentTextStyle.fontsize;
    mirror.style.fontFamily = this.CurrentTextStyle.fontfamily;
    mirror.textContent = text + " ";
    const newWidth = mirror.offsetWidth + 2;
    this.textArea.style.width = newWidth + "px";
  };
  finalizeText = () => {
    const textData = this.textArea.value.trim();
    if (textData.length != 0) {
      const textShape: TextShape = {
        id: cuid(),
        type: ShapeType.TEXT,
        startX: this.startX,
        startY: this.startY,
        text: this.textArea.value,
        style: { ...this.CurrentTextStyle },
        width: this.textArea.scrollWidth,
        height: this.textArea.scrollHeight,
      };
      this.existingShapes.push(textShape);
      if (this.standalone) {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      } else {
        let id = textShape.id;
        if (!id) id = "";
        this.sockethandler?.sendShape(textShape, id);
      }
    }
    this.render();
    this.action = Action.IDLE;
    this.textArea.style.display = "none";
  };

  handleMouseDown = (e: MouseEvent) => {
    if (this.action == Action.WRITING) {
      return;
    }
    this.mouseDown = true;
    this.startX = this.getCoordinates(e)[0];
    this.startY = this.getCoordinates(e)[1];

    if (this.currentTool == ShapeType.TEXT) {
      e.preventDefault();
      this.action = Action.WRITING;
      const screenX = this.startX * this.scale + this.panX * this.scale;
      const screenY = this.startY * this.scale + this.panY * this.scale;
      this.handleText(screenX, screenY);
    }

    if (
      this.currentTool == ActionTool.SELECT &&
      this.selectedShape.index != -1
    ) {
      const resizeHandlers = this.shapeMangager.resizeHandlers;

      for (let i = 0; i < resizeHandlers.length; i++) {
        const currentHandler = resizeHandlers[i];
        if (isNeartheShape(this.startX, this.startY, currentHandler)) {
          this.shapeMangager.resizeSide = currentHandler.side;
          this.action = Action.RESIZING;
          this.render();
          return;
        }
      }
    }
    let shapeFound = false;
    if (this.currentTool == ActionTool.SELECT) {
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        if (isNeartheShape(this.startX, this.startY, this.existingShapes[i])) {
          this.selectedShape.index = i;
          this.selectedShape.type = this.existingShapes[i].type;
          this.selectedShape.offsetX = this.startX;
          this.selectedShape.offsetY = this.startY;
          this.action = Action.MOVING;
          shapeFound = true;
          console.log("new shape is selected");
          console.log(this.selectedShape);
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

    if (this.action == Action.RESIZING) {
      const index = this.selectedShape.index;
      const shape = this.existingShapes[index];
      if (
        shape &&
        (shape.type === ShapeType.RECTANGLE ||
          shape.type === ShapeType.ELLIPSE ||
          shape.type === ShapeType.DIAMOND)
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
      this.action = Action.IDLE;

      if (this.standalone) {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      } else {
        this.sockethandler?.shapeResize(shape, true);
      }
      this.shapeMangager.clearResizeHandler();
      this.render();
    } else if (this.action == Action.MOVING) {
      if (this.standalone) {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      } else {
        const shapeToMove = this.existingShapes[this.selectedShape.index];
        this.sockethandler?.shapeMove(shapeToMove, true);
      }

      this.action = Action.IDLE;
      this.render();
    } else if (
      this.currentTool == ActionTool.ERASER &&
      this.shapeToRemove.length > 0
    ) {
      const shapeToKeep = this.existingShapes.filter(
        (s) => !this.shapeToRemove.some((rem) => rem.id === s.id)
      );
      this.existingShapes.length = 0;
      this.existingShapes.push(...shapeToKeep);
      this.render();
      if (!this.standalone) {
        console.log("to erase");

        this.sockethandler?.eraseShape(this.shapeToRemove);
      } else {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      }
      this.shapeToRemove = [];
    } else if (
      this.currentTool == ShapeType.RECTANGLE ||
      this.currentTool == ShapeType.ELLIPSE ||
      this.currentTool == ShapeType.DIAMOND ||
      this.currentTool == ShapeType.LINE ||
      this.currentTool == ShapeType.ARROW ||
      this.currentTool == ShapeType.PENCIL
    ) {
      const currentShape = this.currentTool;
      let tempShape: Shape;
      if (currentShape == ShapeType.PENCIL) {
        if (this.points.length == 0)
          this.points.push([this.startX, this.startY]);
        this.points.push([currentX, currentY]);
        tempShape = {
          id: cuid(),
          type: ShapeType.PENCIL,
          points: this.points,
          style: { ...this.CurrentPencilStyles },
        };
        if (this.points.length < 5) return;
      } else if (
        currentShape == ShapeType.LINE ||
        currentShape == ShapeType.ARROW
      ) {
        tempShape = {
          id: cuid(),
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
          style: { ...this.CurrentShapeStyles },
        };
        if (this.startX == currentX || this.startY == currentY) return;
      } else {
        tempShape = {
          id: cuid(),
          type: currentShape,
          startX: Math.min(this.startX, currentX),
          startY: Math.min(this.startY, currentY),
          endX: Math.max(this.startX, currentX),
          endY: Math.max(this.startY, currentY),
          style: { ...this.CurrentShapeStyles },
        };
        if (this.startX == currentX || this.startY == currentY) return;
      }
      this.existingShapes.push(tempShape);
      if (this.standalone) {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      } else {
        let id = tempShape.id;
        if (!id) id = "";
        this.sockethandler?.sendShape(tempShape, id);
      }
      this.render();
      this.points = [];
    }
  };

  handleMouseMove = (e: MouseEvent) => {
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];

    if (!this.mouseDown) return;
    else if (this.action == Action.RESIZING) {
      this.shapeMangager.handleResizeShape(currentX, currentY);
    } else if (this.action == Action.MOVING) {
      this.shapeMangager.handleShapeMovement(currentX, currentY);
    } else if (this.currentTool == ActionTool.ERASER) {
      let topShape: Shape | null = null;
      for (let i = this.existingShapes.length - 1; i >= 0; i--) {
        const shape = this.existingShapes[i];
        if (isNeartheShape(currentX, currentY, shape)) {
          topShape = shape;
          break;
        }
      }
      if (topShape && !this.shapeToRemove.some((s) => s.id == topShape.id)) {
        this.shapeToRemove.push(topShape);
      }
    } else if (
      this.currentTool == ShapeType.RECTANGLE ||
      this.currentTool == ShapeType.ELLIPSE ||
      this.currentTool == ShapeType.DIAMOND ||
      this.currentTool == ShapeType.LINE ||
      this.currentTool == ShapeType.ARROW ||
      this.currentTool == ShapeType.PENCIL
    ) {
      const currentShape = this.currentTool;
      if (currentShape == ShapeType.PENCIL) {
        if (this.points.length == 0)
          this.points.push([this.startX, this.startY]);
        this.points.push([currentX, currentY]);
        this.previewShape = {
          type: ShapeType.PENCIL,
          points: this.points,
          style: { ...this.CurrentPencilStyles },
        };
      } else if (
        currentShape == ShapeType.LINE ||
        currentShape == ShapeType.ARROW
      ) {
        const tempShape: Shape = {
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
          style: { ...this.CurrentShapeStyles },
        };
        this.previewShape = tempShape;
      } else {
        const tempShape = {
          type: currentShape,
          startX: Math.min(this.startX, currentX),
          startY: Math.min(this.startY, currentY),
          endX: Math.max(this.startX, currentX),
          endY: Math.max(this.startY, currentY),
          style: { ...this.CurrentShapeStyles },
        };
        this.previewShape = tempShape;
      }
      if (!this.standalone && this.previewShape) {
        this.sockethandler?.sendPreviewShape(this.previewShape);
      }
      this.render();
      this.previewShape = null;
    }
  };

  handleWheelEvent = (e: WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      this.handleZoom(e.deltaY * -0.01, e.offsetX, e.offsetY);
    } else {
      this.panX -= e.deltaX / this.scale;
      this.panY -= e.deltaY / this.scale;
    }
    this.render();
  };
  handleZoom = (val: number, pivotX: number, pivotY: number) => {
    const oldScale = this.scale;
    const newScale = Math.min(Math.max(this.scale + val, 0.15), 40);
    const worldX = (pivotX - this.panX) / oldScale;
    const worldY = (pivotY - this.panY) / oldScale;
    this.panX = pivotX - worldX * newScale;
    this.panY = pivotY - worldY * newScale;
    this.scale = newScale;
    this.shapeMangager.scale = newScale;
  };
  handleKeyDown = (e: KeyboardEvent) => {
    this.pressedKey = e.key;
  };
  handleKeyUp = (e: KeyboardEvent) => {
    this.pressedKey = null;
  };

  private createMouseEvent = (e: TouchEvent, touch: Touch) => {
    const rect = this.canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    return new MouseEvent(e.type, {
      clientX: touch.clientX,
      clientY: touch.clientY,
      // @ts-ignore
      offsetX: offsetX,
      // @ts-ignore
      offsetY: offsetY,
    });
  };

  handleTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const mouseEvent = this.createMouseEvent(e, touch);
      this.handleMouseDown(mouseEvent);
    }
  };
  handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      const mouseEvent = this.createMouseEvent(e, touch);
      this.handleMouseMove(mouseEvent);
    }
  };
  handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    const touchEvent = e.changedTouches[0]; //e.touches[0] is empty for Touch End as no finger is currenlty involved
    const mouseEvent = this.createMouseEvent(e, touchEvent);

    this.handleMouseUp(mouseEvent);
  };

  destroy = () => {
    this.canvas.removeEventListener("mousedown", this.handleMouseDown);
    this.canvas.removeEventListener("mouseup", this.handleMouseUp);
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  };
  mouseHandler = () => {
    this.canvas.addEventListener("mousedown", this.handleMouseDown);
    this.canvas.addEventListener("mouseup", this.handleMouseUp);
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
    this.canvas.addEventListener("wheel", this.handleWheelEvent);
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    this.canvas.addEventListener("touchstart", this.handleTouchStart, {
      passive: false,
    });
    (this.canvas.addEventListener("touchmove", this.handleTouchMove),
      {
        passive: false,
      });
    this.canvas.addEventListener("touchend", this.handleTouchEnd, {
      passive: false,
    });
  };
  getCoordinates = (e: MouseEvent) => {
    const X = (e.offsetX - this.panX) / this.scale;
    const Y = (e.offsetY - this.panY) / this.scale;
    return [X, Y];
  };
}
