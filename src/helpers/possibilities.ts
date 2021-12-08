import type { CellType, CoordType } from "../types";

export const getPossibilities = (
  board: CellType[][],
  selectedPiece: CoordType,
  isAdditionalMove: boolean = false
): CoordType[] => {
  if (!selectedPiece) return [];

  const { line, col } = selectedPiece;
  const pieceToMove = board[line][col];
  const direction = pieceToMove.piece.color === "black" ? 1 : -1;
  const oppositeColor = pieceToMove.piece.color === "black" ? "white" : "black";
  const nextMoveLine = line + direction;

  const leftMove =
    !isAdditionalMove &&
    nextMoveLine !== -1 &&
    nextMoveLine !== 10 &&
    col > 0 &&
    !board[nextMoveLine][col - 1].piece
      ? [{ line: nextMoveLine, col: col - 1 }]
      : [];
  const rightMove =
    !isAdditionalMove &&
    nextMoveLine !== -1 &&
    nextMoveLine !== 10 &&
    col < 9 &&
    !board[nextMoveLine][col + 1].piece
      ? [{ line: nextMoveLine, col: col + 1 }]
      : [];

  const take = (
    lineDirection: "up" | "down",
    colDirection: "left" | "right"
  ) => {
    const takeLine = lineDirection === "up" ? line - 1 : line + 1;
    const takeCol = colDirection === "left" ? col - 1 : col + 1;
    const nextLine = lineDirection === "up" ? line - 2 : line + 2;
    const nextCol = colDirection === "left" ? col - 2 : col + 2;
    if (
      (colDirection === "left" && col < 2) ||
      (colDirection === "right" && col > 7) ||
      (lineDirection === "up" && line < 2) ||
      (lineDirection === "down" && line > 7) ||
      board[takeLine][takeCol]?.piece?.color !== oppositeColor ||
      board[nextLine][nextCol].piece
    )
      return [];
    return [{ line: nextLine, col: nextCol }];
  };

  return [
    ...leftMove,
    ...rightMove,
    ...take("down", "left"),
    ...take("down", "right"),
    ...take("up", "left"),
    ...take("up", "right"),
  ];
};
