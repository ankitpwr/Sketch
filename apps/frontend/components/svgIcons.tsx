import React from "react";

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
