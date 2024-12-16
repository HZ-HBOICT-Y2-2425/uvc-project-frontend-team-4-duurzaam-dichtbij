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
    <div slot="sidebar-toggle-button"></div>
    <section class="p-4 bg-gray-100 min-h-full">
        <div class="flex justify-between">
            <h1 class="text-4xl pb-2 font-bold">Markten</h1>
            <a href="/markten/new">
                <button class="font-bold py-2 px-4 rounded bg-green-700 text-white hover:bg-green-900">Nieuwe markt</button>
            </a>
        </div>
        <div class="pt-2">
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
    </section>
</Layout>