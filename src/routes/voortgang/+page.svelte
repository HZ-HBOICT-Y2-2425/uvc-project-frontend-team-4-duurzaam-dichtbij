<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import Layout from "../layout.svelte";

    let user = null;
    let reduction = 0;
    let rewardMessage = '';

    // Zorg ervoor dat de gebruiker wordt geladen bij het laden van de pagina
    onMount(() => {
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
            user = JSON.parse(storedUser);  // Haal de opgeslagen gebruiker op
            reduction = user.reduction;  // Stel de voortgang in op basis van de CO2-reductie
            setRewardMessage(reduction); // Update de beloningstekst op basis van de voortgang
        } else {
            console.log('Geen gebruiker gevonden in localStorage');
        }
    });

    // Functie om de beloningstekst in te stellen afhankelijk van de voortgang
    function setRewardMessage(reduction) {
        if (reduction >= 150) {
            rewardMessage = 'Fantastisch! Je hebt 150% reductie bereikt!';
        } else if (reduction >= 100) {
            rewardMessage = 'Goed gedaan! Je hebt 100% reductie bereikt!';
        } else if (reduction > 0) {
            rewardMessage = `Je hebt ${reduction}% reductie bereikt. Ga zo door!`;
        } else {
            rewardMessage = 'Je hebt nog geen CO2-reductie bereikt. Start nu!';
        }
    }
</script>

<Layout>
    <div slot="sidebar-toggle-button"></div>
    <div class="content-container">
        <h3 class="details-title">Voortgangsdetails</h3>
        <p class="details-text">Je voortgang wordt hier weergegeven op basis van je CO2-reductie.</p>

        <!-- Check of de gebruiker ingelogd is en toon de voortgang -->
        {#if user}
            <div class="user-info">
                <p class="greeting">Hallo, {user.name}!</p>
                <p class="reduction-info">Je CO2-reductie is: <strong>{reduction}%</strong></p>
            </div>

            <!-- Voortgangsbalk -->
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: {reduction}%;"></div>
            </div>

            <p class="reward-message">{rewardMessage}</p>
        {:else}
            <p class="error-message">Je bent niet ingelogd. Log in om je voortgang te bekijken.</p>
        {/if}
    </div>
</Layout>

<style>
    .content-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
    }

    .details-title {
        font-size: 1.8rem;
        color: #333;
        margin-bottom: 15px;
    }

    .details-text {
        font-size: 1.1rem;
        color: #555;
        margin-bottom: 20px;
    }

    .user-info {
        text-align: center;
        margin-bottom: 20px;
    }

    .greeting {
        font-size: 1.5rem;
        font-weight: 600;
        color: #333;
    }

    .reduction-info {
        font-size: 1.2rem;
        color: #333;
    }

    .progress-bar-container {
        width: 100%;
        height: 20px;
        background-color: #e0e0e0;
        border-radius: 10px;
        margin: 20px 0;
    }

    .progress-bar {
        height: 100%;
        border-radius: 10px;
        background-color: #4caf50;
    }

    .reward-message {
        font-size: 1.2rem;
        color: #4caf50;
        font-weight: 500;
    }

    .error-message {
        font-size: 1.2rem;
        color: #f44336;
        font-weight: 500;
    }
</style>
