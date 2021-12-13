export type CoordType = {
  line: number;
  col: number;
};

export type PossibilityType = {
  coord: CoordType;
  type: "take" | "move";
  takeCoord?: CoordType;
};

export type ColorType = "white" | "black";

export type CellType = {
  background: ColorType;
  piece?: { color: ColorType; type: "pawn" | "lady" };
};
