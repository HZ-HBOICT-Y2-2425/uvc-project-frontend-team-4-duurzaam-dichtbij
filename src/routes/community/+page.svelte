<script>
    // @ts-nocheck

    import Event from "$lib/components/Event.svelte";
    import { onMount } from "svelte";
    import Layout from "../layout.svelte";

    let selectedType = '';
    let filteredEvents = [];
    export let data;
    if (data) {
        const maxDescLength = 100;
        data.events.forEach(event => {
            if (event.description.length > maxDescLength) {
                let spaceIndex = maxDescLength;
                for (let i = maxDescLength; i >= 0; i--) {
                    if (event.description[i] === ' ') {
                        spaceIndex = i;
                        break;
                    }
                }
                event.description = event.description.substring(0, spaceIndex) + '...';
            }
        });
    }

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

<Layout>
    <div class="relative">
        <img src="background.jpg" alt="Sustainability Background" class="fixed top-0 left-0 w-full h-full object-cover z-0">
        <div class="relative z-10 container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
            <div class="text-center m-8 mt-4">
                <h1 class="text-5xl font-bold">Community</h1>
            </div>

            <div class="mb-4">
                <img src="community-img.jpg" alt="Community Background" class="w-full h-48 object-cover rounded-lg">
            </div>

            <div class="flex flex-wrap md:flex-nowrap">
                <!-- Filter Section -->
                <div class="w-full md:w-1/4 p-4">
                    <h2 class="text-xl font-semibold mb-2">Filter op soort evenement:</h2>
                    <div>
                        {#each eventTypes as type}
                        <div class="mb-2">
                            <input type="radio" id={type} name="event-type" value={type} bind:group={selectedType} class="mr-2">
                            <label for={type} class="font-medium">{type}</label>
                        </div>
                        {/each}
                        <div class="mb-2">
                            <input type="radio" id="all" name="event-type" value="" bind:group={selectedType} class="mr-2">
                            <label for="all" class="font-medium">Alles</label>
                        </div>
                    </div>
                    <a href="/community/new" class="block mt-8">
                        <div class="flex justify-center items-center bg-green-500 shadow-lg rounded-lg p-4 hover:shadow-xl transition transform">
                            <p class="text-white text-bold text-xl">Maak Evenement</p>
                        </div>
                    </a>
                </div>
                <!-- Events Section -->
                <div class="w-full md:w-3/4 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {#if filteredEvents.length > 0}
                        {#each filteredEvents as event}
                        <Event {event} />
                        {/each}
                    {:else}
                        <p class="col-span-full text-center">Op dit moment zijn er geen evenementen van dit type gepland.</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Layout>


<!--

        <div class="flex justify-between">
            <h1 class="text-4xl pb-2 font-bold">Community</h1>
            <a href="/community/new">
                <button class="bg-green-500 text-white font-bold p-2 rounded">Nieuw evenement</button>
            </a>
        </div>

        
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
-->