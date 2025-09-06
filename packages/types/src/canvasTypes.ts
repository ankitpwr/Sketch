import { PencilStyles, ShapeStyles, TextStyle } from "./drawingConfig";

export enum ShapeType {
  RECTANGLE = "RECTANGLE",
  DIAMOND = "DIAMOND",
  ELLIPSE = "ELLIPSE",
  LINE = "LINE",
  ARROW = "ARROW",
  PENCIL = "PENCIL",
  TEXT = "TEXT",
}

export enum ActionTool {
  HAND = "HAND",
  SELECT = "SELECT",
  ERASER = "ERASER",
}

export type Tool = ShapeType | ActionTool;
export type Shape =
  | RectangleShape
  | EllipseShape
  | DiamondShape
  | LineShape
  | ArrowShape
  | PencilShape
  | TextShape;

export interface BaseShape {
  type: ShapeType;
  id?: string;
}
interface BoundedShape extends BaseShape {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  style: ShapeStyles;
  seed: number;
}
export type RectangleShape = BoundedShape & { type: ShapeType.RECTANGLE };
export type EllipseShape = BoundedShape & { type: ShapeType.ELLIPSE };
export type DiamondShape = BoundedShape & { type: ShapeType.DIAMOND };
export type LineShape = BoundedShape & { type: ShapeType.LINE };
export type ArrowShape = BoundedShape & { type: ShapeType.ARROW };

export interface PencilShape extends BaseShape {
  type: ShapeType.PENCIL;
  points: Points[];
  style: PencilStyles;
}
export interface TextShape extends BaseShape {
  type: ShapeType.TEXT;
  text: string;
  startX: number;
  startY: number;
  style: TextStyle;
  width: number;
  height: number;
}
export interface ResizeHandlers extends BoundedShape {
  type: ShapeType.RECTANGLE;
  side: "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight";
}

export enum Action {
  DRAWING = "DRAWING",
  ERASEING = "ERASEING",
  PANNING = "PANNING",
  MOVING = "MOVING",
  RESIZING = "RESIZING",
  WRITING = "WRITING",
  IDLE = "IDLE",
  ZOOMING = "ZOOMING",
}

export type Points = [number, number];
