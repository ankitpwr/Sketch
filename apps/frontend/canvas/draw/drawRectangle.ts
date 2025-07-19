import { DrawRectangleArgs } from "../types/types";

export function drawRectangle({
  ctx,
  minX,
  minY,
  maxX,
  maxY,
}: DrawRectangleArgs) {
  console.log("draw rect called");
  const width = maxX - minX;
  const height = maxY - minY;
  const radius = Math.min(width, height) / 4;
  ctx.beginPath();
  ctx.roundRect(minX, minY, width, height, radius);
  ctx.closePath();
  ctx.stroke();
}
