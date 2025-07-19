// import getStroke from "perfect-freehand";
// import {
//   DrawDiamondArgs,
//   DrawEllipseArgs,
//   DrawLineArgs,
//   DrawPencilArgs,
//   DrawRectangleArgs,
// } from "./types";

// export function drawRectangle({
//   ctx,
//   minX,
//   minY,
//   maxX,
//   maxY,
// }: DrawRectangleArgs) {
//   console.log("draw rect called");
//   const width = maxX - minX;
//   const height = maxY - minY;
//   const radius = Math.min(width, height) / 4;
//   ctx.beginPath();
//   ctx.roundRect(minX, minY, width, height, radius);
//   ctx.closePath();
//   ctx.stroke();
// }
// export function drawEllipse({ ctx, minX, minY, maxX, maxY }: DrawEllipseArgs) {
//   const width = maxX - minX;
//   const height = maxY - minY;
//   const centerX = minX + width / 2;
//   const centerY = minY + height / 2;
//   ctx.beginPath();
//   ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
//   ctx.closePath();
//   ctx.stroke();
// }

// export function drawDiamond({ ctx, minX, minY, maxX, maxY }: DrawDiamondArgs) {
//   const width = maxX - minX;
//   const height = maxY - minY;
//   const centerX = minX + width / 2;
//   const centerY = minY + height / 2;
//   const topPoint = { x: centerX, y: minY };
//   const rightPoint = { x: maxX, y: centerY };
//   const bottomPoint = { x: centerX, y: maxY };
//   const leftPoint = { x: minX, y: centerY };
//   const cornerRadius = Math.min(width / 2, height / 2) * 0.4;
//   const actualRadius = Math.max(2, Math.min(cornerRadius, 15));
//   ctx.beginPath();
//   ctx.moveTo(
//     // moving to midpoint of left to top edge
//     leftPoint.x + (topPoint.x - leftPoint.x) / 2,
//     topPoint.y + (leftPoint.y - topPoint.y) / 2
//   );
//   ctx.arcTo(topPoint.x, topPoint.y, rightPoint.x, rightPoint.y, actualRadius);
//   ctx.arcTo(
//     rightPoint.x,
//     rightPoint.y,
//     bottomPoint.x,
//     bottomPoint.y,
//     actualRadius
//   );
//   ctx.arcTo(
//     bottomPoint.x,
//     bottomPoint.y,
//     leftPoint.x,
//     leftPoint.y,
//     actualRadius
//   );
//   ctx.arcTo(leftPoint.x, leftPoint.y, topPoint.x, topPoint.y, actualRadius);
//   ctx.closePath();
//   ctx.stroke();
// }

// export function drawLine({ ctx, startX, startY, endX, endY }: DrawLineArgs) {
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(startX, startY);
//   ctx.lineTo(endX, endY);
//   ctx.stroke();
// }
// export function drawArrow({ ctx, startX, startY, endX, endY }: DrawLineArgs) {
//   const dx = endX - startX;
//   const dy = endY - startY;
//   const lineLength = Math.sqrt(dx * dx + dy * dy);
//   let headlen = lineLength * 0.15;
//   headlen = Math.min(30, Math.max(headlen, 10));
//   const angle = Math.atan2(dy, dx);
//   ctx.lineWidth = 4;
//   ctx.beginPath();
//   ctx.moveTo(startX, startY);
//   ctx.lineCap = "round";
//   ctx.lineTo(endX, endY);
//   ctx.moveTo(endX, endY);
//   ctx.lineTo(
//     endX - headlen * Math.cos(angle - Math.PI / 6),
//     endY - headlen * Math.sin(angle - Math.PI / 6)
//   );
//   ctx.moveTo(endX, endY);
//   ctx.lineTo(
//     endX - headlen * Math.cos(angle + Math.PI / 6),
//     endY - headlen * Math.sin(angle + Math.PI / 6)
//   );
//   ctx.stroke();
// }

// export function drawPencil({ ctx, points }: DrawPencilArgs) {
//   const strokeOption = {
//     size: 10,
//     thinning: 0.5,
//     streamline: 0.4,
//     easing: (t: number) => t,
//     start: { cap: true, taper: 60 },
//     end: { cap: true, taper: 60 },
//     simulatePressure: true,
//   };

//   const stroke = getStroke(points, strokeOption); //return:- An array of `[x, y]` coordinate pairs that form the outer boundary (outline) of the stroke.
//   const pathData = getSvgPathFromStroke(stroke); //return:- A string in SVG Path Data format
//   const myPath = new Path2D(pathData);

//   ctx.fill(myPath);
// }

// const average = (a: number, b: number) => (a + b) / 2;

// function getSvgPathFromStroke(points: number[][], closed = true) {
//   const len = points.length;

//   if (len < 4) {
//     return ``;
//   }

//   let a = points[0];
//   let b = points[1];
//   const c = points[2];
//   //`M` (MoveTo) command: Sets the starting point of the path
//   //`Q` command:  is the control point for this curve
//   //`T` command: "draw another quadratic Bezier curve, where its control point is a reflection of the *previous* control point
//   let result = `M${a[0].toFixed(2)},${a[1].toFixed(2)} Q${b[0].toFixed(
//     2
//   )},${b[1].toFixed(2)} ${average(b[0], c[0]).toFixed(2)},${average(
//     b[1],
//     c[1]
//   ).toFixed(2)} T`;

//   for (let i = 2, max = len - 1; i < max; i++) {
//     a = points[i];
//     b = points[i + 1];
//     result += `${average(a[0], b[0]).toFixed(2)},${average(a[1], b[1]).toFixed(
//       2
//     )} `;
//   }

//   if (closed) {
//     result += "Z";
//   }

//   return result;
// }
