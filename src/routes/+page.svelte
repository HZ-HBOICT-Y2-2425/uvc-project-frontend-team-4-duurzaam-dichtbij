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
        const shops = [];
        await fetch(`http://localhost:3010/shops/shops`).then(res => {
            return res.json();
        }).then(json => {
            for (let i = 0; i < json.length; i++) {
                const shop = json[i];
                const address = shop.address;
                address.name = shop.name;
                shops.push(address);
            }
        }).catch(error => {
            console.error('Could not load shops: ');
            console.log(error);
        });

        /**
         * @type {any[]}
         */
        const markets = [];
        await fetch(`http://localhost:3010/markets/markets`).then(res => {
            return res.json();
        }).then(json => {
            for (let i = 0; i < json.length; i++) {
                const market = json[i];
                const location = market.location;
                location.name = market.name;
                location.description = market.description;
                markets.push(location);
            }
        }).catch(error => {
            console.error('Could not load markets: ');
            console.log(error);
        });

        const points = [];
        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            let lat = null;
            let lng = null;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${shop.address}&city=${shop.city}&format=jsonv2`).then(res => {
                return res.json();
            }).then(json => {
                lat = json[0].lat;
                lng = json[0].lon;
            }).catch(error => {
                console.error(error);
            });

            points.push({
                popup: `${shop.name}`,
                icon: 'shop_icon.png',
                lat: lat,
                lng: lng,
            });
        }
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            let lat = null;
            let lng = null;
            const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${market.address}&city=${market.city}&format=jsonv2`).then(res => {
                return res.json();
            }).then(json => {
                lat = json[0].lat;
                lng = json[0].lon;
            }).catch(error => {
                console.error(error);
            });

            points.push({
                popup: `${market.name}<br>${market.description}`,
                icon: 'market_icon.png',
                lat: lat,
                lng: lng,
            });
        }

        points.forEach(point => {
            const icon = L.icon({
                // @ts-ignore
                iconUrl: point.icon,
                iconSize: [40, 40],       // Size of the scaled-down icon
                iconAnchor: [20, 40],     // Center-bottom alignment
                popupAnchor: [0, -40]     // Popup opens directly above the icon
            });
            // Add a marker
            L.marker([point.lat, point.lng], { icon: icon }) // Use the custom icon
                .addTo(map).bindPopup(point.popup);
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