import { start } from "repl";
import { TextShape } from "../types/types";

export function drawText(ctx: CanvasRenderingContext2D, shape: TextShape) {
  //{ ctx, text, startX, startY }
  const text = shape.text;
  console.log(`text is ${text}`);
  ctx.font = "50px serif";
  ctx.fillText(text, shape.startX, shape.startY);
}
