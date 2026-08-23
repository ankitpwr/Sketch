import { cpSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(packageDirectory, "src/generated");
const destination = resolve(packageDirectory, "dist/generated");

mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true });
