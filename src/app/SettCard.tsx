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
      <defs>
        <pattern
          id="dots-diamond"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <circle cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <polygon
        points="10,2 18,15 10,28 2,15"
        fill={fill === "h" ? "url(#dots-diamond)" : undefined}
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
      <defs>
        <pattern
          id="dots-oval"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <circle cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <ellipse
        cx="10"
        cy="20"
        rx="9"
        ry="18"
        fill={fill === "h" ? "url(#dots-oval)" : undefined}
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
      <defs>
        <pattern
          id="dots-squiggly"
          patternUnits="userSpaceOnUse"
          width="4"
          height="4"
        >
          <circle cx="2" cy="2" r="1.5" />
        </pattern>
      </defs>
      <path
        d="M16,6 Q16,2 12,2 L8,2 Q4,2 4,6 Q4,8 6,9 L12,12 Q16,14 16,18 Q16,22 12,22 L8,22 Q4,22 4,26 Q4,28 8,28 L12,28 Q16,28 16,24 Q16,22 14,21 L8,18 Q4,16 4,12 Q4,8 8,8 L12,8 Q16,8 16,6 Z"
        fill={fill === "h" ? "url(#dots-squiggly)" : undefined}
      />
    </svg>
  );
}

function SettCard({
  isSelected,
  onSelect,
  card,
}: {
  isSelected: boolean;
  onSelect: (card: SettCardString) => void;
  card: SettCardString;
}) {
  const cardInfo = cardInfoFromCardString(card);

  return (
    <button
      className={`w-30 h-20 bg-amber-50 rounded-lg cursor-pointer transition-all duration-20 flex flex-row items-center justify-center ${
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
      onClick={() => onSelect(card)}
    >
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
  const [selectedCards, setSelectedCards] = useState<SettCardString[]>([]);

  const handleCardSelect2 = (card: SettCardString) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else {
      if (selectedCards.length === 3) {
        setSelectedCards([...selectedCards.slice(1), card]);
      } else {
        setSelectedCards([...selectedCards, card]);
      }
    }
  };

  const sampleCards: SettCardString[] = [
    "g1ho",
    "p1hs",
    "o1hd",
    "g2ho",
    "p2hs",
    "o2hd",
    "g3ho",
    "p3hs",
    "o3hd",
  ];

  return (
    <div className="grid grid-cols-3 gap-4 bg-green-400 p-6 rounded-xl">
      {sampleCards.map((card) => (
        <SettCard
          key={card}
          card={card}
          isSelected={selectedCards.includes(card)}
          onSelect={handleCardSelect2}
        />
      ))}
    </div>
  );
}

export default SettCard;
