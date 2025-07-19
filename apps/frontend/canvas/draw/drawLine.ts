import { DrawLineArgs } from "../types/types";

export function drawLine({ ctx, startX, startY, endX, endY }: DrawLineArgs) {
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}
