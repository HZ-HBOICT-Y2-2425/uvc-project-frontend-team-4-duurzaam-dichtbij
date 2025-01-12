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

let user;

afterNavigate(({from}) => {
    previousPage = from?.url.pathname + from?.url.search || previousPage;
    if (previousPage.toLocaleLowerCase() === window.location.pathname.toLocaleLowerCase() || previousPage.replace(' ', '') == '') {
        previousPage = base;
    }
});

// Fetch shop data when the component mounts
onMount(() => {
    try {
      user = JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
      user = undefined;
    }

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
    <div class="fixed top-0 left-0 w-full h-full z-0">
        <img src="../background.jpg" alt="Sustainability Background" class="w-full h-full object-cover opacity-50">
        <div class="absolute top-0 left-0 w-full h-full bg-white opacity-20"></div>
    </div>
    <main class="relative py-8 px-4 z-10">
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
                <h2 class="text-lg font-semibold text-gray-700 mb-2">Aanbiedingen</h2>
                <section class="bg-gray-100 p-4 rounded-lg mt-4 shadow-lg flex justify-between">
                    
                    {#if shop.promotions.description}
                        <p class="text-gray-600">{shop.promotions.description}</p>
                        <p>Tot {shop.promotions.endDate}</p>
                    {:else}
                        <p class="text-gray-600">Er zijn momenteel geen aanbiedingen.</p>
                    {/if}

                </section>

                <div class="flex flex-wrap gap-6">
                    <div class="flex-1">
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
                        <ul class="text-gray-600 space-y-2">
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
                    {#if user.shopId && user.shopId === shop.id}
                    <a
                        href="/shops/{$page.params.id}/edit"
                        class="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition"
                    >
                        Bewerken
                    </a>
                    {/if}
                </div>
            </div>
        {/if}
    </main>
</Layout>