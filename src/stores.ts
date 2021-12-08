import { Writable, writable } from "svelte/store";
import { getSize } from "./helpers/utils";

const createCurrentPlayer = () => {
  const { subscribe, set, update }: Writable<"black" | "white"> =
    writable("white");
  const change = () =>
    update((player) => (player === "black" ? "white" : "black"));

  return {
    subscribe,
    set,
    update,
    change,
  };
};

export const currentPlayerStore = createCurrentPlayer();

export type CoordType = {
  line: number;
  col: number;
};

export const selectedPieceStore: Writable<CoordType | undefined> =
  writable(undefined);

export type BoardType = {
  background: string;
  piece?: { color: string; type: string };
}[][];

const getInitialBoard = () =>
  new Array(getSize(false)).fill(0).map((_val, lineIndex) =>
    new Array(getSize(false)).fill(undefined).map((_val, index) => {
      if ((index + lineIndex) % 2) return { background: "white" };
      if (lineIndex < 3)
        return {
          background: "black",
          piece: { color: "black", type: "pawn" },
        };
      if (lineIndex > 6)
        return {
          background: "black",
          piece: { color: "white", type: "pawn" },
        };
      return { background: "black" };
    })
  );

const createBoard = () => {
  const { subscribe, set, update } = writable(getInitialBoard());
  const reset = () => set(getInitialBoard());
  const movePiece = (x, y, newX, newY) =>
    update((board) => {
      const color = board[x][y];

      return board.map((line, lineIndex) => {
        if (lineIndex === x)
          return line.map((column, columnIndex) =>
            columnIndex === y ? { ...column, piece: undefined } : column
          );
        if (lineIndex === newX)
          return line.map((column, columnIndex) =>
            columnIndex === newY ? color : column
          );
        return line;
      });
    });

  return {
    subscribe,
    set,
    update,
    movePiece,
    reset,
  };
};

export const boardStore = createBoard();
