<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { page } from '$app/stores';


    let shop = null;

    // Fetch shop data when the component mounts
    onMount(() => {
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
    }
</script>

<main>
    {#if shop}
        <h1>{shop.name}</h1>
        <p>+31 {shop.phoneNumber}</p>
        <ul>
            <li>Maandag : {shop.openingHours.monday || "gesloten"} </li>
            <li>Dinsdag : {shop.openingHours.tuesday || "gesloten"}</li>
            <li>Woensdag : {shop.openingHours.wednesday || "gesloten"}</li>
            <li>Donderdag : {shop.openingHours.thursday || "gesloten"}</li>
            <li>Vrijdag : {shop.openingHours.friday || "gesloten"}</li>
            <li>Zaterdag : {shop.openingHours.saturday || "gesloten"}</li>
            <li>Zondag : {shop.openingHours.sunday || "gesloten"}</li>
        </ul>
    {:else}
        <p>Loading shop details...</p>
    {/if}
</main>

<style>
    main {
        padding: 1rem;
    }
    h1 {
        font-size: 2em;
        margin-bottom: 0.5em;
    }
    p {
        margin-bottom: 1em;
    }
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin-bottom: 0.5em;
    }
</style>
