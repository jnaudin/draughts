<script lang="ts">
  import { boardStore } from "../stores";
  import type { CellType } from "../types";
  import Box from "./Box.svelte";

  let board: CellType[][];

  boardStore.subscribe((value) => {
    board = value;
  });
</script>

<table>
  {#each board as boxes, line}
    <tr>
      {#each boxes as box, col}
        <td class={box.background}>
          <Box {line} {col} />
        </td>
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
</style>
