import { start } from "repl";
import { DrawTextAgrs } from "../types/types";

export function drawText({ ctx, text, startX, startY }: DrawTextAgrs) {
  console.log(`text is ${text}`);
  ctx.font = "50px serif";
  ctx.fillText(text, startX, startY);
}
