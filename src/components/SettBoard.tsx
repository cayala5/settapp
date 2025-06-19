"use client";
import { useState, useCallback, useEffect } from "react";
import { SettCard as SettCardString } from "../common/types";
import { useGameWorker } from "../hooks/useGameWorker";
import { incomingMsgTypes, outgoingMsgTypes } from "@/common/messages";
import { WorkerTestPanel } from "./WorkerTestPanel";
import SettCard from "./SettCard";

const DEBUG_MODE = false;

export function SettBoard() {
  const [selectedCards, setSelectedCards] = useState<SettCardString[]>([]);
  const [board, setBoard] = useState<SettCardString[]>([]);
  const [setsFound, setSetsFound] = useState(0);
  const [deckSize, setDeckSize] = useState(0);

  const handleWorkerMessage = useCallback((event: MessageEvent) => {
    console.log("SettBoard received worker message:", event.data);
    if (event.data.type === outgoingMsgTypes.BoardState) {
      setBoard(event.data.board);
    } else if (
      event.data.type === outgoingMsgTypes.ProposedMove &&
      event.data.move
    ) {
      setBoard(event.data.gameState.board);
      setSetsFound(event.data.gameState.setsFound);
      setDeckSize(event.data.gameState.deckSize);
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
      {DEBUG_MODE && (
        <WorkerTestPanel
          workerMessage={workerMessage}
          isWorkerReady={isWorkerReady}
          sendMessage={sendMessage}
        />
      )}
      <div>
        <p>Sets found: {setsFound}</p>
        <p>Deck size: {deckSize}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 bg-green-400 p-6 rounded-xl w-fit">
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
