import { LineShape } from "@repo/types/canvasTypes";
import { getLineDashPattern, getThemeColors } from "@repo/types/drawingConfig";
import { RoughCanvas } from "roughjs/bin/canvas";
export function drawLine(
  roughCanvas: RoughCanvas,
  shape: LineShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
  const options = {
    stroke: themeColors[shape.style.strokeColorKey],
    fill: themeColors[shape.style.backgroundColorKey],
    strokeWidth: shape.style.strokeWidth,
    roughness: shape.style.sloppiness,
    bowing: shape.style.bowing,
    fillStyle: shape.style.fillStyle,
    strokeLineDash: getLineDashPattern(
      shape.style.strokeType,
      shape.style.strokeWidth
    ),
    seed: shape.seed,
  };

  roughCanvas.linearPath(
    [
      [shape.startX, shape.startY],
      [shape.endX, shape.endY],
    ],
    options
  );

  // ctx.save();
  // ctx.fillStyle = themeColors[shape.style.backgroundColorKey];
  // ctx.strokeStyle = themeColors[shape.style.strokeColorKey];
  // ctx.lineWidth = shape.style.strokeWidth;
  // ctx.setLineDash(
  //   getLineDashPattern(shape.style.strokeType, shape.style.strokeWidth)
  // );
  // ctx.lineCap = "round";
  // ctx.beginPath();
  // ctx.moveTo(shape.startX, shape.startY);
  // ctx.lineTo(shape.endX, shape.endY);
  // ctx.fill();
  // ctx.stroke();
  // ctx.restore();
}
