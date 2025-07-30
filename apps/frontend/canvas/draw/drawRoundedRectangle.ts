import { RectangleShape } from "../types/types";
import { getLineDashPattern } from "../utils/drawingConfig";

export function drawRoundedRectangle(
  ctx: CanvasRenderingContext2D,
  shape: RectangleShape,
  boundingBox: { isBoundingBox: boolean; scale: number } = {
    isBoundingBox: false,
    scale: 1,
  }
) {
  const width = shape.endX - shape.startX;
  const height = shape.endY - shape.startY;
  // const radius = Math.abs(Math.min(width, height) / 6);
  const radius = boundingBox.isBoundingBox
    ? width / 3
    : Math.abs(Math.min(width, height) / 6);
  ctx.save();
  ctx.fillStyle = shape.style.background;
  ctx.strokeStyle = shape.style.strokeStyle;
  // ctx.lineWidth = shape.style.strokeWidth;
  ctx.lineWidth = boundingBox.isBoundingBox ? 1 : shape.style.strokeWidth;
  if (boundingBox.isBoundingBox) console.log(ctx.lineWidth);
  ctx.setLineDash(
    getLineDashPattern(shape.style.strokeType, shape.style.strokeWidth)
  );
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.roundRect(shape.startX, shape.startY, width, height, radius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
