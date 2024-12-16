<script>
    /**
     * @type Object
     */
    export let event;
</script>

<a href="/community/{event.id}" class="block pb-4">
    <div class="flex justify-between bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition transform">
        <div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">{event.name}</h2>
            <p class="text-gray-600">{event.description}</p>
        </div>
        <button class="font-bold py-2 px-4 rounded bg-green-500 text-white hover:bg-green-700">Meer info</button>
    </div>
</a>
