/**
 * @jest-environment jsdom
 */

import { get } from "svelte/store";
import { boardStore } from "../stores";
import { getPossibilities } from "./possibilities";

it("returns moves when possible", async () => {
  expect(getPossibilities(get(boardStore), { line: 0, col: 0 })).toEqual([]);
  expect(getPossibilities(get(boardStore), { line: 2, col: 0 })).toEqual([
    {
      line: 3,
      col: 1,
    },
  ]);
  expect(getPossibilities(get(boardStore), { line: 2, col: 8 })).toEqual([
    {
      line: 3,
      col: 7,
    },
    {
      line: 3,
      col: 9,
    },
  ]);
  expect(getPossibilities(get(boardStore), { line: 7, col: 7 })).toEqual([
    {
      line: 6,
      col: 6,
    },
    {
      line: 6,
      col: 8,
    },
  ]);
});

it("handles takes when possible", async () => {
  boardStore.movePiece(2, 0, 6, 0);
  expect(getPossibilities(get(boardStore), { line: 7, col: 1 })).toEqual([
    {
      line: 6,
      col: 2,
    },
  ]);
  boardStore.movePiece(2, 2, 6, 2);
  expect(getPossibilities(get(boardStore), { line: 7, col: 1 })).toEqual([
    {
      line: 5,
      col: 3,
    },
  ]);
  expect(getPossibilities(get(boardStore), { line: 6, col: 2 })).toEqual([]);
  boardStore.movePiece(2, 4, 5, 3);
  expect(getPossibilities(get(boardStore), { line: 7, col: 1 })).toEqual([]);
  boardStore.movePiece(7, 1, 4, 2);
  expect(getPossibilities(get(boardStore), { line: 5, col: 3 })).toEqual([
    {
      col: 4,
      line: 6,
    },
    {
      col: 1,
      line: 3,
    },
  ]);
});
