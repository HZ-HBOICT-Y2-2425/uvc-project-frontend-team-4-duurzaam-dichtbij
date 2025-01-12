<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import "leaflet/dist/leaflet.css";
    import Layout from "../layout.svelte";
    import { json } from "@sveltejs/kit";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    
    let L = null; // Leaflet instance
    const points = []; // all points from api cached
    let currentMarkers = []; // all loaded markers

    let searchQuery = ''; // current search query
    let products = []; // products that shops must sell to show
    let selectedProducts = []; // selected product
    let maxDistance = undefined; // distance in km
    let showClosed = true; // closed shops are shown too

    let userPoint = null; // user coordinates
    let userMarker = null; // user marker on map

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
    
        // Get user's location
        getUserLocation();

        // Fetch shop and market data
        await fetchProducts();
        const shops = await fetchShops();
        const markets = await fetchMarkets();

        // Fetch url params and update filtered products
        const urlParams = new URLSearchParams(get(page).url.search);
        const selectedProductIds = urlParams.getAll('product');
        selectedProducts = selectedProductIds;

        // Process the points
        processPoints(shops, markets);
    
        // Display the points on the map
        updateMap();

        // Hide loading image if applicable
        const loadImg = document.getElementById("loading");
        if (loadImg) {
            loadImg.style.display = "none";
        }
    });
    
    function isOpen(openHours) {
        // Haal de huidige dag en tijd op
        const now = new Date();
        const currentDay = now.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
        const currentTime = now.getHours() * 60 + now.getMinutes(); // Tijd in minuten

        // Controleer of de winkel op de huidige dag geopend is
        if (!openHours[currentDay] || openHours[currentDay].toLowerCase() === "closed") {
            return false;
        }

        // Haal de openingstijden op
        const [open, close] = openHours[currentDay].split(" - ").map(time => {
            const [hours, minutes] = time
                .replace("AM", "")
                .replace("PM", "")
                .trim()
                .split(":")
                .map(Number);
            const isPM = time.includes("PM");
            return (isPM && hours !== 12 ? hours + 12 : hours) * 60 + (minutes || 0);
        });

        // Controleer of de huidige tijd binnen de openingstijden valt
        return currentTime >= open && currentTime <= close;
    }
    
    // Fetch shops data
    async function fetchShops() {
        try {
            const res = await fetch(`http://localhost:3010/shops/shops`);
            const json = await res.json();
            
            return json.map(shop => ({
                id: shop.id,
                name: shop.name,
                address: {
                    address: shop.location.address,
                    city: shop.location.city,
                },
                lat: shop.lat,
                lng: shop.lng,
                open: isOpen(shop.openingHours),
                products: shop.products
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
                id: market.id,
                name: market.name,
                description: market.description,
                address: {
                    address: market.location.address,
                    city: market.location.city,
                },
                lat: market.lat,
                lng: market.lng,
                open: true,
            }));
        } catch (error) {
            console.error("Could not load markets:", error);
            return [];
        }
    }
    
    // Geocode points
    function processPoints(shops, markets) {
    for (const shop of shops) {
        points.push({
            name: shop.name,
            popup: `<b>${shop.name}</b><br><a href="/shops/${shop.id}">Meer informatie</a>`,
            icon: "shop_icon.png",
            lat: shop.lat,
            lng: shop.lng,
            open: shop.open,
            products: shop.products 
        });
    }

    for (const market of markets) {
        points.push({
            name: market.name,
            popup: `<b>${market.name}</b><br>${market.description}<br><a href="/markten/${market.id}">Meer informatie</a>`,
            icon: "market_icon.png",
            lat: market.lat,
            lng: market.lng,
            open: true,
            products: undefined
        });
    }
}
    
    // Update markers on the map
    function updateMap() {
        const closedVisible = showClosed;

        currentMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        currentMarkers = [];
        console.log(selectedProducts)
        console.log(points)
        points
            .filter(point => searchQuery ? point.name.toLowerCase().startsWith(searchQuery.toLowerCase()) : true)
            .filter(point => maxDistance ? getDistanceFromLatLng(point.lat, point.lng, userPoint.lat, userPoint.lng) <= maxDistance : 1000)
            .filter(point => closedVisible ? true : point.open)
            .filter(point => point.products == undefined || selectedProducts.length == 0 || selectedProducts.some(productId => point.products.includes(productId)))
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

    // Get user's current location
    function getUserLocation() {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by this browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                const { latitude, longitude } = position.coords;

                userPoint = {
                    lat: latitude,
                    lng: longitude
                };

                // Add a marker for the user's location
                const userIcon = L.icon({
                    iconUrl: "user_icon.png", // Replace with your user marker icon path
                    iconSize: [40, 40],
                    iconAnchor: [20, 40],
                    popupAnchor: [0, -40],
                });

                if (userMarker) {
                    map.removeLayer(userMarker);
                }

                userMarker = L.marker([latitude, longitude], { icon: userIcon });
                userMarker.addTo(map).bindPopup("You are here.");

                // Center the map on the user's location
                map.setView([latitude, longitude], 12);
            },
            error => {
                console.error("Could not get user location:", error);
            }
        );
    }

    function handleSearch() {
        if (L === null) {
            console.error('L is null');
            return;
        }
        updateMap();
    };

    const handleCheckboxClick = evt => {
        showClosed = evt.target.checked;
        handleSearch();
    };

    /* Distance between two lat/lng coordinates in km using the Haversine formula */
    function getDistanceFromLatLng(lat1, lng1, lat2, lng2, miles) { // miles optional
        if (typeof miles === "undefined"){miles=false;}
        function deg2rad(deg){return deg * (Math.PI/180);}
        function square(x){return Math.pow(x, 2);}
        var r=6371; // radius of the earth in km
        lat1=deg2rad(lat1);
        lat2=deg2rad(lat2);
        var lat_dif=lat2-lat1;
        var lng_dif=deg2rad(lng2-lng1);
        var a=square(Math.sin(lat_dif/2))+Math.cos(lat1)*Math.cos(lat2)*square(Math.sin(lng_dif/2));
        var d=2*r*Math.asin(Math.sqrt(a));
        if (miles){return d * 0.621371;} //return miles
        else{return d;} //return km
    }
    /* Copyright 2016, Chris Youderian, SimpleMaps, http://simplemaps.com/resources/location-distance
    Released under MIT license - https://opensource.org/licenses/MIT */ 

    function toggleField(field) {
        const fields = document.querySelectorAll('[id$="-field"]');
        fields.forEach(field => field.classList.toggle('hidden', true));

        const fieldElement = document.getElementById(`${field}-field`);
        if (fieldElement) {
            fieldElement.classList.toggle('hidden');
        }
    }

    async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3013/products/'); // Pas de endpoint aan naar jouw backend
        const json = await res.json();
        products = json;  
    } catch (error) {
        console.error("Could not load products:", error);
    }
}
</script>

