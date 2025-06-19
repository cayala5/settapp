export type ValidMove = [SettCard, SettCard, SettCard];

export const COLORS = ["p", "g", "o"] as const;
export const NUMBERS = ["1", "2", "3"] as const;
export const FILLS = ["s", "e", "h"] as const;
export const SHAPES = ["d", "o", "s"] as const;

export type CardColor = (typeof COLORS)[number];
export type CardNumber = (typeof NUMBERS)[number];
export type CardFill = (typeof FILLS)[number];
export type CardShape = (typeof SHAPES)[number];

export type SettCard =
  `${(typeof COLORS)[number]}${(typeof NUMBERS)[number]}${(typeof FILLS)[number]}${(typeof SHAPES)[number]}`;
