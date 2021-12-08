export type CoordType = {
  line: number;
  col: number;
};

export type CellType = {
  background: string;
  piece?: { color: string; type: string };
};
