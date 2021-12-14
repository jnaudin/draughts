import { get } from "svelte/store";
import { getPossibilities } from "../../helpers/possibilities";
import {
  boardStore,
  currentPlayerStore,
  isAdditionalMoveStore,
  possibilitiesStore,
  selectedPieceStore,
} from "../../stores/stores";
import type { CoordType } from "../../types";

export const handlePieceClick = (line: number, col: number) => {
  // selected piece needs to be reactive
  let selectedPiece: CoordType;
  selectedPieceStore.subscribe((value) => {
    selectedPiece = value;
  });
  const isSelected = line === selectedPiece?.line && col === selectedPiece?.col;
  const isCurrentPlayerColor =
    get(boardStore)[line][col].piece?.color === get(currentPlayerStore);

  if (!get(isAdditionalMoveStore) && isCurrentPlayerColor) {
    if (isSelected) possibilitiesStore.set(undefined);
    selectedPieceStore.set(isSelected ? undefined : { line, col });
    possibilitiesStore.set(getPossibilities(selectedPiece));
  }
};

export const handleBoxClick = (line: number, col: number) => {
  const selectedPiece = get(selectedPieceStore);
  const currentPlayer = get(currentPlayerStore);
  const possibility = get(possibilitiesStore)?.find(
    (p) => p.coord.line === line && p.coord.col === col
  );

  if (selectedPiece && possibility) {
    isAdditionalMoveStore.set(false);
    boardStore.movePiece(selectedPiece.line, selectedPiece.col, line, col);
    if (
      (line === 0 && currentPlayer === "white") ||
      (line === 9 && currentPlayer === "black")
    )
      boardStore.setPieceType(line, col, "lady");

    if (possibility.type === "take") {
      boardStore.removePiece(
        possibility.takeCoord.line,
        possibility.takeCoord.col
      );
      const newPossibilities = getPossibilities({ line, col }, true);
      if (newPossibilities.length) {
        isAdditionalMoveStore.set(true);
        selectedPieceStore.set({ line, col });
        possibilitiesStore.set(newPossibilities);
      }
    }

    if (!get(isAdditionalMoveStore)) {
      selectedPieceStore.set(undefined);
      currentPlayerStore.change();
      possibilitiesStore.set(undefined);
    }
  }
};
