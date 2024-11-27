<script>
    import { onMount } from "svelte";
    import "leaflet/dist/leaflet.css";

    let map;
    onMount(async () => {
        const L = await import("leaflet");

        // Initialize map
        map = L.map('map').setView([51.533370759239155, 3.9179992675781254], 10);

        // Add a tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add a marker
        L.marker([51.533370759239155, 3.9179992675781254]).addTo(map).bindPopup("A pretty popup!").openPopup();

        map.on('click', function (/** @type {{ latlng: any; }} */ e) {
            const coord = e.latlng;
            const lat = coord.lat;
            const lng = coord.lng;
            console.log(`${lat} ${lng}`);
        });
    });
</script>

<div id="map"></div>

<style>
    #map {
        flex: 1;
        height: 100%;
        position: relative;
    }

    :global(#page) {
        flex: auto !important;
    }
</style>