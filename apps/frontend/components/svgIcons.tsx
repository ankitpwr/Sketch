import { Thinning } from "@/canvas/utils/drawingConfig";
import React from "react";
import clsx from "clsx";

export function ThinLineIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="4"
        y1={size / 2}
        x2={size - 4}
        y2={size / 2}
        stroke={color} // Use the color prop
        strokeWidth="1" // Specific stroke width for "thin"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function BoldLineIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="4"
        y1={size / 2}
        x2={size - 5}
        y2={size / 2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function ExtraBold({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="4"
        y1={size / 2}
        x2={size - 4}
        y2={size / 2}
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Dashed({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="4"
        y1={size / 2}
        x2={size - 4}
        y2={size / 2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="3, 3"
      />
    </svg>
  );
}
export function Dotted({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line
        x1="4"
        y1={size / 2}
        x2={size - 4}
        y2={size / 2}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="0, 5"
      />
    </svg>
  );
}

export function NoTaperIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={color} // Use fill for shapes
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 3 10 H 21 V 14 H 3 Z" />
    </svg>
  );
}

export function SubtleTaperIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 3 12 C 7 9, 17 9, 21 12 C 17 15, 7 15, 3 12 Z" />
    </svg>
  );
}

export function SharpTaperIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 2 12 C 8 7, 16 7, 22 12 C 16 17, 8 17, 2 12 Z" />
    </svg>
  );
}

export function NoThinningIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* This path is a simple quadratic Bézier curve with a constant stroke width.
        M 4 16: Moves to the starting point.
        Q 16 12: Sets the control point for the curve, pulling it upwards.
        28 16: Sets the end point of the curve.
      */}
      <path d="M 4 14 Q 16 15 28 14 L 28 18 Q 16 17 4 18 Z" fill={color} />
    </svg>
  );
}
export function MediumThinningIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/*
        This is a filled path that creates the illusion of a stroke with variable width.
        The path outlines a shape that is wider at the ends and narrower in the middle.
        - M 4 14.5 Q 16 15 28 14.5: Defines the top edge of the shape.
        - L 28 17.5: Connects to the bottom edge at the end.
        - Q 16 17 4 17.5: Defines the bottom edge of the shape.
        - Z: Closes the path to create a solid, fillable shape.
      */}
      <path d="M 4 14 Q 17 17 28 14 L 28 18 Q 16 17 4 18 Z" fill={color} />
    </svg>
  );
}

export function HighThinningIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/*
        Similar to the Medium version, but the control points are adjusted
        to create a more dramatic difference between the thickest and thinnest parts.
        The shape is 4 units thick at the ends and only 1 unit thick in the middle.
      */}
      <path
        d="M 4 14 Q 18 18 28 14 L 28 18 Q 16 17 4 18 Z"
        stroke-line="round"
        fill={color}
      />
    </svg>
  );
}

export function CodeIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M14.447 3.027a.75.75 0 0 1 .527.92l-4.5 16.5a.75.75 0 0 1-1.448-.394l4.5-16.5a.75.75 0 0 1 .921-.526ZM16.72 6.22a.75.75 0 0 1 1.06 0l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 1 1-1.06-1.06L21.44 12l-4.72-4.72a.75.75 0 0 1 0-1.06Zm-9.44 0a.75.75 0 0 1 0 1.06L2.56 12l4.72 4.72a.75.75 0 1 1-1.06 1.06L.97 12.53a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.06 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function NormalFontFamilyIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5.833 16.667v-10a3.333 3.333 0 0 1 3.334-3.334h1.666a3.333 3.333 0 0 1 3.334 3.334v10M5.833 10.833h8.334"></path>
      </g>
    </svg>
  );
}

export function ComicFontFamilyIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
    >
      {/* This path uses a cubic Bézier curve to draw the 'C' shape.
        - M16 3: Starts the path at the top-right.
        - C 3 6, 3 17, 15 17: Defines the curve.
          - (3, 6) is the first control point, pulling the line left and down.
          - (3, 17) is the second control point, creating the wide belly of the 'C' on the left.
          - (15, 17) is the end point at the bottom-right.
      */}
      <path
        d="M16 3 C 3 6, 3 17, 15 17"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FontLargeIcon({
  size,
  color,
}: {
  size: number;
  color: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g clipPath="url(#a)">
        <path
          d="M5.833 3.333v13.334h8.334"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
