<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import "leaflet/dist/leaflet.css";
    import Layout from "./layout.svelte";
    
    let L = null; // Leaflet instance
    const points = [];
    let currentMarkers = [];
    let searchQuery = '';
    
    let map;
    
    onMount(async () => {
        // Import Leaflet dynamically to ensure it's loaded only on the client
        if (typeof window !== "undefined") {
            L = await import("leaflet");
        } else {
            console.error("Leaflet cannot be loaded in a non-browser environment.");
            return;
        }
    
        // Initialize the map
        map = L.map("map").setView([51.533370759239155, 3.9179992675781254], 10);
    
        // Add a tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);
    
        // Fetch shop and market data
        const shops = await fetchShops();
        const markets = await fetchMarkets();
    
        // Geocode and process points
        await geocodeAndProcessPoints(shops, markets);
    
        // Display the points on the map
        updateMap();
    
        // Hide loading image if applicable
        const loadImg = document.getElementById("loading");
        if (loadImg) {
            loadImg.style.display = "none";
        }
    });
    
    // Fetch shops data
    async function fetchShops() {
        try {
            const res = await fetch(`http://localhost:3010/shops/shops`);
            const json = await res.json();
            return json.map(shop => ({
                name: shop.name,
                address: shop.address,
                city: shop.city,
            }));
        } catch (error) {
            console.error("Could not load shops:", error);
            return [];
        }
    }
    
    // Fetch markets data
    async function fetchMarkets() {
        try {
            const res = await fetch(`http://localhost:3010/markets/markets`);
            const json = await res.json();
            return json.map(market => ({
                name: market.name,
                description: market.description,
                address: market.location.address,
                city: market.location.city,
            }));
        } catch (error) {
            console.error("Could not load markets:", error);
            return [];
        }
    }
    
    // Geocode points
    async function geocodeAndProcessPoints(shops, markets) {
        const geocode = async ({ address, city }) => {
            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/search?street=${address}&city=${city}&format=jsonv2`
                );
                const json = await res.json();
                return { lat: json[0].lat, lng: json[0].lon };
            } catch (error) {
                console.error("Geocoding error:", error);
                return null;
            }
        };
    
        for (const shop of shops) {
            const coords = await geocode(shop.address);
            if (coords) {
                points.push({
                    name: shop.name,
                    popup: `${shop.name}`,
                    icon: "shop_icon.png",
                    ...coords,
                });
            }
        }
    
        for (const market of markets) {
            const coords = await geocode(market);
            if (coords) {
                points.push({
                    name: market.name,
                    popup: `${market.name}<br>${market.description}`,
                    icon: "market_icon.png",
                    ...coords,
                });
            }
        }
    }
    
    // Update markers on the map
    function updateMap() {
        currentMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        currentMarkers = [];
    
        points
            .filter(point => point.name.toLowerCase().startsWith(searchQuery.toLowerCase()))
            .forEach(point => {
                const icon = L.icon({
                    iconUrl: point.icon,
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40],
                });
    
                const marker = L.marker([point.lat, point.lng], { icon });
                currentMarkers.push(marker);
                marker.addTo(map).bindPopup(point.popup);
            });
    }

    function handleSearch() {
        if (L === null) {
            console.error('L is null');
            return;
        }
        updateMap();
    }
</script>

<Layout>
    <div slot="sidebar">
        <input type="text" placeholder="Search..." bind:value={searchQuery} on:input={handleSearch}>
    </div>

    <div id="map-container">
        <div id="loading">
            <img src="https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif" alt="loading">
            <p>Loading Map</p>
        </div>
        <div id="map"></div>
    </div>
</Layout>

<style>
    #map {
        flex: 1;
        height: 100%;
        position: relative;
    }

    #map-container {
        width: 100%;
        height: 100%;
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