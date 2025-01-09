<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import Layout from "./layout.svelte";

    let user = null;
    const co2RequiredToLevelUp = 500;
    onMount(async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    });

    const seasonalFood = [
        { name: 'Appel', image: 'https://www.svgrepo.com/download/389680/vegetable-food-pepper.svg' },
        { name: 'Peer', image: 'https://www.svgrepo.com/download/389663/fruit-food-pear.svg' },
        { name: 'Wortel', image: 'https://www.svgrepo.com/download/389676/vegetable-food-carrot.svg' },
    ];
</script>

<Layout>
    <div class="relative">
        <img src="homepage-pic.jpg" alt="Sustainability Background" class="fixed top-0 left-0 w-full h-full object-cover z-0">
        <div class="relative z-10 container mx-auto p-4">
            <div class="text-center my-8">
                <h1 class="text-4xl font-bold">Duurzaam Dichtbij</h1>
                <p class="text-xl mt-2">"Lokaal eten bereikbaar voor iedereen"</p>
            </div>

            <div class="relative my-8">
                <img src="homepage-map.jpg" alt="Map Background" class="w-full h-64 object-cover rounded-lg shadow-md">
                <div class="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                    <a href="/kaart"><button class="bg-green-500 text-white px-4 py-2 rounded-lg">Bekijk kaart</button></a>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md text-center">
                    <h2 class="text-2xl font-semibold mb-4">Voortgangsdetails</h2>
                    <p class="text-lg text-gray-600 mb-5">Je voortgang wordt hier weergegeven op basis van je CO2-reductie.</p>
                    {#if user !== null}
                        <div class="text-center mb-5">
                            <p class="text-xl font-semibold text-gray-800">Hallo, {user.name}!</p>
                            <p class="text-lg text-gray-800">Je CO2-reductie is: <strong>{user.reduction}kg</strong></p>
                            <p class="text-lg text-gray-800">Je bent nu level <strong>{user.level}</strong></p>
                        </div>
            
                        <!-- Voortgangsbalk -->
                        <div class="w-full h-5 bg-gray-300 rounded-full mb-5">
                            <div class="h-full rounded-full bg-green-500" style="width: {(user.reduction / co2RequiredToLevelUp) * 100}%;"></div>
                        </div>
                        <a href="/voortgang"><button class="bg-green-500 text-white px-4 py-2 rounded-lg">Bekijk Voortgang</button></a>
                    {:else}
                        <a href="/login"><button class="bg-green-500 text-white px-4 py-2 rounded-lg">Inloggen</button></a>
                    {/if}
                </div>

                <div class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md text-center">
                    <h2 class="text-2xl font-semibold mb-4">Seizoensgroenten</h2>
                    <p class="text-lg text-gray-600 mb-5">Deze producten zijn op dit moment in het seizoen:</p>
                    <ul class="text-left">
                        {#each seasonalFood as food}
                            <li><img src={food.image} alt={food.name} class="w-6 inline mb-1.5 mr-1">{food.name}</li>
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
                <p class="text-lg text-gray-600 mt-5">Voor meer informatie, bezoek onze <a href="/about" class="text-green-500 underline">over ons</a> pagina.</p>
            </div>
        </div>
    </div>
</Layout>

<style>
    
</style>