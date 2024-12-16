<script>
    import Market from "$lib/components/Market.svelte";
    import { onMount } from "svelte";
    import Layout from "../layout.svelte";

    onMount(async () => {
        console.log('Page loaded');
    });

    export let data;
</script>

<Layout>
    <main class="p-4">
        <div class="flex justify-between">
            <h1 class="text-4xl pb-2 font-bold">Markten</h1>
            <a href="/markten/new">
                <button class="btn btn-green">Nieuwe markt</button>
            </a>
        </div>
        <div>
        {#if data}
            <ul>
            {#each data.markets as market}
                <Market {market}/>
            {/each}
            </ul>
        {:else}
            <p>Op dit moment zijn er geen markten gepland.</p>
        {/if}
        </div>
    </main>
</Layout>

<style>
    .btn {
      @apply font-bold py-2 px-4 rounded;
    }
    .btn-green {
      @apply bg-green-500 text-white;
    }
    .btn-green:hover {
      @apply bg-green-700;
    }
</style>