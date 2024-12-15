<script>
// @ts-nocheck

import { onMount } from 'svelte';
import Layout from "../layout.svelte";

// @ts-ignore
let user = null; // Houdt de gebruikersinformatie bij
const message = 'U bent niet ingelogd'; // Standaard bericht als gebruiker niet is ingelogd

onMount(() => {
    const storedUser = localStorage.getItem('user'); // Haal de opgeslagen gebruiker uit localStorage

    if (storedUser) {
        user = JSON.parse(storedUser); // Zet de gebruiker als er een is opgeslagen
    }
});
</script>

<Layout>
    
    <div slot="sidebar-toggle-button"></div>
    <div id="profile-container">
        {#if user} 
            <!-- Toon profielinformatie als de gebruiker is ingelogd -->
            <h2>Profiel</h2>
            <div class="profile-info">
                <p><strong>Naam:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Vermindering:</strong> {user.reduction}</p>
            </div>
        {:else}
            <!-- Toon bericht als de gebruiker niet is ingelogd -->
            <h2>{message}</h2>
        {/if}
    </div>
</Layout>

<style>
    /* Algemeen styling voor de pagina */
    #profile-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    h2 {
        color: #333;
        font-size: 24px;
        margin-bottom: 20px;
    }

    .profile-info p {
        font-size: 18px;
        margin: 10px 0;
        color: #555;
    }

    .profile-info strong {
        color: #333;
    }

    /* Styling voor als de gebruiker niet is ingelogd */
    #profile-container h2 {
        color: #ff6347; /* Roodkleur voor foutmelding */
        font-size: 22px;
    }
</style>
