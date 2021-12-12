/**
 * @jest-environment jsdom
 */

import { get } from "svelte/store";
import { boardStore, currentPlayerStore } from "./stores";

beforeEach(() => {
  boardStore.reset();
});

it("changes correct current player", async () => {
  expect(get(currentPlayerStore)).toEqual("white");
  currentPlayerStore.change();
  expect(get(currentPlayerStore)).toEqual("black");
  currentPlayerStore.change();
  expect(get(currentPlayerStore)).toEqual("white");
});

it("resets board", async () => {
  const initialBoard = get(boardStore);
  boardStore.removePiece(1, 3);
  expect(get(boardStore)).not.toEqual(initialBoard);
  boardStore.reset();
  expect(get(boardStore)).toEqual(initialBoard);
});

it("removes piece", async () => {
  expect(get(boardStore)[1][3]).toEqual({
    background: "black",
    piece: {
      color: "black",
      type: "pawn",
    },
  });
  boardStore.removePiece(1, 3);
  expect(get(boardStore)[1][3]).toEqual({
    background: "black",
    piece: undefined,
  });
});

it("moves piece", async () => {
  expect(get(boardStore)[2][2]).toEqual({
    background: "black",
    piece: {
      color: "black",
      type: "pawn",
    },
  });
  expect(get(boardStore)[3][3]).toEqual({
    background: "black",
    piece: undefined,
  });
  boardStore.movePiece(2, 2, 3, 3);
  expect(get(boardStore)[2][2]).toEqual({
    background: "black",
    piece: undefined,
  });
  expect(get(boardStore)[3][3]).toEqual({
    background: "black",
    piece: {
      color: "black",
      type: "pawn",
    },
  });
});
