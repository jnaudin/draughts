/**
 * @jest-environment jsdom
 */

import Grid from "./Grid.svelte";
import { render } from "@testing-library/svelte";
import { boardStore } from "../../stores/stores";

beforeEach(() => {
  boardStore.reset();
});

it("alternates black and white", async () => {
  const { getAllByTestId } = render(Grid);

  const boxes = getAllByTestId("box-container");
  boxes.forEach((box, index) =>
    expect(box).toHaveClass(
      (index + (Math.floor(index / 10) % 2)) % 2 ? "white" : "black"
    )
  );
});
