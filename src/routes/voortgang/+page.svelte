<script>
    // @ts-nocheck
    
        import { onMount } from "svelte";
        import Layout from "../layout.svelte";
        import { Card, Toggle } from 'flowbite-svelte';
        
        let showModal = false;
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
    
        let user = null;
        onMount(async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                user = JSON.parse(storedUser);
                
                if (user.reduction >= 500) {
                    user.level += 1;
                    user.reduction -= 500;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
        });
    
        function openModal(cardId) {
            const requiredLevel = cardRequirements[cardId];
            if (user && user.level >= requiredLevel) {
                selectedCard = cardId;
                showModal = true;
            }
        }
    
        function closeModal() {
            showModal = false;
            selectedCard = null;
        }
    </script>
    
    <Layout>
        <div class="flex flex-col items-center justify-start p-8 bg-gray-100 rounded-lg shadow-lg">
            <div class="w-full mb-10 flex-grow">
                <h3 class="text-2xl font-semibold text-gray-800 mb-2">Voortgangsdetails</h3>
                <p class="text-lg text-gray-600 mb-5">Je voortgang wordt hier weergegeven op basis van je CO2-reductie.</p>
    
                {#if user}
                    <div class="text-center mb-5">
                        <p class="text-xl font-bold text-gray-800">Hallo, {user.name}!</p>
                        <p class="text-lg text-gray-800">Je Level is: <strong>{user.level}</strong></p>
                    </div>
    
                    <div class="w-full h-5 bg-gray-200 rounded-full my-5">
                        <div class="h-full rounded-full bg-green-500" style="width: {Math.round((user.reduction/500)*100)}%;"></div>
                    </div>
    
                    <p class="text-lg text-green-600 font-medium">Je hebt {((user.level-1) * 500) + user.reduction}kg CO2 bespaard.</p>
                {:else}
                    <p class="text-lg text-red-600 font-medium">Je bent niet ingelogd. Log in om je voortgang te bekijken.</p>
                {/if}
            </div>
    
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {#each Object.keys(cardRequirements) as cardId}
                    <div class="relative mb-5 cursor-pointer" role="button" tabindex="0" on:click={() => openModal(cardId)} on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openModal(cardId); }} aria-label="Bekijk details voor {cardId}">
                        <div class="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl">
                            <div class="flex flex-col items-center">
                                <img class="w-full h-52 object-cover" src="src\routes\voortgang\korting.jpg" alt="{cardId}">
                                <div class="p-5 text-center">
                                    <h5 class="text-xl font-semibold text-gray-800">{cardTitles[cardId]}</h5>
                                </div>
                            </div>
                        </div>
                        {#if user && user.level < cardRequirements[cardId]}
                            <div class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                                <span class="text-4xl text-red-600">✖</span>
                            </div>
                        {/if}
                    </div>
                {/each}
    
                {#if showModal}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn" on:click={closeModal}>
                        <div class="bg-white p-6 rounded-lg w-4/5 max-w-lg shadow-lg" on:click|stopPropagation>
                            <h2 class="text-2xl font-bold text-gray-800 mb-3">KORTING</h2>
                            <p class="text-lg text-gray-800 mb-5">{modalTexts[selectedCard]}</p>
                            <button class="bg-red-600 text-white px-4 py-2 rounded-md text-lg" on:click={closeModal}>Sluiten</button>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </Layout>
    