<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import Layout from "./layout.svelte";
    import Progress from "$lib/components/Progress.svelte";

    let user = null;
    onMount(async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    });

    const seasonalFood = [
        'Aardappelen',
        'Selderij',
        'Pompoen',
        'Prei',
        'Rode kool',
        'Witte kool',
        'Spruiten',
        'Wortel'
    ];
</script>

<Layout>
    <div class="relative">
        <img src="background.jpg" alt="Sustainability Background" class="fixed top-0 left-0 w-full h-full object-cover z-0">
        <div class="relative z-10 container mx-auto p-4">
            <div class="text-center my-8">
                <h1 class="text-4xl font-bold">Duurzaam Dichtbijjjjjjjj</h1>
                <p class="text-xl mt-2">"Lokaal eten bereikbaar voor iedereen"</p>
            </div>

            <div class="relative my-8">
                <img src="homepage-map.jpg" alt="Map Background" class="w-full h-64 object-cover rounded-lg shadow-md">
                <div class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg">
                    <a href="/kaart"><button class="bg-green-500 text-white px-4 py-2 rounded-lg">Bekijk kaart</button></a>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Progress {user}/>

                <div class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md text-center">
                    <h2 class="text-2xl font-semibold mb-4">Seizoensgroenten</h2>
                    <p class="text-lg text-gray-600 mb-5">Deze producten zijn op dit moment in het seizoen:</p>
                    <ul class="text-left">
                        {#each seasonalFood as food}
                            <li>{food}</li>
                        {/each}
                    </ul>
                </div>
            </div>

            <div class="my-8">
                <img src="homepage-food.jpg" alt="Sustainability Background" class="w-full h-64 object-cover rounded-lg shadow-md">
            </div>

            <!-- Place credits here -->
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
                <p class="text-lg text-gray-600 mb-5">Dit project is mogelijk gemaakt door:</p>
                <ul class="text-center list-none">
                    <li>Team Duurzaam Dichtbij</li>
                    <li>Lokale boeren en producenten</li>
                    <li>Gemeente en lokale overheden</li>
                    <li>Vrijwilligers en supporters</li>
                </ul>
                <p class="text-lg text-gray-600 mt-5">Voor meer informatie, contacteer ons op <a href="info@duurzaamdichtbij.nl" class="text-green-500 underline">info@duurzaamdichtbij.nl</a>.</p>
            </div>
        </div>
    </div>
</Layout>

<style>
    
</style>