<script>
// @ts-nocheck

import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto, afterNavigate } from '$app/navigation';
import Layout from '../../layout.svelte';

let shop = null;
let error = null;

const base = '/';
let previousPage = base;

afterNavigate(({from}) => {
    console.log(base);
    previousPage = from?.url.pathname || previousPage;
    if (previousPage.toLocaleLowerCase() === window.location.pathname.toLocaleLowerCase() || previousPage.replace(' ', '') == '') {
        previousPage = base;
    }
});

// Fetch shop data when the component mounts
onMount(() => {
    console.log('Page loaded');
    // Subscribe to $page to react to route changes
    const unsubscribe = page.subscribe(async ($page) => {
        const params = $page.params;

        // Fetch shop data based on the ID in params
        await fetchShop(params.id);
    });

    // Cleanup subscription synchronously
    return () => unsubscribe();
});

const fetchShop = async (id) => {
  try {
    const res = await fetch(`http://localhost:3010/shops/shop/${id}`);
    if (res.ok) {
      shop = await res.json();
      console.log('Shop details:', shop);
    } else {
      console.error(`Could not load shop with id ${id}:`, res.status);
      shop = null;
    }
  } catch (err) {
    console.error(`Error fetching shop with id ${id}:`, err);
    shop = null;
  }
};

const deleteShop = async (id) => {
    try {
        const response = await fetch(`http://localhost:3010/shops/shop/${id}`, {
            method: "DELETE",
        });
        if (!response.ok)
            throw new Error(`Failed to delete shop: ${response.statusText}`);
        goto("/shops");
    } catch (err) {
        error = err.message;
    }
};

const copyLink = () => {
    const copyButton = document.getElementById("copylink");
    if (copyButton) copyButton.innerText = "Link gekopieerd!";
    navigator.clipboard.writeText(window.location.href);
};

</script>

<Layout>
    <div slot="sidebar-toggle-button"></div>

    <main class="min-h-screen bg-gray-100 py-8 px-4">
        {#if error}
            <p class="text-center text-red-500 font-medium">Error: {error}</p>
        {:else if !shop}
            <p class="text-center text-gray-500 font-medium">
                Shop details aan het laden...
            </p>
        {:else}
            <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center space-x-4">
                        {#if shop.image}
                            <img src="http://localhost:3010/shops/{shop.image}" alt={shop.name} class="w-40 h-40 object-cover rounded-full">
                        {:else}
                            <img src="/profile_picture.png" alt={shop.name} class="w-32 h-32 object-cover rounded-full">
                        {/if}
                        <h1 class="text-3xl font-bold text-gray-800">{shop.name}</h1>
                    </div>
                    <button
                        id="copylink"
                        on:click={copyLink}
                        class="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition"
                    >Deel</button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-700 mb-2">Details</h2>
                        <ul class="text-gray-600 space-y-2">
                            <li><strong>Adres:</strong> {shop.location.address}, {shop.location.city}</li>
                            <li><strong>Telefoon:</strong> {shop.phoneNumber}</li>
                        </ul>
                        <h3 class="text-lg font-semibold text-gray-700 mt-4 mb-2">Betaalmethoden:</h3>
                        <ul class="text-gray-600 space-y-2">
                            {#each shop.payingMethods as method}
                                <li>{method}</li>
                            {/each}
                        </ul>
                        <h2 class="text-lg font-semibold text-gray-700 mt-4 mb-2">Producten:</h2>
                        <ul class="text-gray-600 space-y-2">
                            {#each shop.productList as product}
                                {#if product}
                                    <li>{product.fancyName}</li>
                                {:else}
                                    <li>Productinformatie niet beschikbaar</li>
                                {/if}
                            {/each}
                        </ul>
                    </div>
                    <div>
                        <h2 class="text-lg font-semibold text-gray-700 mb-2">Openingstijden</h2>
                        <ul class="opening-hours text-gray-600 space-y-2">
                            <li><strong>Maandag:</strong> {shop.openingHours.monday || "Gesloten"}</li>
                            <li><strong>Dinsdag:</strong> {shop.openingHours.tuesday || "Gesloten"}</li>
                            <li><strong>Woensdag:</strong> {shop.openingHours.wednesday || "Gesloten"}</li>
                            <li><strong>Donderdag:</strong> {shop.openingHours.thursday || "Gesloten"}</li>
                            <li><strong>Vrijdag:</strong> {shop.openingHours.friday || "Gesloten"}</li>
                            <li><strong>Zaterdag:</strong> {shop.openingHours.saturday || "Gesloten"}</li>
                            <li><strong>Zondag:</strong> {shop.openingHours.sunday || "Gesloten"}</li>
                        </ul>
                    </div>
                </div>

                <div class="mt-8 flex justify-between">
                    <a
                        href="{previousPage}"
                        class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                        Terug
                    </a>
                    <a
                        href="/shops/{$page.params.id}/edit"
                        class="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                    >
                        Bewerken
                    </a>
                </div>
            </div>
        {/if}
    </main>
</Layout>

<style>
    main {
        padding: 2rem;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
    }
    h1 {
        font-size: 2.5em;
        margin-bottom: 0.5em;
        color: #333;
    }
    h2 {
        font-size: 1.5em;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        color: #333;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    .opening-hours li {
        font-size: 1.1em;
        margin-bottom: 0.5em;
        color: #555;
    }
    .opening-hours li::before {
        content: "•";
        color: #000000;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
    }
</style>
