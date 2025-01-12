<script>
// @ts-nocheck

    import Market from "$lib/components/Market.svelte";
    import { onMount } from "svelte";
    import Layout from "../layout.svelte";

    let user = null;

    let position = { coords: { latitude: 0, longitude: 0 } };
    let locationAllowed = false;
    onMount(() => {
        // parse user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }

        // parse geo location if available
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    position = pos;
                    locationAllowed = true;
                },
                (error) => {
                    locationAllowed = false;
                }
            );
        } else {
            locationAllowed = false;
        }
    });

    export let data;

    let distance = undefined;
    let filteredMarkets = [];

    filteredMarkets = data ? data.markets : [];

    // Watch for changes to distance and filter markets
    $: filteredMarkets = (distance && distance > 0) ? data.markets.filter(market => 
            getDistanceFromLatLng(
                position.coords.latitude, 
                position.coords.longitude, 
                market.lat, 
                market.lng
            ) <= distance) : data.markets;

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
</script>

<Layout>
    <div class="relative">
        <img src="background.jpg" alt="Sustainability Background" class="fixed top-0 left-0 w-full h-full object-cover z-0">
        <div class="relative z-10 container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
            <div class="text-center m-8 mt-4">
                <h1 class="text-5xl font-bold">Markten</h1>
            </div>

            <div class="mb-4">
                <img src="market-background.jpg" alt="Market Background" class="w-full h-48 object-cover rounded-lg ">
            </div>

            <div class="flex flex-wrap md:flex-nowrap">
                <!-- Filter Section -->
                <div class="w-full md:w-1/4 p-4">
                    <h2 class="text-xl font-semibold mb-2">Filter op afstand</h2>
                    <div>
                        <div class="mb-2">
                            {#if locationAllowed}
                                <input type="number" id="market-distance" name="market-distance" bind:value={distance} class="mr-2 max-w-[80px]">
                                <span>km</span>
                            {:else}
                                <p>Locatie kan niet gevonden worden.</p>
                            {/if}
                        </div>
                    </div>
                    {#if user}
                        {#if user.role === "admin"}
                        <a href="/markten/new" class="block mt-8">
                            <div class="flex justify-center items-center bg-green-500 shadow-lg rounded-lg p-4 hover:shadow-xl transition transform">
                                <p class="text-white text-bold text-xl">Maak Markt</p>
                            </div>
                        </a>
                        {/if}
                    {/if}
                </div>
                <!-- Markets Section -->
                <div class="w-full md:w-3/4 p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {#if filteredMarkets.length > 0}
                        {#each filteredMarkets as market}
                        <div>
                            <Market {market} />
                        </div>
                        {/each}
                    {:else}
                        <p class="col-span-full text-center">Geen markten voor uw zoekcriteria gevonden.</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>
</Layout>