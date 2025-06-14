#!/usr/bin/env node

import { SettCard, SettDeck } from "./settdeck";
import { createInterface } from 'readline/promises';
import { stdin, stdout } from 'process';

interface GreetingOptions {
  name?: string;
  emoji?: boolean;
}

function greet(options: GreetingOptions = {}): string {
  const { name = "World", emoji = false } = options;
  const greeting = `Hello, ${name}!`;
  return emoji ? `👋 ${greeting}` : greeting;
}

/* Game loop
 * 1. Deal 12 cards on the board
 * 2. While there is no set, deal 3 more
 * 3. Player can propose a set
 * 4. If not set, say so
 * 5. If yes, remove the set.
 * 6. If cards remaining, replace and go to step 2
 * 7. If no cards, game over.
 */

const STARTING_BOARD_SIZE = 12;
class SettGame {
  private deck: SettDeck;
  private board: SettCard[];
  private rl = createInterface({ input: stdin, output: stdout });

  constructor() {
    this.deck = new SettDeck();
    this.board = this.deck.deal(STARTING_BOARD_SIZE);
  }

  playGame() {
    console.log("Welcome to Set!");
    console.log("The board is:");
    console.log(this.board);
    while (!this.setExists()) {
      console.log("No set found. Dealing 3 more cards.");
      this.board = this.board.concat(this.deck.deal(3));
      console.log("The board is:");
      console.log(this.board);
    }
    console.log("Set found!");
    console.log(this.setExists());
    return;
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

function main(): void {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const name = args[0];
  const useEmoji = args.includes("--emoji");

  console.log(greet({ name, emoji: useEmoji }));

  const game = new SettGame();
  game.playGame();
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

export { greet, GreetingOptions };
