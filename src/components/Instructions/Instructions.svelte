<script lang="ts">
  import { currentPlayerStore } from "../../stores/stores";
</script>

<div class={`text ${$currentPlayerStore}`}>
  {{ white: "blanc", black: "noir" }[$currentPlayerStore]}, à toi de jouer
</div>

<style>
  .text {
    width: fit-content;
    font-size: 3rem;
    margin: auto;
    margin-top: 2rem;
    border-radius: 6px;
    padding: 1rem;
  }

  .white {
    color: black;
    background-color: white;
  }
  .black {
    color: white;
    background-color: black;
  }
</style>
