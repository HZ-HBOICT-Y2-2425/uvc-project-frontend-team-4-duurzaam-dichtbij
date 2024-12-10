<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let shop = null;

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
            const res = await fetch(`http://localhost:3010/shops/shops/${id}`);
            if (res.ok) {
                shop = await res.json();
                console.log(shop);
                
            } else {
                console.error(`Could not load shop with id ${id}:`, res.status);
                shop = null; // Handle gracefully if the shop doesn't load
            }
        } catch (err) {
            console.error(`Error fetching shop with id ${id}:`, err);
            shop = null; // Graceful fallback
        }
    };
</script>

<main>
    {#if shop}
    <div class="shop-details">
        <h1>{shop.name}</h1>
        <p class="address">{shop.address.address}, {shop.address.city}</p>
        <p class="phone">Phone: {shop.phoneNumber}</p>
        <h2>Opening Hours</h2>
        <ul class="opening-hours">
            <li>Monday: {shop.openingHours.monday || "Closed"}</li>
            <li>Tuesday: {shop.openingHours.tuesday || "Closed"}</li>
            <li>Wednesday: {shop.openingHours.wednesday || "Closed"}</li>
            <li>Thursday: {shop.openingHours.thursday || "Closed"}</li>
            <li>Friday: {shop.openingHours.friday || "Closed"}</li>
            <li>Saturday: {shop.openingHours.saturday || "Closed"}</li>
            <li>Sunday: {shop.openingHours.sunday || "Closed"}</li>
        </ul>
        <h2>Paying Methods</h2>
        <ul class="paying-methods">
            {#each shop.payingMethods as method}
                <li>{method}</li>
            {/each}
        </ul>
    </div>
{:else}
    <p>Loading shop details...</p>
{/if}
</main>

<style>
    main {
        padding: 2rem;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
    }
    .shop-details {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    h1 {
        font-size: 2.5em;
        margin-bottom: 0.5em;
        color: #333;
    }
    .address, .phone {
        font-size: 1.2em;
        margin-bottom: 1em;
        color: #666;
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
    .opening-hours li, .paying-methods li {
        font-size: 1.1em;
        margin-bottom: 0.5em;
        color: #555;
    }
    .opening-hours li::before, .paying-methods li::before {
        content: "•";
        color: #000000;
        font-weight: bold;
        display: inline-block;
        width: 1em;
        margin-left: -1em;
    }
</style>
