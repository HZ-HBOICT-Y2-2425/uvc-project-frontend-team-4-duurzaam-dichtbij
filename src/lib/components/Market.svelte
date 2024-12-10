<script>
    /**
     * @type Object
     */
    export let market;
</script>

<a href="/markten/{market.id}" class="block pb-4">
    <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition transform flex justify-between items-center">
        <div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">{market.name}</h2>
            <p class="text-gray-600">{market.description}</p>
        </div>
        {#if market.verified}
            <img title="Geverifieerd" src="/checkmark.svg" alt="Checkmark voor geverifieerde markt" class="h-10 w-10" />
        {/if}
    </div>
</a>
