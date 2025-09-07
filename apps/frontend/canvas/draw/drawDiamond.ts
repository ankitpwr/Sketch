import { DiamondShape, Shape } from "@repo/types/canvasTypes";
import {
  Edges,
  getLineDashPattern,
  getThemeColors,
} from "@repo/types/drawingConfig";
import { RoughCanvas } from "roughjs/bin/canvas";

export function drawDiamond(
  roughCanvas: RoughCanvas,
  shape: DiamondShape,
  themeColors: ReturnType<typeof getThemeColors>
) {
  const width = shape.endX - shape.startX;
  const height = shape.endY - shape.startY;
  const centerX = shape.startX + width / 2;
  const centerY = shape.startY + height / 2;
  const topPoint = { x: centerX, y: shape.startY };
  const rightPoint = { x: shape.endX, y: centerY };
  const bottomPoint = { x: centerX, y: shape.endY };
  const leftPoint = { x: shape.startX, y: centerY };
  const cornerRadius = Math.min(width / 2, height / 2) * 0.4;
  const actualRadius = Math.max(2, Math.min(cornerRadius, 15));

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
    hachureGap: 3 * shape.style.strokeWidth,
  };
  console.log(`in edge is :- `);
  console.log(shape.style.edges);

  if ((shape.style.edges = Edges.Rounded)) {
    console.log(`rounded edges`);
    const roundedDiamondPath = createRoundedDiamondPath(
      shape.startX,
      shape.startY,
      shape.endX - shape.startX,
      shape.endY - shape.startY
    );
    roughCanvas.path(roundedDiamondPath, options);
  } else {
    const points: [number, number][] = [
      [topPoint.x, topPoint.y],
      [rightPoint.x, rightPoint.y],
      [bottomPoint.x, bottomPoint.y],
      [leftPoint.x, leftPoint.y],
    ];

    roughCanvas.polygon(points, options);
  }
}

function createRoundedDiamondPath(
  x: number,
  y: number,
  width: number,
  height: number
): string {
  const an = 0.11; // "an" controls the roundness, 0.5 is a circle

  const topX = x + width / 2;
  const topY = y;
  const rightX = x + width;
  const rightY = y + height / 2;
  const bottomX = x + width / 2;
  const bottomY = y + height;
  const leftX = x;
  const leftY = y + height / 2;

  // prettier-ignore
  return `M ${topX + (leftX - topX) * an}, ${topY + (leftY - topY) * an}
    Q ${leftX}, ${leftY}, ${leftX + (bottomX - leftX) * an}, ${leftY + (bottomY - leftY) * an}
    Q ${bottomX}, ${bottomY}, ${bottomX + (rightX - bottomX) * an}, ${bottomY + (rightY - bottomY) * an}
    Q ${rightX}, ${rightY}, ${rightX + (topX - rightX) * an}, ${rightY + (topY - rightY) * an}
    Q ${topX}, ${topY}, ${topX + (leftX - topX) * an}, ${topY + (leftY - topY) * an}
    Z`;
}
