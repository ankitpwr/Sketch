import { LineShape } from "../types/types";

export function drawLine(ctx: CanvasRenderingContext2D, shape: LineShape) {
  ctx.fillStyle = shape.style.background;
  ctx.strokeStyle = shape.style.strokeStyle;
  ctx.lineWidth = shape.style.strokeWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.fill();
  ctx.stroke();
}
