import { DrawLineArgs } from "../types/types";

export function drawArrow({ ctx, startX, startY, endX, endY }: DrawLineArgs) {
  const dx = endX - startX;
  const dy = endY - startY;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  let headlen = lineLength * 0.15;
  headlen = Math.min(30, Math.max(headlen, 10));
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineCap = "round";
  ctx.lineTo(endX, endY);
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headlen * Math.cos(angle - Math.PI / 6),
    endY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(endX, endY);
  ctx.lineTo(
    endX - headlen * Math.cos(angle + Math.PI / 6),
    endY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}
