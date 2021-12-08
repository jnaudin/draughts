<script lang="ts">
  import { currentPlayerStore, boardStore, BoardType } from "../stores";
  import { getSize } from "../helpers/utils";

  let currentPlayer: "black" | "white";
  let board: BoardType;

  currentPlayerStore.subscribe((value) => {
    currentPlayer = value;
  });

  boardStore.subscribe((value) => {
    board = value;
  });

  let lines: string[][];
  const initLines = (isSmall: boolean) => {
    lines = new Array(getSize(isSmall))
      .fill(0)
      .map((_val, lineIndex) =>
        new Array(getSize(isSmall))
          .fill("")
          .map((_val, index) => ((index + lineIndex) % 2 ? "black" : "white"))
      );
  };

  initLines(false);
</script>

<table>
  {#each board as boxes, i}
    <tr>
      {#each boxes as box, j}
        <td class={box.background}>
          {#if box?.piece}
            <div class={`pawn pawn-${box.piece.color}`} />
          {/if}</td
        >
      {/each}
    </tr>
  {/each}
</table>

<style>
  table {
    margin: auto;
  }

  .lightgray {
    background-color: lightgrey;
  }

  .current-red.lightgray:hover {
    background-color: lightsalmon;
  }
  .current-blue.lightgray:hover {
    background-color: lightskyblue;
  }

  .white {
    background-color: white;
  }
  .black {
    background-color: black;
  }

  td {
    width: 4rem;
    min-width: 4rem;
    height: 4rem;
    min-height: 4rem;
  }

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
