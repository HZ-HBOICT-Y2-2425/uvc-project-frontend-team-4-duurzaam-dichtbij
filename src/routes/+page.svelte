<script>
    import { onMount } from "svelte";
    import "leaflet/dist/leaflet.css";

    /**
     * @type {{ on: (arg0: string, arg1: (e: { latlng: any; }) => void) => void; }}
     */
    let map;
    onMount(async () => {
        const L = await import("leaflet");

        // Initialize map
        map = L.map('map').setView([51.533370759239155, 3.9179992675781254], 10);

        // Add a tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Load addresses
        const addresses = [
            {
                name: 'Wynkel',
                address: 'Botterlaan 39',
                city: 'Kortgene'
            },
            {
                name: 'Wynkel',
                address: 'Sint Janskerke 4A',
                city: 'Zoutelande'
            },
            {
                name: 'Wynkel',
                address: 'Kruitmolenlaan 9',
                city: 'Middelburg'
            },
        ];

        const points = [];
        for (let i = 0; i < addresses.length; i++) {
            const address = addresses[i];
            let lat = null;
            let lng = null;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${address.address}&city=${address.city}&format=jsonv2`).then(res => {
                return res.json();
            }).then(json => {
                console.log(json);
                lat = json[0].lat;
                lng = json[0].lon;
                console.log(`${lat} ${lng}`)
            }).catch(error => {
                console.error(error);
            });

            console.log(`Found latlng ${lat} ${lng}`);
            points.push({
                name: address.name,
                lat: lat,
                lng: lng,
            });
        }
        points.forEach(point => {
            // Add a marker
            L.marker([point.lat, point.lng]).addTo(map).bindPopup(point.name);
        });

        const loadImg = document.getElementById('loading');
        if (loadImg) {
            loadImg.style.display = "none";
        }
    });
</script>

<div id="loading">
    <img src="https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif" alt="loading">
    <p>Loading Map</p>
</div>
<div id="map"></div>

<style>
    #map {
        flex: 1;
        height: 100%;
        position: relative;
    }

    #loading {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 4000;
        background-color: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        border-radius: 8px;
    }

    #loading img {
        width: 50px;
        height: 50px;
    }

    :global(#page) {
        flex: auto !important;
    }
</style>