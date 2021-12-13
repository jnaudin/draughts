export type CoordType = {
  line: number;
  col: number;
};

export type ColorType = "white" | "black";

export type CellType = {
  background: ColorType;
  piece?: { color: ColorType; type: "pawn" | "lady" };
};
