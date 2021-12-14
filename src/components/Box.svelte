<script lang="ts">
  import { getPossibilities } from "../helpers/possibilities";

  import {
    currentPlayerStore,
    boardStore,
    selectedPieceStore,
    possibilitiesStore,
    isAdditionalMoveStore,
  } from "../stores";

  import type { CellType, CoordType, PossibilityType } from "../types";

  export let line: number;
  export let col: number;

  let currentPlayer: "black" | "white";
  let board: CellType[][];
  let selectedPiece: CoordType;
  let possibilities: PossibilityType[];
  let isAdditionalMove: boolean;

  currentPlayerStore.subscribe((value) => {
    currentPlayer = value;
  });

  boardStore.subscribe((value) => {
    board = value;
  });

  selectedPieceStore.subscribe((value) => {
    selectedPiece = value;
  });

  possibilitiesStore.subscribe((value) => {
    possibilities = value;
  });

  isAdditionalMoveStore.subscribe((value) => {
    isAdditionalMove = value;
  });

  let isSelected;
  $: isSelected = line === selectedPiece?.line && col === selectedPiece?.col;

  let box: CellType;
  $: box = board[line][col];

  const handlePieceClick: () => void = () => {
    if (!isAdditionalMove && box.piece?.color === currentPlayer) {
      if (isSelected) possibilitiesStore.set(undefined);
      selectedPieceStore.set(isSelected ? undefined : { line, col });
      possibilitiesStore.set(getPossibilities(selectedPiece));
    }
  };

  const handleBoxClick: () => void = () => {
    const possibility = possibilities?.find(
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
      if (!isAdditionalMove) {
        selectedPieceStore.set(undefined);
        currentPlayerStore.change();
        possibilitiesStore.set(undefined);
      }
    }
  };

  let isPossibility;
  $: isPossibility = !!possibilities?.find(
    (p) => p.coord.line === line && p.coord.col === col
  );
</script>

<div
  data-testid={`box-${line}-${col}`}
  class={`box${isPossibility ? " possible" : ""}`}
  on:click={() => handleBoxClick()}
>
  {#if box.piece}
    <div
      data-testid={`piece-${line}-${col}`}
      class={`${box.piece.type} piece-${
        isSelected ? "selected" : box.piece.color
      }`}
      on:click={() => handlePieceClick()}
    />
  {/if}
</div>

<style>
  .box {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pawn {
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    border-radius: 1.5rem;
    border: 3px solid grey;
  }

  .lady {
    width: 3.5rem;
    min-width: 3.5rem;
    height: 3.5rem;
    min-height: 3.5rem;
    border-radius: 2rem;
    border: 1px solid grey;
  }

  .piece-white {
    background-color: navajowhite;
  }

  .piece-black {
    background-color: brown;
  }

  .piece-selected {
    background-color: purple;
  }
  .possible {
    width: 2.5rem;
    min-width: 2.5rem;
    height: 2.5rem;
    min-height: 2.5rem;
    border-radius: 1.25rem;
    border: 3px dashed salmon;
    margin: auto;
  }
</style>
