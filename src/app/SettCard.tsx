"use client";
import { useState, useCallback, useEffect } from "react";
import {
  CardColor,
  CardFill,
  CardNumber,
  CardShape,
  SettCard as SettCardString,
} from "../common/types";
import { useGameWorker } from "../hooks/useGameWorker";
import { incomingMsgTypes, outgoingMsgTypes } from "@/common/messages";
import { WorkerTestPanel } from "../components/WorkerTestPanel";
import { Shape } from "../components/Shape";

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
          patternId={`${card}-${i}`}
        />
      ))}
    </button>
  );
}

export function SettBoard() {
  const [selectedCards, setSelectedCards] = useState<SettCardString[]>([]);
  const [board, setBoard] = useState<SettCardString[]>([]);

  const handleWorkerMessage = useCallback((event: MessageEvent) => {
    console.log("SettBoard received worker message:", event.data);
    if (event.data.type === outgoingMsgTypes.BoardState) {
      setBoard(event.data.board);
    } else if (event.data.type === outgoingMsgTypes.ProposedMove) {
      setBoard(event.data.board);
    }
  }, []);

  const { workerMessage, sendMessage, isWorkerReady } = useGameWorker({
    onMessage: handleWorkerMessage,
  });

  useEffect(() => {
    if (selectedCards.length === 3) {
      sendMessage({
        type: incomingMsgTypes.ProposedMove,
        move: selectedCards.join(","),
      });
      setSelectedCards([]);
    }
  }, [selectedCards, sendMessage]);

  function handleCardSelect(card: SettCardString) {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else {
      if (selectedCards.length === 3) {
        setSelectedCards([...selectedCards.slice(1), card]);
      } else {
        setSelectedCards([...selectedCards, card]);
      }
    }
  }

  return (
    <div className="space-y-4">
      <WorkerTestPanel
        workerMessage={workerMessage}
        isWorkerReady={isWorkerReady}
        sendMessage={sendMessage}
      />
      <div className="grid grid-cols-3 gap-4 bg-green-400 p-6 rounded-xl">
        {board.map((card) => (
          <SettCard
            key={card}
            card={card}
            isSelected={selectedCards.includes(card)}
            onSelect={handleCardSelect}
          />
        ))}
      </div>
    </div>
  );
}

export default SettCard;