<Layout>
    <div slot="sidebar">
        <input type="text" placeholder="Zoek..." bind:value={searchQuery} on:input={handleSearch}>
        <input type="number" placeholder="Afstand... (km)" bind:value={maxDistance} on:input={handleSearch}>
        <div>
            <input type="checkbox" checked={showClosed} on:input={handleCheck(showClosed, () => handleSearch())}>
            <span class="text-sm">Gesloten winkels verbergen</span>
        </div>
        <button class="bg-green-600 text-white font-bold mt-20 rounded-md p-2 bottom-3">Zoek Winkels</button>
    </div>

    <div id="map-container">
        <div id="loading">
            <img src="https://media.tenor.com/_62bXB8gnzoAAAAj/loading.gif" alt="loading">
            <p>Loading Map</p>
        </div>
        <div class="ml-12 absolute top-2 left-2 flex flex-col bg-transparent z-[2500]">
            <button class="bg-white rounded mb-2 border-none p-2 text-black text-lg cursor-pointer flex items-center" on:click={() => toggleField('search')}>
            <img src="https://www.svgrepo.com/download/532552/search-alt-2.svg" alt="Search Icon" class="mr-2 w-6"> Zoek Winkel
            </button>
            <button class="bg-white rounded mb-2 border-none p-2 text-black text-lg cursor-pointer flex items-center" on:click={() => toggleField('filters')}>
            <img src="https://www.svgrepo.com/download/521661/filter.svg" alt="Filter Icon" class="mr-2 w-6"> Filters
            </button>
        </div>
        <div class="">
            <div id="search-field" class="hidden field bg-white p-4 text-xl rounded shadow-lg absolute top-16 left-2 z-[2501]">
            <!-- HTML content for search field -->
            <button class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-[35px] font-bold" on:click={() => toggleField('')}>×</button>
            <input type="text" placeholder="Zoek..." bind:value={searchQuery} on:input={handleSearch}>
            </div>
            <div id="filters-field" class="hidden field bg-white p-4 text-xl rounded shadow-lg absolute top-16 left-2 z-[2502] max-h-[calc(100vh-5rem)] overflow-y-auto">
            <!-- Sluitknop -->
            <button class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-[35px] font-bold" 
                on:click={() => toggleField('')}>
                ×
            </button>
            
            <!-- Afstand filter -->
            <input type="number" placeholder="Afstand... (km)" bind:value={maxDistance} on:input={handleSearch} class="mb-4">
            
            <!-- Gesloten winkels checkbox -->
            <div class="mb-4">
                <input type="checkbox" checked={showClosed} on:input={handleCheckboxClick}>
                <span>Gesloten winkels weergeven</span>
            </div>
            
            <!-- Productfilter -->
            <div class="mb-4">
                <label for="product-select" class="block mb-2 font-bold">Filter op product:</label>
                <div class="flex flex-col gap-2">
                {#each products as product}
                    <label class="flex items-center">
                    <input type="checkbox" bind:group={selectedProducts} value={product.id} on:change={handleSearch}>
                    <span class="ml-2">{product.fancyName}</span>
                    </label>
                {/each}
                </div>
            </div>
            </div>
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
</style>