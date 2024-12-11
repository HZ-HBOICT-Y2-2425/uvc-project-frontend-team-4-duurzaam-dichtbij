<script>
// @ts-nocheck

    import { onMount, getContext } from "svelte";

    export let recipeUrl;
    /**
   * @type {never[]}
   */
    let recipe = [];
    let loading = true;
    /**
   * @type {null}
   */
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

{#if recipe}
    <div>
        <img src={recipe.image} alt={recipe.title} />
        <h2>{recipe.title} </h2>
    </div>
{/if}