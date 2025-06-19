import { isSettCard, SettCard, SettDeck } from "./settdeck";
import { createInterface } from 'readline/promises';
import { stdin, stdout } from 'process';

const STARTING_BOARD_SIZE = 12;

export class SettGame {
  private deck: SettDeck;
  private board: SettCard[];
  private rl = createInterface({ input: stdin, output: stdout });

  constructor() {
    this.deck = new SettDeck();
    this.board = this.deck.deal(STARTING_BOARD_SIZE);
  }

  private printBoard() {
    const numRows = Math.ceil(this.board.length / 3);
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const row = this.board.slice(i * 3, (i + 1) * 3);
      rows.push(row.join(" "));
    }
    console.log(rows.join("\n"));
  }

  async playGame() {
    console.log("Welcome to Set!");
    console.log("The board is:");
    this.printBoard();
    while (!this.setExists()) {
      console.log("No set found. Dealing 3 more cards.");
      this.board = this.board.concat(this.deck.deal(3));
      console.log("The board is:");
      this.printBoard();
    }
    const userInput = await this.rl.question('Propose a set (e.g., "p1sd,g2eo,o3hd"): ');
    console.log(`You proposed a set: ${userInput}`);
    this.rl.close();
    return;
  }

  // TODO: Return somehow why the move is invalid
  private validateMove(move: string): SettCard[] | null {
    const cards = move.split(",");
    if (cards.length !== 3) {
      return null;
    }
    const validCards: SettCard[] = [];
    for (const card of cards) {
      if (!isSettCard(card)) {
        return null;
      }
      if (!this.boardContains(card)) {
        return null;
      }
      validCards.push(card);
    }
    return validCards;
  }

  private boardContains(card: SettCard): boolean {
    return this.board.includes(card);
  }

  private propertyIsSet(
    cards: [SettCard, SettCard, SettCard],
    property: 0 | 1 | 2 | 3
  ): boolean {
    const [a, b, c] = cards;
    const allMatch = a[property] === b[property] && b[property] === c[property];
    const allDiffer =
      a[property] !== b[property] &&
      b[property] !== c[property] &&
      a[property] !== c[property];
    return allMatch || allDiffer;
  }

  private isSet(cards: [SettCard, SettCard, SettCard]): boolean {
    return (
      this.propertyIsSet(cards, 0) &&
      this.propertyIsSet(cards, 1) &&
      this.propertyIsSet(cards, 2) &&
      this.propertyIsSet(cards, 3)
    );
  }

  private setExists(): [SettCard, SettCard, SettCard] | null {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = i + 1; j < this.board.length; j++) {
        for (let k = j + 1; k < this.board.length; k++) {
          if (this.isSet([this.board[i], this.board[j], this.board[k]])) {
            return [this.board[i], this.board[j], this.board[k]];
          }
        }
      }
    }
    return null;
  }
} 