import {
  Action,
  ActionTool,
  DiamondShape,
  EllipseShape,
  Points,
  RectangleShape,
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
import rough from "roughjs/bin/rough";
import { RoughCanvas } from "roughjs/bin/canvas";

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
  setting,
  StrokeWidth,
  StrokeType,
  FillStyle,
  Sloppiness,
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
  public grid: boolean = setting.grid;
  private shapeMangager: ShapeManager;
  private textArea: HTMLTextAreaElement;
  public CurrentShapeStyles: ShapeStyles;
  public CurrentPencilStyles: PencilStyles;
  public CurrentTextStyle: TextStyle;
  public CanvasColor: string = THEME_PALETTE.light.White;
  public CanvasColorKey: CanvasColorKey = setting.canvasColorKey;
  private theme: "light" | "dark" = "light";
  private lastPanPoint: { x: number; y: number } | null = null;
  private standalone: boolean;
  private sockethandler?: SocketHandler;
  private roomId: string | null = null;
  private userId: string | null = null;
  private shapeToRemove: Shape[] = [];
  private roughCanvas: RoughCanvas;
  private seed: number = 0;
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
    this.roughCanvas = rough.canvas(this.canvas);
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

    this.pressedKey = null;

    if (!standalone && socket && roomId && userId) {
      this.roomId = roomId;
      this.userId = userId;

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
      roughCanvas: this.roughCanvas,
    });

    this.init();
    this.mouseHandler();
  }

  init = async () => {
    const loadedShaped = await getExistingShape(this.standalone, this.roomId);
    this.existingShapes.push(...loadedShaped);
    this.ChangeStrokeColor(setting.strokeColorKey);
    this.ChangeBackgroundColor(setting.backgroundColorKey);
    this.ChangeCanvasColor(setting.canvasColorKey);
    this.ChangeStrokeWidth(setting.strokeWidth);
    this.ChangeStrokeStyle(setting.strokeStyle);
    this.ChangeFillStyle(setting.fillStyle);
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

  changeTool = (tool: Tool) => {
    this.currentTool = tool;
    this.shapeMangager.clearSelectedShape();
    this.render();
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
  ChangeStrokeWidth = (strokeWidth: StrokeWidth) => {
    this.CurrentShapeStyles.strokeWidth = strokeWidth;
  };
  ChangeStrokeStyle = (strokeType: StrokeType) => {
    this.CurrentShapeStyles.strokeType = strokeType;
  };

  ChangeFillStyle = (fillStyle: FillStyle) => {
    this.CurrentShapeStyles.fillStyle = fillStyle;
  };

  ChangeSloppliness = (sloppiness: Sloppiness) => {
    this.CurrentShapeStyles.sloppiness = sloppiness;
  };

  ChangeGrid = (grid: boolean) => {
    this.grid = grid;
    this.render();
  };

  public setCanvasTheme = (theme: "light" | "dark") => {
    if (theme == this.theme) return;
    this.theme = theme;
    this.shapeMangager.theme = theme;
    const themeColors = getThemeColors(this.theme);
    this.CanvasColor = themeColors[this.CanvasColorKey];
    this.render();
  };

  CreateGridPattern = () => {
    const left = -this.panX / this.scale;
    const top = -this.panY / this.scale;
    const right = (this.canvas.width - this.panX) / this.scale;
    const bottom = (this.canvas.height - this.panY) / this.scale;
    const solidGridSize = 110;
    const dashedGridSize = 22;
    this.ctx.save();
    this.ctx.beginPath();
    for (
      let x = Math.floor(left / solidGridSize) * solidGridSize;
      x < right;
      x += solidGridSize
    ) {
      this.ctx.moveTo(x, top);
      this.ctx.lineTo(x, bottom);
    }

    for (
      let y = Math.floor(top / solidGridSize) * solidGridSize;
      y < bottom;
      y += solidGridSize
    ) {
      this.ctx.moveTo(left, y);
      this.ctx.lineTo(right, y);
    }
    this.ctx.lineWidth = 1 / this.scale;
    this.ctx.strokeStyle = this.theme == "light" ? "#dfdfdf" : "#232323";
    this.ctx.stroke();
    this.ctx.restore();

    if (this.scale < 0.38) return;
    this.ctx.save();
    this.ctx.beginPath();
    for (
      let x = Math.floor(left / dashedGridSize) * dashedGridSize;
      x < right;
      x += dashedGridSize
    ) {
      this.ctx.moveTo(x, top);
      this.ctx.lineTo(x, bottom);
    }

    for (
      let y = Math.floor(top / dashedGridSize) * dashedGridSize;
      y < bottom;
      y += dashedGridSize
    ) {
      this.ctx.moveTo(left, y);
      this.ctx.lineTo(right, y);
    }
    this.ctx.lineWidth = 0.8 / this.scale;
    this.ctx.strokeStyle = this.theme == "light" ? "#dfdfdf" : "#232323";
    this.ctx.setLineDash([4 / this.scale, 4 / this.scale]);
    this.ctx.stroke();
    this.ctx.restore();
  };
  render = () => {
    const themeColors = getThemeColors(this.theme);
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.CanvasColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    if (this.grid) {
      this.CreateGridPattern();
    }

    const drawShape = (s: Shape) => {
      //prettier-ignore
      switch (s.type) {
        case ShapeType.RECTANGLE:
        case ShapeType.ELLIPSE:
        case ShapeType.DIAMOND:
          if (s.type == ShapeType.RECTANGLE) drawRoundedRectangle(this.roughCanvas, s, themeColors );
          if (s.type == ShapeType.ELLIPSE) drawEllipse(this.roughCanvas, s, themeColors);
          if (s.type == ShapeType.DIAMOND) drawDiamond(this.roughCanvas, s,  themeColors);
          break;

        case ShapeType.LINE:
          drawLine(this.roughCanvas, s, themeColors);
          break;
        case ShapeType.ARROW:
          drawArrow(this.roughCanvas, s, themeColors);
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
      if (e.target !== this.textArea) {
        this.finalizeText();
      } else return;
    }
    this.mouseDown = true;
    this.startX = this.getCoordinates(e)[0];
    this.startY = this.getCoordinates(e)[1];
    this.seed = Math.floor(Math.random() * 1_000_000);

    switch (this.currentTool) {
      case ShapeType.TEXT:
        e.preventDefault();
        this.action = Action.WRITING;
        const screenX = this.startX * this.scale + this.panX;
        const screenY = this.startY * this.scale + this.panY;
        this.handleText(screenX, screenY);
        return;
      case ActionTool.SELECT:
        if (this.selectedShape.index != -1) {
          const resizeHandlers = this.shapeMangager.resizeHandlers;
          for (let i = 0; i < resizeHandlers.length; i++) {
            const currentHandler = resizeHandlers[i];
            if (isNeartheShape(this.startX, this.startY, currentHandler)) {
              this.shapeMangager.resizeSide = currentHandler.side;
              this.render();
              this.action = Action.RESIZING;
              return;
            }
          }
        }
        let shapeFound = false;
        for (let i = this.existingShapes.length - 1; i >= 0; i--) {
          if (
            isNeartheShape(this.startX, this.startY, this.existingShapes[i])
          ) {
            this.selectedShape.index = i;
            this.selectedShape.type = this.existingShapes[i].type;
            this.selectedShape.offsetX = this.startX;
            this.selectedShape.offsetY = this.startY;
            shapeFound = true;
            this.render();
            this.action = Action.MOVING;
            return;
          }
        }
        if (!shapeFound) {
          this.shapeMangager.clearSelectedShape();
          this.render();
          this.action = Action.IDLE;
          break;
        }

      case ShapeType.ARROW:
      case ShapeType.DIAMOND:
      case ShapeType.ELLIPSE:
      case ShapeType.LINE:
      case ShapeType.PENCIL:
      case ShapeType.RECTANGLE:
        this.action = Action.DRAWING;
        break;
      case ActionTool.ERASER:
        this.shapeMangager.clearSelectedShape();
        this.action = Action.ERASEING;
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

      // this.action = Action.IDLE;
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
          seed: this.seed,
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
          seed: this.seed,
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
    if (this.action != Action.WRITING) this.action = Action.IDLE;
  };

  handleMouseMove = (e: MouseEvent) => {
    const currentX = this.getCoordinates(e)[0];
    const currentY = this.getCoordinates(e)[1];
    if (!this.mouseDown) return;
    switch (this.action) {
      case Action.RESIZING:
        this.shapeMangager.handleResizeShape(currentX, currentY);
        break;
      case Action.MOVING:
        this.shapeMangager.handleShapeMovement(currentX, currentY);
        break;
      case Action.ERASEING:
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
        break;
      case Action.DRAWING:
        const currentShape = this.currentTool;

        if (!(currentShape in ShapeType)) break;
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
            seed: this.seed,
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
            seed: this.seed,
          };
          //@ts-ignore
          this.previewShape = tempShape;
        }
        if (!this.standalone && this.previewShape) {
          this.sockethandler?.sendPreviewShape(this.previewShape);
        }
        this.render();
        this.previewShape = null;
        break;
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
    if (e.touches.length == 2) {
      this.mouseDown = false;
      this.action = Action.PANNING;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.lastPanPoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    } else if (e.touches.length == 1) {
      const touch = e.touches[0];
      const mouseEvent = this.createMouseEvent(e, touch);

      this.handleMouseDown(mouseEvent);
    }
  };
  handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (
      e.touches.length == 2 &&
      this.lastPanPoint &&
      this.action == Action.PANNING
    ) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentMidpoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
      const deltaX = currentMidpoint.x - this.lastPanPoint.x;
      const deltaY = currentMidpoint.y - this.lastPanPoint.y;
      this.panX += deltaX;
      this.panY += deltaY;
      this.lastPanPoint = currentMidpoint;

      this.render();
    } else if (e.touches.length == 1) {
      const touch = e.touches[0];

      const mouseEvent = this.createMouseEvent(e, touch);
      this.handleMouseMove(mouseEvent);
    }
  };
  handleTouchEnd = (e: TouchEvent) => {
    e.preventDefault();
    if (this.action == Action.PANNING) {
      this.action = Action.IDLE;
      this.lastPanPoint = null;
    } else if (this.action != Action.IDLE) {
      const touchEvent = e.changedTouches[0]; //e.touches[0] is empty for Touch End as no finger is currenlty involved
      const mouseEvent = this.createMouseEvent(e, touchEvent);
      this.handleMouseUp(mouseEvent);
    }
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
