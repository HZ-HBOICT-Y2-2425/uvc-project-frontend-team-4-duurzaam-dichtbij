<script>
    // @ts-nocheck
    import { page } from "$app/stores";
    import { onMount, getContext } from "svelte";
  import Layout from "../../layout.svelte";
    export let recipeUrl;
    const id = $page.params.id;
    let recipe = [];
    let loading = true;
    let error = null;

    const apiReference = getContext('apiReference');
    let apiUrl = `http://localhost:3011/recipes/${id}`;

    if (apiReference && apiReference.mainUrl) {
        apiUrl = `${apiReference.mainUrl}${recipeUrl}`;
    }

    console.log('API URL:', apiUrl);

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

<Layout>
    {#if recipe}
    <!-- Volledige container die het hele scherm gebruikt -->
    <div class="w-full min-h-screen bg-gray-50 p-6">
        <!-- Hoofdvak: Titel, afbeelding en ingrediënten -->
        <div class="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <!-- Titel -->
            <div class="text-center py-4 bg-gray-100">
                <h2 class="text-4xl font-bold text-gray-800">{recipe.title}</h2>
            </div>

            <!-- Flex-container voor afbeelding en ingrediënten -->
            <div class="flex flex-col md:flex-row">
                <!-- Afbeelding -->
                <div class="flex-shrink-0 md:w-1/2">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        class="w-full h-full object-cover"
                    />
                </div>

                <!-- Ingrediënten -->
                <div class="p-6 md:w-1/2 bg-gray-50">
                    <h3 class="text-2xl font-semibold text-gray-800 mb-4">Ingrediënten:</h3>
                    <ul class="list-disc list-inside space-y-2 text-gray-700">
                        {#each recipe.extendedIngredients as ingredient}
                            <li>{ingredient.original}</li>
                        {/each}
                    </ul>
                </div>
            </div>

            <!-- Instructies -->
            <div class="p-6 bg-white">
                <h3 class="text-2xl font-semibold text-gray-800 mb-4">Instructies:</h3>
                {#if recipe.analyzedInstructions?.length > 0}
                    <ol class="list-decimal list-inside space-y-4 text-gray-700">
                        {#each recipe.analyzedInstructions[0].steps as step}
                            <li>{step.step}</li>
                        {/each}
                    </ol>
                {:else}
                    <p class="text-gray-500">Geen instructies beschikbaar.</p>
                {/if}
            </div>
        </div>
    </div>
    {/if}

</Layout>