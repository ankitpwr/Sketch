import { DrawEllipseArgs } from "../types/types";

export function drawEllipse({ ctx, minX, minY, maxX, maxY }: DrawEllipseArgs) {
  const width = Math.abs(maxX - minX);
  const height = Math.abs(maxY - minY);
  const centerX = minX + width / 2;
  const centerY = minY + height / 2;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
}
