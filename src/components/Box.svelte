<script lang="ts">
  import {
    currentPlayerStore,
    boardStore,
    BoardType,
    selectedPieceStore,
    CoordType,
  } from "../stores";

  export let line: number;
  export let col: number;

  let currentPlayer: "black" | "white";
  let board: BoardType;
  let selectedPiece: CoordType;

  currentPlayerStore.subscribe((value) => {
    currentPlayer = value;
  });

  boardStore.subscribe((value) => {
    board = value;
  });

  selectedPieceStore.subscribe((value) => {
    selectedPiece = value;
  });

  const handleClick: () => void = () => {
    if (box.piece?.color === currentPlayer)
      selectedPieceStore.set({ line, col });
  };

  const box = board[line][col];
</script>

{#if box.piece}
  <div class={`pawn pawn-${box.piece.color}`} on:click={() => handleClick()} />
{/if}

<style>
  .pawn {
    margin: auto;
    width: 3rem;
    min-width: 3rem;
    height: 3rem;
    min-height: 3rem;
    border-radius: 1.5rem;
  }

  .pawn-white {
    background-color: navajowhite;
  }

  .pawn-black {
    background-color: #391939;
    border: 1px solid grey;
  }
</style>
