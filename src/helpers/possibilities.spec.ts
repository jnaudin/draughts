/**
 * @jest-environment jsdom
 */

import { get } from "svelte/store";
import { boardStore } from "../stores";
import { getPossibilities } from "./possibilities";

beforeEach(() => boardStore.reset());

it("returns moves when possible", async () => {
  expect(getPossibilities({ line: 0, col: 0 })).toEqual([]);
  expect(getPossibilities({ line: 2, col: 0 })).toEqual([
    {
      coord: {
        line: 3,
        col: 1,
      },
      type: "move",
    },
  ]);
  expect(getPossibilities({ line: 2, col: 8 })).toEqual([
    {
      coord: {
        line: 3,
        col: 7,
      },
      type: "move",
    },
    {
      coord: {
        line: 3,
        col: 9,
      },
      type: "move",
    },
  ]);
  expect(getPossibilities({ line: 7, col: 7 })).toEqual([
    {
      coord: {
        line: 6,
        col: 6,
      },
      type: "move",
    },
    {
      coord: {
        line: 6,
        col: 8,
      },
      type: "move",
    },
  ]);
});

it("handles takes when possible", async () => {
  boardStore.movePiece(2, 0, 6, 0);
  expect(getPossibilities({ line: 7, col: 1 })).toEqual([
    {
      coord: {
        line: 6,
        col: 2,
      },
      type: "move",
    },
  ]);
  boardStore.movePiece(2, 2, 6, 2);
  expect(getPossibilities({ line: 7, col: 1 })).toEqual([
    {
      coord: {
        line: 5,
        col: 3,
      },
      type: "take",
      takeCoord: {
        line: 6,
        col: 2,
      },
    },
  ]);
  expect(getPossibilities({ line: 6, col: 2 })).toEqual([]);
  boardStore.movePiece(2, 4, 5, 3);
  expect(getPossibilities({ line: 7, col: 1 })).toEqual([]);
  boardStore.movePiece(7, 1, 4, 2);
  expect(getPossibilities({ line: 5, col: 3 })).toEqual([
    {
      coord: {
        line: 6,
        col: 4,
      },
      type: "move",
    },
    {
      coord: {
        line: 3,
        col: 1,
      },
      type: "take",
      takeCoord: {
        line: 4,
        col: 2,
      },
    },
  ]);
});

it("calculates moves for the lady (forward)", async () => {
  boardStore.updateBox(7, 5, { color: "white", type: "lady" });
  boardStore.updateBox(5, 3, { color: "black", type: "lady" });
  expect(getPossibilities({ line: 7, col: 5 })).toEqual([
    {
      coord: {
        col: 4,
        line: 6,
      },
      type: "move",
    },
    {
      coord: {
        col: 6,
        line: 6,
      },
      type: "move",
    },
    {
      coord: {
        col: 7,
        line: 5,
      },
      type: "move",
    },
    {
      coord: {
        col: 8,
        line: 4,
      },
      type: "move",
    },
    {
      coord: {
        col: 9,
        line: 3,
      },
      type: "move",
    },
    {
      coord: {
        col: 2,
        line: 4,
      },
      type: "take",
      takeCoord: {
        line: 5,
        col: 3,
      },
    },
  ]);

  boardStore.updateBox(5, 3, { color: "white", type: "lady" });
  expect(getPossibilities({ line: 7, col: 5 })).toEqual([
    {
      coord: {
        col: 4,
        line: 6,
      },
      type: "move",
    },
    {
      coord: {
        col: 6,
        line: 6,
      },
      type: "move",
    },
    {
      coord: {
        col: 7,
        line: 5,
      },
      type: "move",
    },
    {
      coord: {
        col: 8,
        line: 4,
      },
      type: "move",
    },
    {
      coord: {
        col: 9,
        line: 3,
      },
      type: "move",
    },
  ]);
});

it("calculates moves for the lady (backward)", async () => {
  boardStore.updateBox(4, 4, { color: "white", type: "lady" });
  expect(getPossibilities({ line: 4, col: 4 })).toEqual([
    {
      coord: {
        col: 3,
        line: 3,
      },
      type: "move",
    },
    {
      coord: {
        col: 5,
        line: 3,
      },
      type: "move",
    },
    {
      coord: {
        col: 3,
        line: 5,
      },
      type: "move",
    },
    {
      coord: {
        col: 2,
        line: 6,
      },
      type: "move",
    },
    {
      coord: {
        col: 5,
        line: 5,
      },
      type: "move",
    },
    {
      coord: {
        col: 6,
        line: 6,
      },
      type: "move",
    },
  ]);
});
