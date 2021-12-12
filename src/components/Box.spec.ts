/**
 * @jest-environment jsdom
 */

import Box from "./Box.svelte";
import { render, fireEvent } from "@testing-library/svelte";
import { boardStore, currentPlayerStore, possibilitiesStore } from "../stores";
import { get } from "svelte/store";

beforeEach(() => {
  possibilitiesStore.set([]);
  boardStore.reset();
  currentPlayerStore.set("white");
});

it("selects pawn", async () => {
  const { getByTestId } = render(Box, { line: 7, col: 1 });

  const pawn = getByTestId("pawn-7-1");
  expect(pawn).toHaveClass("pawn-white");
  await fireEvent.click(pawn);

  expect(pawn).toHaveClass("pawn-selected");
  expect(get(possibilitiesStore)).toEqual([
    { line: 6, col: 0 },
    { line: 6, col: 2 },
  ]);
});

it("tries to select unavailable pawn", async () => {
  const { getByTestId } = render(Box, { line: 8, col: 4 });

  const pawn = getByTestId("pawn-8-4");
  expect(pawn).toHaveClass("pawn-white");
  await fireEvent.click(pawn);

  expect(pawn).toHaveClass("pawn-selected");
  expect(get(possibilitiesStore)).toEqual([]);
});

it("tries to select opponent's pawn", async () => {
  const { getByTestId } = render(Box, { line: 2, col: 2 });

  const pawn = getByTestId("pawn-2-2");
  expect(pawn).toHaveClass("pawn-black");
  await fireEvent.click(pawn);

  expect(pawn).not.toHaveClass("pawn-selected");
  expect(get(possibilitiesStore)).toEqual([]);
});

it("displays next move", async () => {
  possibilitiesStore.set([{ line: 5, col: 5 }]);

  const { getByTestId } = render(Box, { line: 5, col: 5 });
  const box = getByTestId("box-5-5");

  expect(box).toHaveClass("possible");
});

it("hides next move", async () => {
  possibilitiesStore.set([{ line: 5, col: 1 }]);

  const { getByTestId } = render(Box, { line: 5, col: 3 });
  const box = getByTestId("box-5-3");
  // const pawn = getByTestId("pawn");

  expect(box).not.toHaveClass("possible");
});

it("selects box", async () => {
  const fromBox = render(Box, { line: 7, col: 1 });
  const toBox = render(Box, { line: 6, col: 2 });

  const fromPawn = fromBox.getByTestId("pawn-7-1");
  expect(fromPawn).toHaveClass("pawn-white");
  await fireEvent.click(fromPawn);
  expect(fromPawn).toHaveClass("pawn-selected");
  expect(get(possibilitiesStore)).toHaveLength(2);
  expect(
    get(possibilitiesStore).find((p) => p.line === 6 && p.col === 2)
  ).toBeDefined();
  expect(
    get(possibilitiesStore).find((p) => p.line === 6 && p.col === 0)
  ).toBeDefined();

  expect(toBox.queryByTestId("pawn-6-2")).not.toBeInTheDocument();
  const toContainer = toBox.getByTestId("box-6-2");
  await fireEvent.click(toContainer);
  expect(toBox.queryByTestId("pawn-6-2")).toBeInTheDocument();
  expect(fromBox.queryByTestId("pawn-7-1")).not.toBeInTheDocument();

  expect(get(currentPlayerStore)).toEqual("black");
});

it("selects box with a remaining piece to take", async () => {
  boardStore.movePiece(2, 0, 6, 4);
  boardStore.movePiece(2, 2, 4, 4);

  const fromBox = render(Box, { line: 7, col: 3 });
  const toBox = render(Box, { line: 5, col: 5 });
  const lastBox = render(Box, { line: 3, col: 3 });

  const fromPawn = fromBox.getByTestId("pawn-7-3");
  expect(fromPawn).toHaveClass("pawn-white");
  await fireEvent.click(fromPawn);
  expect(fromPawn).toHaveClass("pawn-selected");
  expect(get(possibilitiesStore)).toHaveLength(2);
  expect(
    get(possibilitiesStore).find((p) => p.line === 6 && p.col === 2)
  ).toBeDefined();
  expect(
    get(possibilitiesStore).find((p) => p.line === 5 && p.col === 5)
  ).toBeDefined();

  expect(toBox.queryByTestId("pawn-5-5")).not.toBeInTheDocument();
  const toContainer = toBox.getByTestId("box-5-5");
  await fireEvent.click(toContainer);
  expect(toBox.queryByTestId("pawn-5-5")).toBeInTheDocument();
  expect(fromBox.queryByTestId("pawn-7-3")).not.toBeInTheDocument();
  expect(get(currentPlayerStore)).not.toEqual("black");

  expect(get(possibilitiesStore)).toHaveLength(1);
  expect(
    get(possibilitiesStore).find((p) => p.line === 3 && p.col === 3)
  ).toBeDefined();
  const lastContainer = toBox.getByTestId("box-3-3");
  await fireEvent.click(lastContainer);
  expect(lastBox.queryByTestId("pawn-3-3")).toBeInTheDocument();
  expect(toBox.queryByTestId("pawn-5-5")).not.toBeInTheDocument();
  expect(get(currentPlayerStore)).toEqual("black");
});
