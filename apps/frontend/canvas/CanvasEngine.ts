import {
  Action,
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
  CanvasColor,
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
  // private scaleOffset: { x: number; y: number };
  private shapeMangager: ShapeManager;
  private textArea: HTMLTextAreaElement;
  public CurrentShapeStyles: ShapeStyles;
  public CurrentPencilStyles: PencilStyles;
  public CurrentTextStyle: TextStyle;
  public CanvasColor: CanvasColor;
  private initialPintchDistance: number | null = null;
  private initialPintchMidPoint: { x: number; y: number } | null = null;
  private lastScale: number = 1;
  private standalone: boolean;
  private sockethandler?: SocketHandler;
  private roomId: string = "";
  private userId: string = "";
  private shapeToRemove: Shape[] = [];
  constructor(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    textArea: HTMLTextAreaElement,
    dpr: number,
    standalone: boolean,
    socket: WebSocket | null,
    roomId: string,
    userId: string
  ) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.textArea = textArea;
    this.standalone = standalone;
    this.dpr = dpr;
    this.ctx.scale(this.dpr, this.dpr);
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

    this.selectedShape = { type: null, index: -1, offsetX: 0, offsetY: 0 };
    this.CurrentShapeStyles = DefaultShapeStyles;
    this.CurrentPencilStyles = DefaultPencilStyles;
    this.CurrentTextStyle = DefaultTextStyle;
    this.CanvasColor = CanvasColor.white;
    this.pressedKey = null;

    if (socket) {
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
    });

    this.init();
    this.mouseHandler();
  }

  init = async () => {
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
  ChangeCanvasColor = (color: CanvasColor) => {
    this.CanvasColor = color;
    this.render();
  };
  render = () => {
    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = this.CanvasColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.translate(this.panX, this.panY);
    this.ctx.scale(this.scale, this.scale);
    const drawShape = (s: Shape) => {
      //prettier-ignore

      switch (s.type) {
        case "Rectangle":
        case "Ellipse":
        case "Diamond":
          if (s.type == "Rectangle") drawRoundedRectangle(this.ctx, s);
          if (s.type == "Ellipse") drawEllipse(this.ctx, s);
          if (s.type == "Diamond") drawDiamond(this.ctx, s);
          break;

        case "Line":
          drawLine(this.ctx, s);
          break;
        case "Arrow":
          drawArrow(this.ctx, s);
          break;
        case "Pencil":
          drawPencil(this.ctx, s);
          break;
        case "Text":
          drawText(this.ctx, s);
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
    this.textArea.style.left = x + "px";
    this.textArea.style.top = y + "px";
    this.textArea.style.fontSize = this.CurrentTextStyle.fontsize;
    this.textArea.style.fontFamily = this.CurrentTextStyle.fontfamily;
    this.textArea.style.color = this.CurrentTextStyle.strokeStyle;
    this.textArea.style.padding = "0";
    this.textArea.style.margin = "0";
    this.textArea.style.height = "auto";
    this.textArea.style.resize = "none";
    this.textArea.style.border = "none";
    this.textArea.style.outline = "none";
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
        type: "Text",
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
    this.action = "none";
    this.textArea.style.display = "none";
  };

  handleMouseDown = (e: MouseEvent) => {
    if (this.action == "writing") {
      return;
    }
    this.mouseDown = true;
    this.startX = this.getCoordinates(e)[0];
    this.startY = this.getCoordinates(e)[1];

    if (this.currentTool == "Text") {
      e.preventDefault();
      this.action = "writing";
      const screenX = this.startX * this.scale + this.panX * this.scale;
      const screenY = this.startY * this.scale + this.panY * this.scale;
      this.handleText(screenX, screenY);
    }

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

      if (this.standalone) {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      } else {
        this.sockethandler?.shapeResize(shape);
      }
      this.shapeMangager.clearResizeHandler();
      this.render();
    } else if (this.action == "moving") {
      if (this.standalone) {
        localStorage.setItem("shape", JSON.stringify(this.existingShapes));
      }

      this.action = "none";
      this.render();
    } else if (this.currentTool == "Eraser" && this.shapeToRemove.length > 0) {
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
      this.currentTool == "Rectangle" ||
      this.currentTool == "Ellipse" ||
      this.currentTool == "Diamond" ||
      this.currentTool == "Line" ||
      this.currentTool == "Arrow" ||
      this.currentTool == "Pencil"
    ) {
      const currentShape = this.currentTool;
      let tempShape: Shape;
      if (currentShape == "Pencil") {
        if (this.points.length == 0)
          this.points.push([this.startX, this.startY]);
        this.points.push([currentX, currentY]);
        tempShape = {
          id: cuid(),
          type: "Pencil",
          points: this.points,
          style: { ...this.CurrentPencilStyles },
        };
      } else if (currentShape == "Line" || currentShape == "Arrow") {
        tempShape = {
          id: cuid(),
          type: currentShape,
          startX: this.startX,
          startY: this.startY,
          endX: currentX,
          endY: currentY,
          style: { ...this.CurrentShapeStyles },
        };
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
    else if (this.action == "resizing") {
      this.shapeMangager.handleResizeShape(currentX, currentY);
    } else if (this.action == "moving") {
      this.shapeMangager.handleShapeMovement(currentX, currentY);
    } else if (this.currentTool == "Eraser") {
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
          style: { ...this.CurrentPencilStyles },
        };
      } else if (currentShape == "Line" || currentShape == "Arrow") {
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

  handleTouchStart = (e: TouchEvent) => {
    console.log("touch start");
    if (e.touches.length != 2) return;

    const touch1 = e.touches[0];
    const touch2 = e.touches[2];
    console.log(touch1);
    this.initialPintchDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch2.clientY
    );
    this.initialPintchMidPoint = {
      x: (touch2.clientX + touch1.clientX) / 2,
      y: (touch2.clientY + touch2.clientY) / 2,
    };
    this.lastScale = this.scale;
  };
  handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    console.log("touch move");
    if (e.touches.length != 2) return;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const currentPinchDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch2.clientY
    );
    if (!this.initialPintchDistance) return;
    const scaleFactor = currentPinchDistance / this.initialPintchDistance;
    const newScale = this.lastScale * scaleFactor;
    if (this.initialPintchMidPoint) {
      const clientX = this.initialPintchMidPoint.x;
      const clientY = this.initialPintchMidPoint.y;
      const rect = this.canvas.getBoundingClientRect();
      const canvasX = (clientX - rect.left - this.panX) / this.scale;
      const canvasY = (clientY - rect.top - this.panY) / this.scale;
      this.panX = clientX - rect.left - canvasX * newScale;
      this.panY = clientY - rect.top - canvasY * newScale;
    }
    this.render;
  };
  handleTouchEnd = (e: TouchEvent) => {
    this.initialPintchDistance = null;
    this.initialPintchMidPoint = null;
    this.lastScale = this.scale;
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
    this.canvas.addEventListener("touchend", this.handleTouchEnd);
  };
  getCoordinates = (e: MouseEvent) => {
    const X = (e.offsetX - this.panX) / this.scale;
    const Y = (e.offsetY - this.panY) / this.scale;
    return [X, Y];
  };
}
