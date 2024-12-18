<script>
    // @ts-nocheck
    
    import { onMount } from "svelte";
    import Layout from "../layout.svelte";

    import { Card, Toggle } from 'flowbite-svelte';
    
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
    <div class="content-container">
        <div class="progress-section">
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

        <!-- Combineer hier de card componenten -->
        <div class="cards-container">
            <!-- Eerste card - only unlocked for level >= 3 -->
            <div class="card-section" class:locked="{user && user.level < 3}">
                <a href="/login" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technolog</h5>
                    
                    </div>
                </a>
                {#if user && user.level < 3}
                    <div class="locked-overlay">
                        <span class="locked-icon">✖</span> <!-- Cross icon -->
                    </div>
                {/if}
            </div>

            <!-- Tweede card - only unlocked for level >= 4 -->
            <div class="card-section" class:locked="{user && user.level < 4}">
                <a href="/login" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Second technology acquisition</h5>
                  
                    </div>
                </a>
                {#if user && user.level < 4}
                    <div class="locked-overlay">
                        <span class="locked-icon">✖</span> <!-- Cross icon -->
                    </div>
                {/if}
            </div>

            <!-- Derde card - only unlocked for level >= 5 -->
            <div class="card-section" class:locked="{user && user.level < 5}">
                <a href="/login" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Third technology acquisition</h5>
                    
                    </div>
                </a>
                {#if user && user.level < 5}
                    <div class="locked-overlay">
                        <span class="locked-icon">✖</span> <!-- Cross icon -->
                    </div>
                {/if}
            </div>
            <div class="card-section" class:locked="{user && user.level < 6}">
                <a href="/login" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                    <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="" alt="">
                    <div class="flex flex-col justify-between p-4 leading-normal">
                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Third technology acquisition</h5>
                    
                    </div>
                </a>
                {#if user && user.level < 6}
                    <div class="locked-overlay">
                        <span class="locked-icon">✖</span> <!-- Cross icon -->
                    </div>
                {/if}
            </div>

            <!-- Voeg andere cards toe zoals hierboven -->
        </div>
    </div>
</Layout>

<style>
    html, body {
        height: 100%;
        margin: 0;
    }

    .content-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start; /* Align content to the top */
        height: 100vh;  /* Full viewport height */
        padding: 20px;
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .progress-section {
        width: 100%;
        margin-bottom: 40px;
        flex-grow: 1;  /* Allow progress section to grow and take available space */
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

    .cards-container {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        justify-content: center;
        width: 100%;
    }

    .card-section {
        flex: 0 0 calc(50% - 20px); /* Make each card 50% width minus the gap */
        margin-bottom: 20px;
        position: relative; /* Needed for positioning the overlay */
    }

    .locked-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .locked-icon {
        font-size: 3rem;
        color: #f44336;
    }

    /* For smaller screens, ensure cards stack */
    @media (max-width: 768px) {
        .card-section {
            flex: 0 0 100%; /* Stack cards on smaller screens */
        }
    }
</style>
