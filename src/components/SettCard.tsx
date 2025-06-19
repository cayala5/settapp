"use client";
import {
  CardColor,
  CardFill,
  CardNumber,
  CardShape,
  SettCard as SettCardString,
} from "../common/types";
import { Shape } from "./Shape";

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
      {Array.from({ length: cardInfo.number }).map((_, i) => (
        <Shape
          key={i}
          shape={cardInfo.shape}
          fill={cardInfo.fill}
          // TODO: this is ugly but it works -- would be nice to fix
          patternId={`${card}-${i}`}
        />
      ))}
    </button>
  );
}

export default SettCard;
