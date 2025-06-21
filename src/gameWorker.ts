import { SettGame } from "./settgame";
import {
  GameOverOutMsg,
  incomingMsgTypes,
  OutgoingMsg,
  outgoingMsgTypes,
  ProposedMoveOutMsg,
} from "./common/messages";

// Basic web worker for Set game
console.log("Game worker initialized");

const game = new SettGame();

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  console.log("Worker received message:", event.data);

  if (event.data.type === incomingMsgTypes.ProposedMove) {
    const move = event.data.move;
    const validMove = game.makeMove(move);
    const response: ProposedMoveOutMsg = {
      type: outgoingMsgTypes.ProposedMove,
      move: validMove,
      gameState: {
        board: game.board,
        setsFound: game.setsFound,
        deckSize: game.deckSize,
      },
    };
    send(response);

    if (game.isOver) {
      const response: GameOverOutMsg = {
        type: outgoingMsgTypes.GameOver,
      };
      send(response);
    }
  }
});

// Let the main thread know we're ready
self.postMessage({
  type: "WORKER_INITIALIZED",
  message: "Worker has been initialized",
});
send({
  type: outgoingMsgTypes.BoardState,
  board: game.board,
});

function send(msg: OutgoingMsg) {
  self.postMessage(msg);
}
