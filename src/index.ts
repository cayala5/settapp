#!/usr/bin/env node

import { SettGame } from "./settgame";

interface GreetingOptions {
  name?: string;
  emoji?: boolean;
}

function greet(options: GreetingOptions = {}): string {
  const { name = "World", emoji = false } = options;
  const greeting = `Hello, ${name}!`;
  return emoji ? `👋 ${greeting}` : greeting;
}



async function main(): Promise<void> {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const name = args[0];
  const useEmoji = args.includes("--emoji");

  console.log(greet({ name, emoji: useEmoji }));

  const game = new SettGame();
  await game.playGame();
}

// Run the main function if this file is executed directly
if (require.main === module) {
  main();
}

export { greet };
export type { GreetingOptions };
