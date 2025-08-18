import { TextShape } from "@repo/types/canvasTypes";
import { getThemeColors } from "@repo/types/drawingConfig";

export function drawText(
  ctx: CanvasRenderingContext2D,
  shape: TextShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
  const text = shape.text;
  ctx.save();
  ctx.fillStyle = themeColors[shape.style.strokeColorKey];
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.font = `${shape.style.fontsize} ${shape.style.fontfamily}`;
  ctx.fillText(text, shape.startX, shape.startY);
  ctx.restore();
}
