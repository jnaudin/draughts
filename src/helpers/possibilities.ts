import { get } from "svelte/store";
import { boardStore, selectedPieceStore } from "../stores";
import type { CoordType } from "../types";
import { invertColor } from "./utils";

const BACKWARD = true;

export const getPossibilities = (
  selectedPiece: CoordType,
  isAdditionalMove: boolean = false
): CoordType[] => {
  if (!selectedPiece) return [];

  const board = get(boardStore);

  const { line, col } = selectedPiece;
  const pieceToMove = board[line][col];
  if (!pieceToMove.piece) return [];

  const orientation = pieceToMove.piece.color === "black" ? 1 : -1;
  const oppositeColor = invertColor(pieceToMove.piece.color);
  const isLady = pieceToMove.piece.type === "lady";

  const move = (
    direction: "left" | "right",
    backward: boolean = false,
    moves: CoordType[] = [],
    currentLine: number = line,
    currentCol: number = col,
    firstCall: boolean = true
  ) => {
    const nextMoveLine = backward
      ? currentLine - orientation
      : currentLine + orientation;
    const nextMoveCol = direction === "left" ? currentCol - 1 : currentCol + 1;

    if (
      isAdditionalMove ||
      (backward && !isLady) ||
      (!firstCall && !isLady) ||
      nextMoveLine < 0 ||
      nextMoveLine > 9 ||
      nextMoveCol < 0 ||
      nextMoveCol > 9 ||
      !!board[nextMoveLine][nextMoveCol].piece
    )
      return moves;

    return move(
      direction,
      backward,
      [...moves, { line: nextMoveLine, col: nextMoveCol }],
      nextMoveLine,
      nextMoveCol,
      false
    );
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
    ...move("left", BACKWARD),
    ...move("right", BACKWARD),
    ...take("down", "left"),
    ...take("down", "right"),
    ...take("up", "left"),
    ...take("up", "right"),
  ];
};
