<script>
    // @ts-nocheck
    
        import { onMount, getContext } from "svelte";
        export let recipeUrl;
        let recipe = [];
        let loading = true;
        let error = null;
    
        const apiUrl = `${getContext('apiReference').mainUrl}${recipeUrl}`;
        
        onMount(async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error("Failed to fetch recipe data");
                }
                recipe = await response.json();
            } catch (err) {
                error = err.message;
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
    
    {#if recipe}
        <div class="bg-white shadow-md rounded-lg overflow-hidden max-w-sm">
            <img class="w-full h-48 object-cover" src={recipe.image} alt={recipe.title} />
            <div class="p-4">
                <h2 class="text-lg font-bold text-gray-800 mb-2">{recipe.title}</h2>
                <!-- Link naar de detailpagina -->
                <a href={`/recepten/${recipe.id}`} class="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
                    View Details
                </a>
            </div>
        </div>
    {/if}