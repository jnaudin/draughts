import type { CellType, CoordType } from "../types";

export const getPossibilities = (
  board: CellType[][],
  selectedPiece: CoordType
): CoordType[] => {
  if (!selectedPiece) return [];

  const { line, col } = selectedPiece;
  const pieceToMove = board[line][col];
  const direction = pieceToMove.piece.color === "black" ? 1 : -1;
  const oppositeColor = pieceToMove.piece.color === "black" ? "white" : "black";
  const nextMoveLine = line + direction;

  const leftMove =
    nextMoveLine !== -1 &&
    nextMoveLine !== 10 &&
    col > 0 &&
    !board[nextMoveLine][col - 1].piece
      ? [{ line: nextMoveLine, col: col - 1 }]
      : [];
  const rightMove =
    nextMoveLine !== -1 &&
    nextMoveLine !== 10 &&
    col < 9 &&
    !board[nextMoveLine][col + 1].piece
      ? [{ line: nextMoveLine, col: col + 1 }]
      : [];

  const topLeftTake =
    col > 1 &&
    line > 1 &&
    board[line - 1][col - 1]?.piece?.color === oppositeColor &&
    !board[line - 2][col - 2].piece
      ? [{ line: line - 2, col: col - 2 }]
      : [];
  const topRightTake =
    col < 8 &&
    line > 1 &&
    board[line - 1][col + 1]?.piece?.color === oppositeColor &&
    !board[line - 2][col + 2].piece
      ? [{ line: line - 2, col: col + 2 }]
      : [];
  const bottomLeftTake =
    col > 1 &&
    line < 8 &&
    board[line + 1][col - 1]?.piece?.color === oppositeColor &&
    !board[line + 2][col - 2].piece
      ? [{ line: line + 2, col: col - 2 }]
      : [];
  const bottomRightTake =
    col < 8 &&
    line < 8 &&
    board[line + 1][col + 1]?.piece?.color === oppositeColor &&
    !board[line + 2][col + 2].piece
      ? [{ line: line + 2, col: col + 2 }]
      : [];

  return [
    ...leftMove,
    ...rightMove,
    ...topLeftTake,
    ...topRightTake,
    ...bottomLeftTake,
    ...bottomRightTake,
  ];
};
