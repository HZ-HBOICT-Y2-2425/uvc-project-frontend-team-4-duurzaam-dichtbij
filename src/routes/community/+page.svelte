<script>
    import Event from "$lib/components/Event.svelte";
    import { onMount } from "svelte";

    let selectedType = '';
    let filteredEvents = [];
    export let data;

    onMount(() => {
        // Initially set filteredEvents to all events if there's no filter
        filteredEvents = data ? data.events : [];
    });

    // Watch for changes to selectedType and filter events
    $: {
        if (selectedType) {
            filteredEvents = data.events.filter(event => event.type === selectedType);
        } else {
            filteredEvents = data.events; // Show all events if no type is selected
        }
    }

    const eventTypes = [...new Set(data?.events.map(event => event.type))];
</script>

<section class="p-4">
    <div class="flex justify-between">
        <h1 class="text-4xl pb-2 font-bold">Community</h1>
        <a href="/community/new">
            <button class="btn btn-green">Nieuw evenement</button>
        </a>
    </div>

    <!-- Filter Section -->
    <div class="my-4">
        <label for="event-type" class="font-semibold">Filter op soort evenement:</label>
        <select id="event-type" class="ml-2 p-2 border rounded" bind:value={selectedType}>
            <option value="">Alles</option>
            {#each eventTypes as type}
                <option value={type}>{type}</option>
            {/each}
        </select>
    </div>

    <div>
        {#if filteredEvents.length > 0}
            <ul>
                {#each filteredEvents as event}
                    <Event {event} />
                {/each}
            </ul>
        {:else}
            <p>Op dit moment zijn er geen evenementen van dit type gepland.</p>
        {/if}
    </div>
</section>

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
