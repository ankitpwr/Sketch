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
  const radius = Math.abs(Math.min(width, height) / 8);
  ctx.beginPath();
  ctx.roundRect(minX, minY, width, height, radius);
  ctx.closePath();
  ctx.stroke();
}

// const minX = Math.min(s.startX, s.endX);
//       const minY = Math.min(s.startY, s.endY);
//       const maxX = Math.max(s.startX, s.endX);
//       const maxY = Math.max(s.startY, s.endY);
