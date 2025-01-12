<script>
// @ts-nocheck
    import { onMount } from 'svelte';
    import Layout from "../layout.svelte";
    import Progress from '$lib/components/Progress.svelte';

    let user = null;
    let shops = null;
    let shop = null;
    onMount(async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
            console.log(user.shopId);
        }
        await fetchShops();
        shop = shops.find(shop => shop.id === user.shopId);
        console.log(shop);
    });

    const fetchShops = async () => {
    try {
        const res = await fetch(`http://localhost:3010/shops/shops`);
        if (res.ok) {
            shops = await res.json();
            console.log(shops);
        } else {
            console.error(`Could not load shops`, res.status);
            shops = null; // Handle gracefully if the shop doesn't load
        }
    } catch (err) {
        console.error(`Error fetching shops`, err);
        shops = null; // Graceful fallback
    }
};

    function logout() {
        // Remove the user from localStorage and set isLoggedIn to false
        localStorage.removeItem('user');
        user = null;
        window.location.href = '/profiel'; // Redirect to home or another page
    }

    let showQRModal = false;

    function openModal() {
        showQRModal = true;
    }

    function closeModal() {
        showQRModal = false;
    }
</script>

<Layout>
    <div class="fixed top-0 left-0 w-full h-full z-0">
        <img src="../background.jpg" alt="Sustainability Background" class="w-full h-full object-cover opacity-50">
        <div class="absolute top-0 left-0 w-full h-full bg-white opacity-20"></div>
    </div>
    <main class="relative py-8 px-4 z-10 max-w-6xl w-full mx-auto">
        {#if user}
        <div class="max-w-4xl mx-auto flex justify-center items-center">
            <h1 class="text-3xl font-bold mb-4 mx-auto">Goede{new Date().getHours() < 12 ? 'morgen' : new Date().getHours() < 18 ? 'middag' : new Date().getHours() < 22 ? 'avond' : 'nacht'}, {user.name}</h1>
        </div>
        {/if}
        {#if user}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
                <!-- Toon profielinformatie als de gebruiker is ingelogd -->
                <h2 class="text-2xl font-bold text-center">Persoonlijke Informatie</h2>
                <div class="profile-info">
                    <p><strong>Naam:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{user.name}</div>
                    <p><strong>Email:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{user.email}</div>
                    <p><strong>Rol:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{user.role}</div>
                </div>
                <button class="logout-button bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300" on:click={logout}>Uitloggen</button>
            </div>
            <Progress class="max-w-2xl w-full" {user} />
            {#if shop}
            <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl w-full">
                <!-- Toon profielinformatie als de gebruiker is ingelogd -->
                <h2 class="text-2xl font-bold text-center">Winkelhouder</h2>
                <div class="store-info">
                    <p><strong>Naam:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{shop.name}</div>
                    <p><strong>Adres:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{shop.location.address}</div>
                    <p><strong>Plaats:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{shop.location.city}</div>
                </div>
                <button class="bg-green-500 rounded-lg text-white p-2 mt-2" on:click={openModal}>Bestel QR-Kaartjes</button>
                <a href="/shops/{shop.id}"><button class="bg-blue-500 rounded-lg text-white p-2 mt-2">Bekijk Winkel</button></a>
                <a href="/shops/{shop.id}/edit"><button class="bg-yellow-500 rounded-lg text-white p-2 mt-2">Bewerk Winkel</button></a>
            </div>
            {/if}
        </div>
        {:else}
        <div class="flex justify-center mx-auto">
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
                <h1 class="text-2xl font-bold">Voortgang</h1>
                <h2 class="text-lg">Om voortgang te bekijken is het nodig om in teloggen. Doe dat hieronder:</h2>
                <div class="pt-4">
                    <a href="/login"><button class="bg-green-400 text-white py-2 px-4 rounded hover:bg-green-500 transition duration-300">Login</button></a>
                </div>
            </div>
        </div>
        {/if}

        {#if showQRModal}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" on:click={closeModal}>
            <div class="bg-white p-6 rounded-lg w-4/5 max-w-lg shadow-lg" on:click|stopPropagation>
                <p class="text-lg text-gray-800 mb-4">QR-Kaartjes zijn besteld en onderweg naar het adres van jouw winkel!</p>
                <button class="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300" on:click={closeModal}>Sluiten</button>
            </div>
            </div>
        {/if}
    </main>
</Layout>