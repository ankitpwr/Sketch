import getStroke from "perfect-freehand";
import { PencilShape } from "@repo/types/canvasTypes";

export function drawPencil(ctx: CanvasRenderingContext2D, shape: PencilShape) {
  ctx.save();
  const points = shape.points;
  const strokeOption = {
    size: shape.style.strokeWidth,
    thinning: shape.style.thinning, // pressure sensitivity
    streamline: 0.6,
    smoothing: 0.58,
    easing: (t: number) => t,
    start: { cap: true, taper: shape.style.tapper },
    end: { cap: true, taper: shape.style.tapper },
    simulatePressure: true,
  };

  const stroke = getStroke(points, strokeOption); //return:- An array of `[x, y]` coordinate pairs that form the outer boundary (outline) of the stroke.
  const pathData = getSvgPathFromStroke(stroke); //return:- A string in SVG Path Data format
  const myPath = new Path2D(pathData);
  ctx.fillStyle = shape.style.StrokeStyle;
  ctx.fill(myPath);
  ctx.restore();
}

const average = (a: number, b: number) => (a + b) / 2;

function getSvgPathFromStroke(points: number[][], closed = true) {
  const len = points.length;

  if (len < 4) {
    return ``;
  }

  let a = points[0];
  let b = points[1];
  const c = points[2];
  //`M` (MoveTo) command: Sets the starting point of the path
  //`Q` command:  is the control point for this curve
  //`T` command: "draw another quadratic Bezier curve, where its control point is a reflection of the *previous* control point
  let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
    2
  )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
    b[1],
    c[1]
  ).toFixed(2)} T`;

  for (let i = 2, max = len - 1; i < max; i++) {
    a = points[i];
    b = points[i + 1];
    result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
      2
    )} `;
  }

  if (closed) {
    result += "Z";
  }

  return result;
}
