import type { CellType, CoordType } from "../types";

export const getPossibilities = (
  board: CellType[][],
  selectedPiece: CoordType
): CoordType[] => {
  const { line, col } = selectedPiece;
  const pieceToMove = board[line][col];
  const direction = pieceToMove.piece.color === "black" ? 1 : -1;

  const leftMove =
    col > 0 && !!board[line + direction][col - 1].piece
      ? []
      : [{ line: line + direction, col: col - 1 }];
  const rightMove =
    col < 7 && !!board[line + direction][col + 1].piece
      ? []
      : [{ line: line + direction, col: col + 1 }];

  return [...leftMove, ...rightMove];
};
