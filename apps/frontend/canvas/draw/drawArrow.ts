import { ArrowShape } from "../types/types";

export function drawArrow(ctx: CanvasRenderingContext2D, shape: ArrowShape) {
  const dx = shape.endX - shape.startX;
  const dy = shape.endY - shape.startY;
  const lineLength = Math.sqrt(dx * dx + dy * dy);
  let headlen = lineLength * 0.15;
  headlen = Math.min(30, Math.max(headlen, 10));
  const angle = Math.atan2(dy, dx);
  ctx.fillStyle = shape.style.background;
  ctx.strokeStyle = shape.style.strokeStyle;
  ctx.lineWidth = shape.style.strokeWidth;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(shape.startX, shape.startY);
  ctx.lineTo(shape.endX, shape.endY);
  ctx.moveTo(shape.endX, shape.endY);
  ctx.lineTo(
    shape.endX - headlen * Math.cos(angle - Math.PI / 6),
    shape.endY - headlen * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(shape.endX, shape.endY);
  ctx.lineTo(
    shape.endX - headlen * Math.cos(angle + Math.PI / 6),
    shape.endY - headlen * Math.sin(angle + Math.PI / 6)
  );
  ctx.fill();
  ctx.stroke();
}
