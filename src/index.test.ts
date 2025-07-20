import { test, describe } from "node:test";
import assert from "node:assert";
import { SettDeck } from "./settdeck";
import { COLORS, NUMBERS, FILLS, SHAPES, type SettCard } from "./common/types";

/* TODO: SettGame tests
- test that found sets are added to sets_found
- test makeMove
*/

describe("SettDeck", () => {
  test("should create deck with 81 cards", () => {
    const deck = new SettDeck();
    assert.strictEqual(deck.getCardCount(), 81);
  });

  test("should have valid card format", () => {
    const deck = new SettDeck();
    const cards = deck.getCards();

    // Check first few cards have valid format
    for (let i = 0; i < 5; i++) {
      const card = cards[i];
      assert.match(card, /^[pgo][123][seh][dos]$/);
    }
  });

  test("should deal cards correctly", () => {
    const deck = new SettDeck();
    const originalCount = deck.getCardCount();

    const hand = deck.deal(5);

    assert.strictEqual(hand.length, 5);
    assert.strictEqual(deck.getCardCount(), originalCount - 5);

    // Verify dealt cards are valid
    hand.forEach((card) => {
      assert.match(card, /^[pgo][123][seh][dos]$/);
    });
  });

  test("should contain all unique cards", () => {
    const deck = new SettDeck();
    const cards = deck.getCards();
    const uniqueCards = new Set(cards);

    assert.strictEqual(uniqueCards.size, 81);
    assert.strictEqual(cards.length, 81);
  });

  test("should contain all possible combinations", () => {
    const deck = new SettDeck();
    const cards = new Set(deck.getCards());

    // Generate all expected combinations
    const expectedCards = new Set<SettCard>();
    for (const color of COLORS) {
      for (const number of NUMBERS) {
        for (const fill of FILLS) {
          for (const shape of SHAPES) {
            expectedCards.add(`${color}${number}${fill}${shape}` as SettCard);
          }
        }
      }
    }

    assert.deepStrictEqual(cards, expectedCards);
  });

  test("should shuffle cards (cards should not be in original order)", () => {
    // Create unshuffled reference manually
    const unshuffledCards: SettCard[] = [];
    for (const color of COLORS) {
      for (const number of NUMBERS) {
        for (const fill of FILLS) {
          for (const shape of SHAPES) {
            unshuffledCards.push(`${color}${number}${fill}${shape}`);
          }
        }
      }
    }

    const shuffledDeck = new SettDeck();
    const shuffledCards = shuffledDeck.getCards().slice(0, 10);
    const unshuffledReference = unshuffledCards.slice(0, 10);

    // With high probability, first 10 cards should be different after shuffle
    let differences = 0;
    for (let i = 0; i < 10; i++) {
      if (shuffledCards[i] !== unshuffledReference[i]) {
        differences++;
      }
    }

    // Expect at least some differences (very unlikely to be identical after shuffle)
    assert(
      differences > 0,
      "Cards should be shuffled and not in original order"
    );
  });
});
