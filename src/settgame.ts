import { SettCard, ValidMove } from "./common/types";
import { isSettCard, SettDeck } from "./settdeck";

const STARTING_BOARD_SIZE = 12;

export class SettGame {
  private deck: SettDeck;
  private board_cards: SettCard[];

  constructor() {
    do {
      this.deck = new SettDeck();
      this.board_cards = this.deck.deal(STARTING_BOARD_SIZE);
    } while (!this.setExists());
  }

  get board(): SettCard[] {
    return this.board_cards;
  }

  /*
  async playGameCommandLine() {
    console.log("Welcome to Set!");
    console.log("The board is:");
    this.printBoard();
    while (!this.setExists()) {
      console.log("No set found. Dealing 3 more cards.");
      this.board_cards = this.board_cards.concat(this.deck.deal(3));
      console.log("The board is:");
      this.printBoard();
    }
    //const userInput = await this.rl.question('Propose a set (e.g., "p1sd,g2eo,o3hd"): ');
    //console.log(`You proposed a set: ${userInput}`);
    //this.rl.close();
    return;
  }
  */
  public makeMove(move: string): ValidMove | null {
    const cards = this.validateMove(move);
    if (cards) {
      this.board_cards = this.board_cards.filter(
        (card) => !cards.includes(card)
      );
      this.replaceCardsAfterMove();
    }

    return cards;
  }

  private replaceCardsAfterMove() {
    do {
      this.board_cards = this.board_cards.concat(this.deck.deal(3));
    } while (!this.setExists() && this.deck.getCardCount() > 0);
  }

  // TODO: Return somehow why the move is invalid
  private validateMove(move: string): ValidMove | null {
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
    // We know there are 3 from the check above
    const validMove = validCards as ValidMove;
    return this.isSet(validMove) ? validMove : null;
  }

  private boardContains(card: SettCard): boolean {
    return this.board_cards.includes(card);
  }

  private propertyIsSet(cards: ValidMove, property: 0 | 1 | 2 | 3): boolean {
    const [a, b, c] = cards;
    const allMatch = a[property] === b[property] && b[property] === c[property];
    const allDiffer =
      a[property] !== b[property] &&
      b[property] !== c[property] &&
      a[property] !== c[property];
    return allMatch || allDiffer;
  }

  private isSet(cards: ValidMove): boolean {
    return (
      this.propertyIsSet(cards, 0) &&
      this.propertyIsSet(cards, 1) &&
      this.propertyIsSet(cards, 2) &&
      this.propertyIsSet(cards, 3)
    );
  }

  private setExists(): ValidMove | null {
    for (let i = 0; i < this.board_cards.length; i++) {
      for (let j = i + 1; j < this.board_cards.length; j++) {
        for (let k = j + 1; k < this.board_cards.length; k++) {
          if (
            this.isSet([
              this.board_cards[i],
              this.board_cards[j],
              this.board_cards[k],
            ])
          ) {
            return [
              this.board_cards[i],
              this.board_cards[j],
              this.board_cards[k],
            ];
          }
        }
      }
    }
    return null;
  }
}
