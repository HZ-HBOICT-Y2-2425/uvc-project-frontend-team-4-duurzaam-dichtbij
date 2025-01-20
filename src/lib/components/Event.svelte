<script>
// @ts-nocheck

    /**
     * @type Object
     */
    export let event;
</script>

<a href="/community/{event.id}">
    <div class="flex justify-between bg-gray-200 shadow-lg rounded-lg p-4 hover:shadow-xl transition transform">
        <div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">{event.name}</h2>
            <p class="text-gray-600">{event.description}</p>
        </div>
        <div class="flex flex-col lg:flex-row lg:items-end">
            <button class="font-bold py-2 px-4 rounded bg-green-500 text-white hover:bg-green-700 mt-4 lg:mt-0 lg:ml-4">Meer info</button>
        </div>
    </div>
</a>
