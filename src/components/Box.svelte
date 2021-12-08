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

  let isSelected;
  $: isSelected = line === selectedPiece?.line && col === selectedPiece?.col;

  const handlePieceClick: () => void = () => {
    if (box.piece?.color === currentPlayer) {
      selectedPieceStore.set(isSelected ? undefined : { line, col });
    }
  };

  const handleBoxClick: () => void = () => {
    console.log(!box.piece, box.background === "black", !!selectedPiece);
    if (!box.piece && box.background === "black" && selectedPiece) {
      console.log(selectedPiece.line, selectedPiece.col, line, col)
      boardStore.movePiece(selectedPiece.line, selectedPiece.col, line, col);
      selectedPieceStore.set(undefined);
    }
  };

  let box;
  $: box = board[line][col];
</script>

<div class={"box"} on:click={() => handleBoxClick()}>
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

  .pawn-selected {
    background-color: purple;
  }
</style>
