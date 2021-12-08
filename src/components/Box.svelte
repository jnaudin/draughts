<script lang="ts">
  import { getPossibilities } from "../helpers/possibilities";

  import {
    currentPlayerStore,
    boardStore,
    selectedPieceStore,
    possibilitiesStore,
  } from "../stores";
  import { CellType, CoordType } from "../types";

  export let line: number;
  export let col: number;

  let currentPlayer: "black" | "white";
  let board: CellType[][];
  let selectedPiece: CoordType;
  let possibilities: CoordType[];

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

  let isSelected;
  $: isSelected = line === selectedPiece?.line && col === selectedPiece?.col;

  const handlePieceClick: () => void = () => {
    if (box.piece?.color === currentPlayer) {
      if (isSelected) possibilitiesStore.set(undefined);
      selectedPieceStore.set(isSelected ? undefined : { line, col });
      possibilitiesStore.set(getPossibilities(board, selectedPiece));
    }
  };

  const handleBoxClick: () => void = () => {
    if (
      selectedPiece &&
      possibilities?.find((p) => p.line === line && p.col === col)
    ) {
      boardStore.movePiece(selectedPiece.line, selectedPiece.col, line, col);
      if (Math.abs((line - selectedPiece.line) / 2) === 1)
        boardStore.removePiece(
          (selectedPiece.line + line) / 2,
          (selectedPiece.col + col) / 2
        );
      selectedPieceStore.set(undefined);
      currentPlayerStore.change();
      possibilitiesStore.set(undefined);
    }
  };

  let box: CellType;
  $: box = board[line][col];
  let isPossibility;
  $: isPossibility = !!possibilities?.find(
    (p) => p.line === line && p.col === col
  );
</script>

<div
  class={`box${isPossibility ? " possible" : ""}`}
  on:click={() => handleBoxClick()}
>
  {#if box.piece}
    <div
      class={`pawn pawn-${isSelected ? "selected" : box.piece.color}`}
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
    border-radius: 1.25rem;
    border: 1px solid grey;
  }

  .pawn-white {
    background-color: navajowhite;
  }

  .pawn-black {
    background-color: brown;
  }

  .pawn-selected {
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
