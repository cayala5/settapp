import { SettCard, ValidMove } from "./common/types";
import { isSettCard, SettDeck } from "./settdeck";

const STARTING_BOARD_SIZE = 12;

export class SettGame {
  private deck: SettDeck;
  private board_cards: SettCard[];
  private existing_set: ValidMove | null = null;
  private sets_found: ValidMove[] = [];

  constructor() {
    do {
      this.deck = new SettDeck();
      this.board_cards = this.deck.deal(STARTING_BOARD_SIZE);
    } while (!this.setExists());
  }

  get board(): SettCard[] {
    return this.board_cards;
  }

  get existingSet(): ValidMove | null {
    this.setExists(); // will update existing_set if it exists
    return this.existing_set;
  }

  get setsFound(): number {
    return this.sets_found.length;
  }

  get deckSize(): number {
    return this.deck.getCardCount();
  }

  get isOver(): boolean {
    return this.deckSize === 0 && !this.setExists();
  }

  public makeValidMove() {
    const move = this.existingSet;
    if (move) {
      this.makeMove(move.join(","));
      return move;
    }
    return null;
  }

  public makeMove(move: string): ValidMove | null {
    const cards = this.validateMove(move);
    if (!cards) {
      return null;
    }

    this.replaceCards(cards);

    while (!this.setExists() && this.deck.getCardCount() > 0) {
      this.addCards();
    }

    return cards;
  }

  // Replaces the cards from a successful move. If there are fewer than 12
  // cards after the move, it will use new cards. Otherwise, it will replace
  // with the last 3 cards. Note that caller is responsible for checking whether
  // the cards in move are on the board.
  private replaceCards(move: ValidMove) {
    let newCards: SettCard[];
    if (this.board_cards.length - 3 < 12 && this.deck.getCardCount() > 0) {
      newCards = this.deck.deal(3);
    } else {
      newCards = this.board_cards.splice(-3, 3);
    }

    newCards.forEach((newCard, index) => {
      const oldCard = move[index];
      this.board_cards[this.board_cards.indexOf(oldCard)] = newCard;
    });
  }

  // Adds three new cards to the end of the board. Caller is responsible for
  // checking that there are cards left in the deck.
  private addCards() {
    this.board_cards = this.board_cards.concat(this.deck.deal(3));
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
    if (
      this.existing_set &&
      this.boardContains(this.existing_set[0]) &&
      this.boardContains(this.existing_set[1]) &&
      this.boardContains(this.existing_set[2])
    ) {
      return this.existing_set;
    }

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
            this.existing_set = [
              this.board_cards[i],
              this.board_cards[j],
              this.board_cards[k],
            ];
            return this.existing_set;
          }
        }
      }
    }
    return null;
  }
}
