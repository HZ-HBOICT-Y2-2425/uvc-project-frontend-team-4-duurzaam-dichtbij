<script>
// @ts-nocheck

    import { onMount } from "svelte";
    import Layout from "../layout.svelte";
    import { Card, Toggle } from 'flowbite-svelte';
    
    let user = null;
    let reduction = 0;
    let rewardMessage = '';
    let showModal = false;
    let showModal2 = false;
    let selectedCard = null;

    const cardRequirements = {
        card1: 3,
        card2: 4,
        card3: 5,
        card4: 6
    };

    const modalTexts = {
        card1: "je krijgt 5% korting op je volgende aankoop",
        card2: "je krijgt 5% korting op je volgende aankoop",
        card3: "je krijgt 10% korting op je volgende aankoop",
        card4: "je krijgt 15% korting op je volgende aankoop",
    };

    const cardTitles = {
        card1: "unlock level 3",
        card2: "unlock level 4",
        card3: "unlock level 5",
        card4: "unlock level 6"
    };

    onMount(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
            reduction = user.reduction;
            setRewardMessage(reduction);
        }
    });

    function openModal(cardId) {
        const requiredLevel = cardRequirements[cardId];
        if (user && user.level >= requiredLevel) {
            selectedCard = cardId;
            showModal = true;
        }
    }

    function openModal2() {
        showModal2 = true;
    }

    function closeModal() {
        showModal = false;
        showModal2 = false;
        selectedCard = null;
    }

    function setRewardMessage(reduction) {
        if (reduction >= 100) {
            rewardMessage = 'Goed gedaan! Je hebt 100% reductie bereikt!';
            if (user) {
                user.level += 1;
                user.reduction = 0;
                localStorage.setItem('user', JSON.stringify(user));
            }
        } else if (reduction > 0) {
            rewardMessage = `Je hebt ${reduction} reductie bereikt. Ga zo door!`;
        } else {
            rewardMessage = 'Je hebt nog geen CO2-reductie bereikt. Start nu!';
        }
    }
</script>

<Layout>
    <div class="content-container">
        <button class="open-modal-btn" on:click={openModal2}>bestel QR</button>
        <div class="progress-section">
            <h3 class="details-title">Voortgangsdetails</h3>
            <p class="details-text">Je voortgang wordt hier weergegeven op basis van je CO2-reductie.</p>

            {#if user}
                <div class="user-info">
                    <p class="greeting">Hallo, {user.name}!</p>
                    <p class="reduction-info">Je Level is: <strong>{user.level}</strong></p>
                </div>

                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: {reduction}%;"></div>
                </div>

                <p class="reward-message">{rewardMessage}</p>
            {:else}
                <p class="error-message">Je bent niet ingelogd. Log in om je voortgang te bekijken.</p>
            {/if}
        </div>

        <div class="cards-container">
            {#each Object.keys(cardRequirements) as cardId}
                <div class="card-section" role="button" tabindex="0" on:click={() => openModal(cardId)} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(cardId); }} aria-label="Bekijk details voor {cardId}">
                    <div class="card-wrapper">
                        <div class="card-inner">
                            <img class="card-img" src="src\routes\voortgang\korting.jpg" alt="{cardId}">
                            <div class="card-content">
                                <h5 class="card-title">{cardTitles[cardId]}</h5>
                            </div>
                        </div>
                    </div>
                    {#if user && user.level < cardRequirements[cardId]}
                        <div class="locked-overlay">
                            <span class="locked-icon">✖</span>
                        </div>
                    {/if}
                </div>
            {/each}

            {#if showModal}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="modal-overlay" on:click={closeModal}>
                    <div class="modal-content" on:click|stopPropagation>
                        <h2 class="modal-title">KORTING</h2>
                        <p class="modal-text">{modalTexts[selectedCard]}</p>
                        <button class="modal-close" on:click={closeModal}>Sluiten</button>
                    </div>
                </div>
            {/if}

            {#if showModal2}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="modal-overlay" on:click={closeModal}>
                    <div class="modal-content" on:click|stopPropagation>
                        <p class="modal-text">QR zijn besteld</p>
                        <button class="modal-close" on:click={closeModal}>Sluiten</button>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</Layout>

<style>
 

    .content-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 30px;
        background-color: #f7f8f9;
        border-radius: 15px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .progress-section {
        width: 100%;
        margin-bottom: 40px;
        flex-grow: 1;
    }

    .details-title {
        font-size: 2rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 10px;
    }

    .details-text {
        font-size: 1.1rem;
        color: #7f8c8d;
        margin-bottom: 20px;
    }

    .user-info {
        text-align: center;
        margin-bottom: 20px;
    }

    .greeting {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
    }

    .reduction-info {
        font-size: 1.2rem;
        color: #2c3e50;
    }

    .progress-bar-container {
        width: 100%;
        height: 20px;
        background-color: #ecf0f1;
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
        color: #2ecc71;
        font-weight: 500;
    }

    .error-message {
        font-size: 1.2rem;
        color: #e74c3c;
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
        flex: 0 0 calc(50% - 20px);
        margin-bottom: 20px;
        position: relative;
    }

    .card-wrapper {
        background: white;
        border-radius: 10px;
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
        transition: all 0.3s ease-in-out;
    }

    .card-wrapper:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    }

    .card-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .card-img {
        width: 100%;
        height: 200px;
        object-fit: cover;
    }

    .card-content {
        padding: 20px;
        text-align: center;
    }

    .card-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #34495e;
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
        color: #e74c3c;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease-out;
    }

    .modal-content {
        background-color: white;
        padding: 25px;
        border-radius: 15px;
        width: 80%;
        max-width: 500px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }

    .modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #34495e;
        margin-bottom: 10px;
    }

    .modal-text {
        font-size: 1.2rem;
        color: #34495e;
        margin-bottom: 20px;
    }

    .modal-close {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 10px 20px;
        cursor: pointer;
        border-radius: 5px;
        font-size: 1rem;
    }

    .open-modal-btn {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 10px 20px;
        font-size: 1.1rem;
        border-radius: 5px;
        cursor: pointer;
        margin-top: 20px;
    }

    .open-modal-btn:hover {
        background-color: #45a049;
    }
</style>
