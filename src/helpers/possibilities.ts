import { get } from "svelte/store";
import { boardStore, selectedPieceStore } from "../stores";
import type { CoordType, PossibilityType } from "../types";
import { invertColor } from "./utils";

const BACKWARD = true;

export const getPossibilities = (
  selectedPiece: CoordType,
  isAdditionalMove: boolean = false
): PossibilityType[] => {
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
    moves: PossibilityType[] = [],
    currentLine: number = line,
    currentCol: number = col,
    firstCall: boolean = true
  ): PossibilityType[] => {
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
      [
        ...moves,
        { coord: { line: nextMoveLine, col: nextMoveCol }, type: "move" },
      ],
      nextMoveLine,
      nextMoveCol,
      false
    );
  };

  const take = (
    lineDirection: "up" | "down",
    colDirection: "left" | "right",
    currentLine: number = line,
    currentCol: number = col,
    firstCall: boolean = true
  ): PossibilityType[] => {
    const takeLine = lineDirection === "up" ? currentLine - 1 : currentLine + 1;
    const takeCol = colDirection === "left" ? currentCol - 1 : currentCol + 1;
    const nextLine = lineDirection === "up" ? currentLine - 2 : currentLine + 2;
    const nextCol = colDirection === "left" ? currentCol - 2 : currentCol + 2;

    if (
      (!firstCall && !isLady) ||
      nextCol < 0 ||
      nextCol > 9 ||
      nextLine < 0 ||
      nextLine > 9
    )
      return [];

    if (
      board[takeLine][takeCol]?.piece?.color === oppositeColor &&
      !board[nextLine][nextCol].piece
    )
      return [
        {
          coord: { line: nextLine, col: nextCol },
          type: "take",
          takeCoord: { line: takeLine, col: takeCol },
        },
      ];

    return take(lineDirection, colDirection, takeLine, takeCol, false);
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
