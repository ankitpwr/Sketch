import { start } from "repl";
import { TextShape } from "../types/types";

export function drawText(ctx: CanvasRenderingContext2D, shape: TextShape) {
  const text = shape.text;
  ctx.save();
  ctx.font = "50px serif";
  ctx.fillText(text, shape.startX, shape.startY);
  ctx.restore();
}
