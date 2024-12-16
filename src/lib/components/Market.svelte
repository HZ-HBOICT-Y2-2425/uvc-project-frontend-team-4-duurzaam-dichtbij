<script>
    /**
     * @type Object
     */
    export let market;
</script>

<a href="/markten/{market.id}" class="block pb-4">
    <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition transform flex justify-between items-center">
        <div>
            <div class="flex">
                <h2 class="text-xl font-bold text-gray-800 mb-2">{market.name}</h2>
                {#if market.verified}
                    <img title="Geverifieerd" src="/checkmark.svg" alt="Checkmark voor geverifieerde markt" class="pb-2 pl-1 w-8" />
                {/if}
            </div>
            <p class="text-gray-600">{market.description}</p>
        </div>
        <button class="font-bold py-2 px-4 rounded bg-green-500 text-white hover:bg-green-700">Meer info</button>
    </div>
</a>
