export const COLORS = ["p", "g", "o"] as const;
export const NUMBERS = ["1", "2", "3"] as const;
export const FILLS = ["s", "e", "h"] as const;
export const SHAPES = ["d", "o", "s"] as const;

export type SettCard =
  `${(typeof COLORS)[number]}${(typeof NUMBERS)[number]}${(typeof FILLS)[number]}${(typeof SHAPES)[number]}`;

export class SettDeck {
  private cards: SettCard[] = [];

  constructor() {
    this.cards = this.generateCards();
    this.shuffle();
  }

  protected generateCards(): SettCard[] {
    const cards: SettCard[] = [];
    for (const color of COLORS) {
      for (const number of NUMBERS) {
        for (const fill of FILLS) {
          for (const shape of SHAPES) {
            cards.push(`${color}${number}${fill}${shape}`);
          }
        }
      }
    }
    return cards;
  }

  // Fisher-Yates shuffle algorithm
  private shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  // Deal a specific number of cards from the top
  deal(count: number): SettCard[] {
    return this.cards.splice(0, count);
  }

  // Get the total number of cards
  getCardCount(): number {
    return this.cards.length;
  }

  // Get a copy of the cards (to avoid external mutation)
  getCards(): SettCard[] {
    return [...this.cards];
  }
} 