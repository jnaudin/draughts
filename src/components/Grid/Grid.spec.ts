/**
 * @jest-environment jsdom
 */

import Grid from "./Grid.svelte";
import { render } from "@testing-library/svelte";
import { boardStore } from "../../stores/stores";

beforeEach(() => {
  boardStore.reset();
});

it("displays 50 of each color", async () => {
  const { getAllByTestId } = render(Grid);

  const boxes = getAllByTestId("box-container");
  boxes.forEach((box) => expect(box.className).toMatch(/white|black/));
  expect(boxes.filter((box) => box.className.includes("white"))).toHaveLength(
    50
  );
  expect(boxes.filter((box) => box.className.includes("black"))).toHaveLength(
    50
  );
});
