import type { CellType, CoordType } from "../types";

export const getPossibilities = (
  board: CellType[][],
  selectedPiece: CoordType
): CoordType[] => {
  const { line, col } = selectedPiece;
  const pieceToMove = board[line][col];
  const direction = pieceToMove.piece.color === "black" ? 1 : -1;

  return [
    { line: line + direction, col: col - 1 },
    { line: line + direction, col: col + 1 },
  ];
};
