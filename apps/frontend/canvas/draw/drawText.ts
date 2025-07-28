import { TextShape } from "../types/types";

export function drawText(ctx: CanvasRenderingContext2D, shape: TextShape) {
  const text = shape.text;
  ctx.save();
  ctx.fillStyle = shape.style.strokeStyle;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = `${shape.style.fontsize} ${shape.style.fontfamily}`;
  ctx.fillText(text, shape.startX, shape.startY);
  ctx.restore();
}
