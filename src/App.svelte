<script lang="ts">
  import Grid from "./components/Grid/Grid.svelte";
  import Instructions from "./components/Instructions/Instructions.svelte";
</script>

<main>
  <h1>Jeu de dames</h1>
  <Grid />
  <Instructions />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    background-color: skyblue;
    height: 100vh;
  }

  h1 {
    color: brown;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 500;
  }
</style>
