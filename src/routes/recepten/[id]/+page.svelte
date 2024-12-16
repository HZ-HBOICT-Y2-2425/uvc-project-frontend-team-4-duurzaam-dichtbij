<script>
    // @ts-nocheck
    import { onMount, getContext } from "svelte";
    export let recipeUrl;
    let recipe = [];
    let loading = true;
    let error = null;

    let apiReference = getContext('apiReference');
    let apiUrl = 'http://localhost:3010/recipes';

    if (apiReference && apiReference.mainUrl) {
        apiUrl = `${apiReference.mainUrl}${recipeUrl}`;
    }

    console.log('API URL:', apiUrl);

    onMount(async () => {
        if (!apiUrl) return;
        try {
            const response = await fetch(apiUrl);
            console.log('API Response:', response);
            if (!response.ok) {
                throw new Error("Failed to fetch recipe data");
            }
            recipe = await response.json();
            console.log('Recipe Data:', recipe);
        } catch (err) {
            error = err.message;
            console.error('Fetch Error:', err);
        } finally {
            loading = false;
        }
    });
</script>

{#if loading}
    <div class="text-center p-4">Loading...</div>
{/if}
{#if error}
    <div class="text-center text-red-500 p-4">Error: {error}</div>
{/if}

{#if recipe && recipe.title}
    <div class="p-4">
        <h2 class="text-3xl font-bold text-gray-800">{recipe.title}</h2>
        <h3 class="text-xl mt-4">Summary:</h3>
        <p class="mt-2">{recipe.summary}</p>
        <h3 class="text-xl mt-4">Ingredients:</h3>
        <ul class="list-disc list-inside mt-2">
            {#each recipe.ingredients as ingredient}
                <li>{ingredient}</li>
            {/each}
        </ul>
        <h3 class="text-xl mt-4">Instructions:</h3>
        <ol class="list-decimal list-inside mt-2">
            {#each recipe.instructions as instruction}
                <li>{instruction}</li>
            {/each}
        </ol>
    </div>
{/if}