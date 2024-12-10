<script>
    /**
     * @type Object
     */
    export let event;
</script>

<a href="/community/{event.id}" class="block pb-4">
    <div class="bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition transform">
        <h2 class="text-xl font-bold text-gray-800 mb-2">{event.name}</h2>
        <p class="text-gray-600">{event.description}</p>
    </div>
</a>
