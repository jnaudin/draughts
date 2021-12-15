/**
 * @jest-environment jsdom
 */

import Instructions from "./Instructions.svelte";
import { render, waitFor } from "@testing-library/svelte";
import { currentPlayerStore } from "../../stores/stores";

it("displays white", async () => {
  const { queryByText } = render(Instructions);
  expect(queryByText(/noir/)).toBeNull();
  expect(queryByText(/blanc/)).toBeInTheDocument();
  currentPlayerStore.change();
  await waitFor(() => expect(queryByText(/blanc/)).toBeNull());
  await waitFor(() => expect(queryByText(/noir/)).toBeInTheDocument());
});
