import { SettCard, ValidMove } from "./types";

// "In" and "out" in this file are from the perspective of the
// game server
export const outgoingMsgTypes = {
  BoardState: "BOARD_STATE_OUT",
  ProposedMove: "PROPOSED_MOVE_OUT",
  GameOver: "GAME_OVER_OUT",
};

export const incomingMsgTypes = {
  ProposedMove: "PROPOSED_MOVE_IN",
};

interface GameState {
  board: SettCard[];
  setsFound: number;
  deckSize: number;
}

// #region Outgoing messages
export type OutgoingMsg =
  | ProposedMoveOutMsg
  | BoardStateOutMsg
  | GameOverOutMsg;

export interface GameOverOutMsg {
  type: typeof outgoingMsgTypes.GameOver;
}

export interface ProposedMoveOutMsg {
  type: typeof outgoingMsgTypes.ProposedMove;
  move: ValidMove | null;
  gameState: GameState;
}

export interface BoardStateOutMsg {
  type: typeof outgoingMsgTypes.BoardState;
  board: SettCard[];
}

// #region Incoming messages
export interface ProposedMoveInMsg {
  type: typeof incomingMsgTypes.ProposedMove;
  move: string;
}
