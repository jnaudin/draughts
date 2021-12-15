<script lang="ts">
  import { boardStore } from "../../stores/stores";
  import Box from "../Box/Box.svelte";
</script>

<table>
  {#each $boardStore as boxes, line}
    <tr>
      {#each boxes as box, col}
        <td data-testid="box-container" class={box.background}>
          <Box {line} {col} />
        </td>
      {/each}
    </tr>
  {/each}
</table>

<style>
  table {
    margin: auto;
    border: solid black 30px;
    border-radius: 10px;
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
