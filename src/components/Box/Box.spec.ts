/**
 * @jest-environment jsdom
 */

import Box from "./Box.svelte";
import { render, fireEvent, waitFor } from "@testing-library/svelte";
import {
  boardStore,
  currentPlayerStore,
  possibilitiesStore,
} from "../../stores/stores";
import { get } from "svelte/store";

describe("Each boxes", () => {
  beforeEach(() => {
    possibilitiesStore.set([]);
    boardStore.reset();
    currentPlayerStore.set("white");
  });

  render(Box, { line: 0, col: 0 });
  render(Box, { line: 1, col: 1 });
  render(Box, { line: 2, col: 2 });
  render(Box, { line: 3, col: 3 });
  render(Box, { line: 4, col: 8 });
  render(Box, { line: 5, col: 3 });
  render(Box, { line: 5, col: 5 });
  render(Box, { line: 5, col: 7 });
  render(Box, { line: 6, col: 2 });
  render(Box, { line: 7, col: 1 });
  render(Box, { line: 7, col: 3 });
  render(Box, { line: 7, col: 5 });
  render(Box, { line: 7, col: 7 });
  render(Box, { line: 7, col: 9 });
  render(Box, { line: 8, col: 4 });
  render(Box, { line: 8, col: 6 });
  render(Box, { line: 9, col: 5 });
  const { getByTestId, queryByTestId } = render(Box, { line: 9, col: 5 });

  it("selects pawn", async () => {
    const pawn = getByTestId("piece-7-1");
    expect(pawn).toHaveClass("piece-white");
    await fireEvent.click(pawn);

    expect(pawn).toHaveClass("piece-selected");
    expect(get(possibilitiesStore)).toEqual([
      { coord: { line: 6, col: 0 }, type: "move" },
      { coord: { line: 6, col: 2 }, type: "move" },
    ]);
  });

  it("tries to select unavailable pawn", async () => {
    const pawn = getByTestId("piece-8-4");
    expect(pawn).toHaveClass("piece-white");
    await fireEvent.click(pawn);

    expect(pawn).toHaveClass("piece-selected");
    expect(get(possibilitiesStore)).toEqual([]);
  });

  it("tries to select opponent's pawn", async () => {
    const pawn = getByTestId("piece-2-2");
    expect(pawn).toHaveClass("piece-black");
    await fireEvent.click(pawn);

    expect(pawn).not.toHaveClass("piece-selected");
    expect(get(possibilitiesStore)).toEqual([]);
  });

  it("displays next move", async () => {
    possibilitiesStore.set([{ coord: { line: 5, col: 5 }, type: "move" }]);

    const box = getByTestId("box-5-5");

    waitFor(() => expect(box).toHaveClass("possible"));
  });

  it("hides next move", async () => {
    possibilitiesStore.set([{ coord: { line: 5, col: 1 }, type: "move" }]);

    const box = getByTestId("box-5-3");
    // const pawn = getByTestId("pawn");

    expect(box).not.toHaveClass("possible");
  });

  it("selects box", async () => {
    const fromPawn = getByTestId("piece-7-1");
    expect(fromPawn).toHaveClass("piece-white");
    await fireEvent.click(fromPawn);
    expect(fromPawn).toHaveClass("piece-selected");
    expect(get(possibilitiesStore)).toHaveLength(2);
    expect(
      get(possibilitiesStore).find(
        (p) => p.coord.line === 6 && p.coord.col === 2
      )
    ).toBeDefined();
    expect(
      get(possibilitiesStore).find(
        (p) => p.coord.line === 6 && p.coord.col === 0
      )
    ).toBeDefined();

    expect(queryByTestId("piece-6-2")).not.toBeInTheDocument();
    const toContainer = getByTestId("box-6-2");
    await fireEvent.click(toContainer);
    expect(queryByTestId("piece-6-2")).toBeInTheDocument();
    expect(queryByTestId("piece-7-1")).not.toBeInTheDocument();

    expect(get(currentPlayerStore)).toEqual("black");
  });

  it("selects box with lady", async () => {
    boardStore.updateBox(7, 5, { color: "white", type: "lady" });
    boardStore.updateBox(5, 7, { color: "black", type: "pawn" });

    const fromPawn = getByTestId("piece-7-5");
    await fireEvent.click(fromPawn);
    expect(fromPawn).toHaveClass("piece-selected");
    expect(get(possibilitiesStore)).toHaveLength(6);

    const toContainer = getByTestId("box-4-8");
    await fireEvent.click(toContainer);
    expect(queryByTestId("piece-7-5")).not.toBeInTheDocument();
    expect(queryByTestId("piece-5-7")).not.toBeInTheDocument();
    const newLadyPiece = queryByTestId("piece-4-8");
    expect(newLadyPiece).toBeInTheDocument();
    expect(newLadyPiece).toHaveClass("lady");

    expect(get(currentPlayerStore)).toEqual("black");
  });

  it("selects box with a remaining piece to take", async () => {
    boardStore.movePiece(2, 0, 6, 4);
    boardStore.movePiece(2, 2, 4, 4);

    const fromPawn = getByTestId("piece-7-3");
    expect(fromPawn).toHaveClass("piece-white");
    await fireEvent.click(fromPawn);
    expect(fromPawn).toHaveClass("piece-selected");
    expect(get(possibilitiesStore)).toHaveLength(2);
    expect(
      get(possibilitiesStore).find(
        (p) => p.coord.line === 6 && p.coord.col === 2
      )
    ).toBeDefined();
    expect(
      get(possibilitiesStore).find(
        (p) => p.coord.line === 5 && p.coord.col === 5
      )
    ).toBeDefined();

    expect(queryByTestId("piece-5-5")).not.toBeInTheDocument();
    const toContainer = getByTestId("box-5-5");
    await fireEvent.click(toContainer);
    const movedPiece = queryByTestId("piece-5-5");
    expect(movedPiece).toBeInTheDocument();
    expect(queryByTestId("piece-7-3")).not.toBeInTheDocument();
    expect(get(currentPlayerStore)).not.toEqual("black");

    expect(get(possibilitiesStore)).toHaveLength(1);
    expect(
      get(possibilitiesStore).find(
        (p) => p.coord.line === 3 && p.coord.col === 3
      )
    ).toBeDefined();

    //can not select an other piece when it is an additional take
    const randomPiece = getByTestId("piece-7-9");
    expect(randomPiece).not.toHaveClass("piece-selected");
    await fireEvent.click(randomPiece);
    expect(randomPiece).not.toHaveClass("piece-selected");
    expect(movedPiece).toHaveClass("piece-selected");

    const lastContainer = getByTestId("box-3-3");
    await fireEvent.click(lastContainer);
    expect(queryByTestId("piece-3-3")).toBeInTheDocument();
    expect(movedPiece).not.toBeInTheDocument();
    expect(get(currentPlayerStore)).toEqual("black");
  });

  it("transforms pawn to lady", async () => {
    boardStore.updateBox(0, 0, undefined);
    boardStore.updateBox(1, 1, { color: "white", type: "pawn" });

    const pawnPiece = getByTestId("piece-1-1");
    const emptyBox = getByTestId("box-0-0");
    expect(queryByTestId("piece-1-1")).toBeInTheDocument();

    await fireEvent.click(pawnPiece);
    await fireEvent.click(emptyBox);

    const newPiece = getByTestId("piece-0-0");
    expect(newPiece).toHaveClass("lady");
  });

  it("doesn't transform pawn to lady when wrong color", async () => {
    boardStore.updateBox(9, 5, undefined);
    boardStore.updateBox(8, 6, { color: "black", type: "pawn" });
    boardStore.updateBox(7, 7, { color: "white", type: "pawn" });

    const whitePawnPiece = getByTestId("piece-7-7");
    await waitFor(() => expect(queryByTestId("box-9-5")).toBeInTheDocument());
    const emptyBox = getByTestId("box-9-5");
    expect(queryByTestId("piece-9-5")).not.toBeInTheDocument();
    expect(queryByTestId("piece-8-6")).toBeInTheDocument();
    expect(queryByTestId("piece-7-7")).toBeInTheDocument();

    await fireEvent.click(whitePawnPiece);
    await fireEvent.click(emptyBox);

    expect(queryByTestId("piece-9-5")).toBeInTheDocument();
    expect(queryByTestId("piece-8-6")).not.toBeInTheDocument();
    expect(queryByTestId("piece-7-7")).not.toBeInTheDocument();

    const newPiece = getByTestId("piece-9-5");
    expect(newPiece).toHaveClass("pawn");
  });
});
