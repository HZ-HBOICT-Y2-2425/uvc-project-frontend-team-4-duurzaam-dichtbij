<script>
    import { setContext } from "svelte";
    import Recipe from '$lib/components/Recipe.svelte';
    export let data;

    setContext('apiReference', {
        mainUrl: 'http://localhost:3011'
    });
</script>

<section class="">
    <h2 class="text-center text-2xl font-bold text-gray-700 my-6">All Recipes</h2>
    <div class="flex flex-row  bg-white shadow rounded">
        {#each data.items.results as recipe}
                <Recipe recipeUrl={`/recipes/${recipe.id}`} />
        {/each}
    </div>
</section>