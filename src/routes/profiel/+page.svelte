<script>
// @ts-nocheck
    import { onMount } from 'svelte';
    import Layout from "../layout.svelte";

    let user = null;
    onMount(async () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    });

    function logout() {
        // Remove the user from localStorage and set isLoggedIn to false
        localStorage.removeItem('user');
        user = null;
        window.location.href = '/profiel'; // Redirect to home or another page
    }
</script>

<Layout>
    <div class="fixed top-0 left-0 w-full h-full z-0">
        <img src="../background.jpg" alt="Sustainability Background" class="w-full h-full object-cover opacity-50">
        <div class="absolute top-0 left-0 w-full h-full bg-white opacity-20"></div>
    </div>
    <main class="relative py-8 px-4 z-10">
        {#if user}
        <div class="max-w-4xl mx-auto flex justify-center items-center">
            <h1 class="text-3xl mb-4 mx-auto">Goede{new Date().getHours() < 12 ? 'morgen' : new Date().getHours() < 18 ? 'middag' : new Date().getHours() < 22 ? 'avond' : 'nacht'}, {user.name}</h1>
        </div>
        {/if}
        <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            {#if user} 
                <!-- Toon profielinformatie als de gebruiker is ingelogd -->
                <h2 class="text-3xl">Profiel</h2>
                <div class="profile-info">
                    <p><strong>Naam:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{user.name}</div>
                    <p><strong>Email:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{user.email}</div>
                    <p><strong>Vermindering:</strong></p>
                    <div class="bg-gray-200 rounded-full w-full p-2 mb-2">{user.reduction}</div>
                </div>
                <button class="logout-button bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300" on:click={logout}>Uitloggen</button>
            {:else}
                <!-- Toon bericht als de gebruiker niet is ingelogd -->
                <h2 class="text-red-500 text-xl">U bent niet ingelogd!</h2>
                <a href="/login"><button class="login-button bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300">Login</button></a>
            {/if}
        </div>
    </main>
</Layout>