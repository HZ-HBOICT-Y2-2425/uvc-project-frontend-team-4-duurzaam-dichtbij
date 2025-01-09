<script>
    export let user;

    const co2RequiredToLevelUp = 500;
</script>

<div class="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md text-center">
    <h2 class="text-2xl font-semibold mb-4">Voortgangsdetails</h2>
    <p class="text-lg text-gray-600 mb-5">Je voortgang wordt hier weergegeven op basis van je CO2-reductie.</p>
    {#if user !== null}
        <div class="text-center mb-5">
            <p class="text-xl font-semibold text-gray-800">Hallo, {user.name}!</p>
            <p class="text-lg text-gray-800">Je CO2-reductie is: <strong>{(user.level-1)*500 + user.reduction}kg</strong></p>
            <p class="text-lg text-gray-800">Je bent nu level <strong>{user.level}</strong></p>
        </div>

        <!-- Voortgangsbalk -->
        <div class="w-full h-5 bg-gray-300 rounded-full mb-5">
            <div class="h-full rounded-full bg-green-500" style="width: {Math.round((user.reduction/500)*100)}%;"></div>
        </div>
        <div>
            <a href="/voortgang"><button class="bg-green-500 text-white px-4 py-2 rounded-lg">Bekijk Voortgang</button></a>
            <a href="/beloning"><button class="bg-yellow-500 text-white px-4 py-2 rounded-lg">Ontvang Beloning</button></a>
        </div>
    {:else}
        <a href="/login"><button class="bg-green-500 text-white px-4 py-2 rounded-lg">Inloggen</button></a>
    {/if}
</div>