import { EllipseShape } from "../types/types";

export function drawEllipse(
  ctx: CanvasRenderingContext2D,
  shape: EllipseShape
) {
  const width = Math.abs(shape.endX - shape.startX);
  const height = Math.abs(shape.endY - shape.startY);
  const centerX = shape.startX + width / 2;
  const centerY = shape.startY + height / 2;
  ctx.fillStyle = shape.style.background;
  ctx.strokeStyle = shape.style.strokeStyle;
  ctx.lineWidth = shape.style.strokeWidth;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}
