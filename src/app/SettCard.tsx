"use client";
import { useState } from "react";
import {
  CardColor,
  CardFill,
  CardNumber,
  CardShape,
  SettCard as SettCardString,
} from "../settdeck";

const CardColorToRealColor: Record<CardColor, string> = {
  g: "green-500",
  p: "purple-500",
  o: "orange-500",
};

interface CardInfo {
  color: CardColor;
  number: number;
  fill: CardFill;
  shape: CardShape;
}

function cardInfoFromCardString(cardString: SettCardString): CardInfo {
  return {
    color: cardString[0] as CardColor,
    number: parseInt(cardString[1] as CardNumber),
    fill: cardString[2] as CardFill,
    shape: cardString[3] as CardShape,
  };
}

/** Hidden SVG just for pattern definitions */
function PatternElement() {
  return (
    <svg width="0" height="0" className="fill-current">
      <defs>
        <pattern id="dots" patternUnits="userSpaceOnUse" width="4" height="4">
          <rect width="6" height="6" fill="transparent" />
          <circle cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
    </svg>
  );
}

function DiamondShape({ fill }: { fill: CardFill }) {
  return (
    <svg
      width="25"
      height="35"
      viewBox="0 0 20 30"
      className={`stroke-current ${
        fill === "s" ? "fill-current" : "fill-transparent"
      }`}
    >
      <polygon
        points="10,2 18,15 10,28 2,15"
        fill={fill === "h" ? "url(#dots)" : undefined}
      />
    </svg>
  );
}

function OvalShape({ fill }: { fill: CardFill }) {
  return (
    <svg
      width="25"
      height="35"
      viewBox="0 0 20 40"
      className={`stroke-current ${
        fill === "s" ? "fill-current" : "fill-transparent"
      }`}
    >
      <ellipse
        cx="10"
        cy="20"
        rx="9"
        ry="18"
        fill={fill === "h" ? "url(#dots)" : undefined}
      />
    </svg>
  );
}

function SquigglyShape({ fill }: { fill: CardFill }) {
  return (
    <svg
      width="25"
      height="35"
      viewBox="0 0 20 30"
      className={`stroke-current ${
        fill === "s" ? "fill-current" : "fill-transparent"
      }`}
    >
      <path
        d="M16,6 Q16,2 12,2 L8,2 Q4,2 4,6 Q4,8 6,9 L12,12 Q16,14 16,18 Q16,22 12,22 L8,22 Q4,22 4,26 Q4,28 8,28 L12,28 Q16,28 16,24 Q16,22 14,21 L8,18 Q4,16 4,12 Q4,8 8,8 L12,8 Q16,8 16,6 Z"
        fill={fill === "h" ? "url(#dots)" : undefined}
      />
    </svg>
  );
}

function SettCard({
  id,
  isSelected,
  onSelect,
  cardInfo,
}: {
  id: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
  cardInfo: CardInfo;
}) {
  return (
    <button
      className={`w-30 h-20 bg-amber-50 rounded-lg cursor-pointer transition-all duration-150 flex flex-row items-center justify-center ${
        cardInfo.color === "p"
          ? "text-purple-500"
          : cardInfo.color === "g"
          ? "text-green-500"
          : "text-orange-500"
      } ${
        isSelected
          ? "bg-amber-100 outline outline-2 outline-blue-400 outline-offset-2"
          : "hover:outline hover:outline-1 hover:outline-gray-400 hover:outline-offset-1"
      }`}
      onClick={() => onSelect(id)}
    >
      <PatternElement />
      {Array.from({ length: cardInfo.number }).map((_, i) => {
        switch (cardInfo.shape) {
          case "d":
            return <DiamondShape key={i} fill={cardInfo.fill} />;
          case "o":
            return <OvalShape key={i} fill={cardInfo.fill} />;
          case "s":
            return <SquigglyShape key={i} fill={cardInfo.fill} />;
        }
      })}
    </button>
  );
}

export function SettBoard() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardSelect = (id: number) => {
    setSelectedCard(selectedCard === id ? null : id);
  };

  const sampleCards: SettCardString[] = [
    "p1sd",
    "g2eo",
    "o3hd",
    "g3ed",
    "p2hs",
    "o1sd",
  ];

  return (
    <div className="grid grid-cols-3 gap-4 bg-green-400 p-6 rounded-xl">
      {sampleCards.map((card, id) => (
        <SettCard
          key={id}
          id={id}
          isSelected={selectedCard === id}
          onSelect={handleCardSelect}
          cardInfo={cardInfoFromCardString(card)}
        />
      ))}
    </div>
  );
}

export default SettCard;
