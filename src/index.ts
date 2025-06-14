#!/usr/bin/env node

import { SettDeck } from './settdeck';

interface GreetingOptions {
  name?: string;
  emoji?: boolean;
}

function greet(options: GreetingOptions = {}): string {
  const { name = "World", emoji = false } = options;
  const greeting = `Hello, ${name}!`;
  return emoji ? `👋 ${greeting}` : greeting;
}




function main(): void {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const name = args[0];
  const useEmoji = args.includes("--emoji");

  console.log(greet({ name, emoji: useEmoji }));

  // Demonstrate the Sett deck with shuffling
  const deck = new SettDeck();

  // Deal some cards
  const hand = deck.deal(5);
  console.log(`\nDealt 12 cards: ${hand}`);

  // Example of using Node.js APIs with TypeScript
  console.log(`\nCurrent working directory: ${process.cwd()}`);
  console.log(`Node.js version: ${process.version}`);
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

export { greet, GreetingOptions };
