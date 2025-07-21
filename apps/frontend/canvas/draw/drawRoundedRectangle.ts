import { DrawRectangleArgs } from "../types/types";

export function drawRoundedRectangle({
  ctx,
  minX,
  minY,
  maxX,
  maxY,
}: DrawRectangleArgs) {
  const width = maxX - minX;
  const height = maxY - minY;
  const radius = Math.min(width, height) / 8;
  ctx.beginPath();
  ctx.roundRect(minX, minY, width, height, radius);
  ctx.closePath();
  ctx.stroke();
}
