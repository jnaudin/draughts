import type { CellType, CoordType } from "../types";

export const getPossibilities = (
  board: CellType[][],
  selectedPiece: CoordType,
  isAdditionalMove: boolean = false
): CoordType[] => {
  if (!selectedPiece) return [];

  const { line, col } = selectedPiece;
  const pieceToMove = board[line][col];
  if (!pieceToMove.piece) return [];

  const direction = pieceToMove.piece.color === "black" ? 1 : -1;
  const oppositeColor = pieceToMove.piece.color === "black" ? "white" : "black";
  const nextMoveLine = line + direction;

  const move = (direction: "left" | "right") => {
    const nextMoveCol = direction == "left" ? col - 1 : col + 1;

    return isAdditionalMove ||
      nextMoveLine < 0 ||
      nextMoveLine > 9 ||
      nextMoveCol < 0 ||
      nextMoveCol > 9 ||
      !!board[nextMoveLine][nextMoveCol].piece
      ? []
      : [{ line: nextMoveLine, col: nextMoveCol }];
  };

  const take = (
    lineDirection: "up" | "down",
    colDirection: "left" | "right"
  ) => {
    const takeLine = lineDirection === "up" ? line - 1 : line + 1;
    const takeCol = colDirection === "left" ? col - 1 : col + 1;
    const nextLine = lineDirection === "up" ? line - 2 : line + 2;
    const nextCol = colDirection === "left" ? col - 2 : col + 2;

    return nextCol < 0 ||
      nextCol > 9 ||
      nextLine < 0 ||
      nextLine > 9 ||
      board[takeLine][takeCol]?.piece?.color !== oppositeColor ||
      board[nextLine][nextCol].piece
      ? []
      : [{ line: nextLine, col: nextCol }];
  };
  return [
    ...move("left"),
    ...move("right"),
    ...take("down", "left"),
    ...take("down", "right"),
    ...take("up", "left"),
    ...take("up", "right"),
  ];
};
