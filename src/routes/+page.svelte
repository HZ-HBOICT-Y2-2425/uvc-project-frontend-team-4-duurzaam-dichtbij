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
        /**
         * @type {any[]}
         */
        const mapItems = [];
        await fetch(`http://localhost:3010/markets/markets`).then(res => {
            return res.json();
        }).then(json => {
            for (let i = 0; i < json.length; i++) {
                const market = json[i];
                const location = market.location;
                location.name = market.name;
                location.description = market.description;
                location.id = market.id;
                location.type = 'market';
                console.log(location);
                mapItems.push(location);
            }
        }).catch(error => {
            console.error('Could not load markets: ');
            console.log(error);
        });

        await fetch(`http://localhost:3010/shops/shops`).then(res => {
            return res.json();
        }).then(json => {
            for (let i = 0; i < json.length; i++) {
                const shop = json[i];
                const location = shop.location;
                location.name = shop.name;
                location.description = shop.phoneNumber;
                location.id = shop.id;
                location.type = 'shop';
                console.log(location);
                mapItems.push(location);
            }
        }).catch(error => {
            console.error('Could not load shops: ');
            console.log(error);
        });

        const points = [];
        for (let i = 0; i < mapItems.length; i++) {
            const item = mapItems[i];
            let lat = null;
            let lng = null;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${item.address}&city=${item.city}&format=jsonv2`).then(res => {
                return res.json();
            }).then(json => {
                lat = json[0].lat;
                lng = json[0].lon;
            }).catch(error => {
                console.error(error);
            });

            console.log(`Found latlng ${lat} ${lng}`);
            points.push({
                id: item.id,
                name: item.name,
                description: item.description,
                type: item.type,
                lat: lat,
                lng: lng,
            });
        }

        points.forEach(point => {
            // Add a marker
            if (point.type === 'market') {
                L.marker([point.lat, point.lng]).addTo(map).bindPopup(`<b>${point.name}</b><br>${point.description}<br><a href="/markets/${point.id}">More info</a>`);
            } else if (point.type === 'shop') {
                L.marker([point.lat, point.lng]).addTo(map).bindPopup(`<b>${point.name}</b><br>${point.description}<br><a href="/shops/${point.id}">More info</a>`);
            }
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