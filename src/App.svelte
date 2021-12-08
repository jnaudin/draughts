<script lang="ts">
  import Grid from "./components/Grid.svelte";
</script>

<main>
  <h1>Jeu de dames !</h1>
  <Grid />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
	background-color: skyblue;
	height: 100vh;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
