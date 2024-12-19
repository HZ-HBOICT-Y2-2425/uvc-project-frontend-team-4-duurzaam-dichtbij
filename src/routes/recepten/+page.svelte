<script>
    import { setContext } from "svelte";
    import Recipe from '$lib/components/Recipes.svelte';
    import Layout from "../layout.svelte";
    export let data;
    
    setContext('apiReference', {
        mainUrl: 'http://localhost:3011'
    });
</script>

<Layout>
    <div class="flex flex-col items-center">
        <h2 class="text-center text-2xl font-bold text-gray-700 my-6">Alle recepten</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {#each data.items.results as recipe}
                <Recipe recipeUrl={`/recipes/${recipe.id}`} />
            {/each}
        </div>
    </div>
</Layout>
