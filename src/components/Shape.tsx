"use client";
import React from "react";
import { CardFill, CardShape } from "../common/types";

// Shape-specific configurations - all using consistent 20x30 viewport
const SHAPE_CONFIGS = {
  d: {
    element: <polygon points="10,2 18,15 10,28 2,15" />,
  },
  o: {
    element: <ellipse cx="10" cy="15" rx="8" ry="13" />,
  },
  s: {
    element: (
      <path d="M16,6 Q16,2 12,2 L8,2 Q4,2 4,6 Q4,8 6,9 L12,12 Q16,14 16,18 Q16,22 12,22 L8,22 Q4,22 4,26 Q4,28 8,28 L12,28 Q16,28 16,24 Q16,22 14,21 L8,18 Q4,16 4,12 Q4,8 8,8 L12,8 Q16,8 16,6 Z" />
    ),
  },
};

interface ShapeProps {
  shape: CardShape;
  fill: CardFill;
  patternId: string;
}

export function Shape({ shape, fill, patternId }: ShapeProps) {
  const config = SHAPE_CONFIGS[shape];
  const patternIdFull = `dots-${shape}-${patternId}`;

  return (
    <svg
      width="25"
      height="35"
      viewBox="0 0 20 30"
      className={`stroke-current ${
        fill === "s" ? "fill-current" : "fill-transparent"
      }`}
    >
      <defs>
        <pattern
          id={patternIdFull}
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <circle cx="2" cy="2" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      {/* Clone the shape element and add the fill prop */}
      {fill === "h"
        ? React.cloneElement(config.element, { fill: `url(#${patternIdFull})` })
        : React.cloneElement(config.element, { fill: undefined })}
    </svg>
  );
}
