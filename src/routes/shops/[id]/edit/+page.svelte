<script>
// @ts-nocheck

import { onMount } from 'svelte';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import Layout from '../../../layout.svelte';

let shop = null;
let error = null;
let form = {
    name: '',
    location: {
        city: '',
        address: ''
    },
    phoneNumber: '',
    openingHours: {
        monday: '',
        tuesday: '',
        wednesday: '',
        thursday: '',
        friday: '',
        saturday: '',
        sunday: ''
    },
    payingMethods: [],
    image: ''
};
let newPayingMethod = '';
let newImage = null;

// Fetch shop data when the component mounts
onMount(() => {
    console.log('Edit page loaded');
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
            form = { ...shop }; // Populate the form with the shop data
        } else {
            console.error(`Could not load shop with id ${id}:`, res.status);
            shop = null; // Handle gracefully if the shop doesn't load
        }
    } catch (err) {
        console.error(`Error fetching shop with id ${id}:`, err);
        shop = null; // Graceful fallback
    }
};

const updateShop = async () => {
    try {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('location[city]', form.location.city);
        formData.append('location[address]', form.location.address);
        formData.append('phoneNumber', form.phoneNumber);
        formData.append('openingHours[monday]', form.openingHours.monday);
        formData.append('openingHours[tuesday]', form.openingHours.tuesday);
        formData.append('openingHours[wednesday]', form.openingHours.wednesday);
        formData.append('openingHours[thursday]', form.openingHours.thursday);
        formData.append('openingHours[friday]', form.openingHours.friday);
        formData.append('openingHours[saturday]', form.openingHours.saturday);
        formData.append('openingHours[sunday]', form.openingHours.sunday);
        formData.append('payingMethods', JSON.stringify(form.payingMethods));
        if (newImage) {
            formData.append('image', newImage);
        }

        // Log formData for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        const response = await fetch(`http://localhost:3010/shops/shop/${shop.id}`, {
            method: "PUT",
            body: formData
        });

        // Log response for debugging
        console.log('Response status:', response.status);
        const responseBody = await response.text();
        console.log('Response body:', responseBody);

        if (!response.ok)
            throw new Error(`Failed to update shop: ${response.statusText}`);

        goto(`/shops/${shop.id}`);
    } catch (err) {
        error = err.message;
        console.error('Error updating shop:', err);
    }
};

const addPayingMethod = () => {
    if (newPayingMethod.trim() !== '') {
        form.payingMethods = [...form.payingMethods, newPayingMethod.trim()];
        newPayingMethod = '';
    }
};

const removePayingMethod = (index) => {
    form.payingMethods = form.payingMethods.filter((_, i) => i !== index);
};

const handleImageChange = (event) => {
    newImage = event.target.files[0];
};

</script>

<Layout>
    <div slot="sidebar">
        <!-- Sidebar content specific to this page -->
        <h2>Custom Sidebar Content</h2>
        <p>This is specific to the shop edit page.</p>
    </div>

    <main class="min-h-screen bg-gray-100 py-8 px-4">
        {#if error}
            <p class="text-center text-red-500 font-medium">Error: {error}</p>
        {:else if !shop}
            <p class="text-center text-gray-500 font-medium">
                Shop details aan het laden...
            </p>
        {:else}
            <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">Bewerk Winkel</h1>
                <form on:submit|preventDefault={updateShop}>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="name">Naam</label>
                        <input
                            type="text"
                            id="name"
                            bind:value={form.name}
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="city">Stad</label>
                        <input
                            type="text"
                            id="city"
                            bind:value={form.location.city}
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="address">Adres</label>
                        <input
                            type="text"
                            id="address"
                            bind:value={form.location.address}
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="phoneNumber">Telefoonnummer</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            bind:value={form.phoneNumber}
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="payingMethods">Betaalmethoden</label>
                        <div class="flex items-center mb-2">
                            <input
                                type="text"
                                id="newPayingMethod"
                                bind:value={newPayingMethod}
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <button
                                type="button"
                                on:click={addPayingMethod}
                                class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Toevoegen
                            </button>
                        </div>
                        <ul>
                            {#each form.payingMethods as method, index}
                                <li class="flex items-center mb-2">
                                    <span class="flex-1">{method}</span>
                                    <button
                                        type="button"
                                        on:click={() => removePayingMethod(index)}
                                        class="ml-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >
                                        Verwijderen
                                    </button>
                                </li>
                            {/each}
                        </ul>
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="image">Afbeelding</label>
                        <input
                            type="file"
                            id="image"
                            on:change={handleImageChange}
                            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="openingHours">Openingstijden</label>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="monday">Maandag</label>
                                <input
                                    type="text"
                                    id="monday"
                                    bind:value={form.openingHours.monday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="tuesday">Dinsdag</label>
                                <input
                                    type="text"
                                    id="tuesday"
                                    bind:value={form.openingHours.tuesday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="wednesday">Woensdag</label>
                                <input
                                    type="text"
                                    id="wednesday"
                                    bind:value={form.openingHours.wednesday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="thursday">Donderdag</label>
                                <input
                                    type="text"
                                    id="thursday"
                                    bind:value={form.openingHours.thursday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="friday">Vrijdag</label>
                                <input
                                    type="text"
                                    id="friday"
                                    bind:value={form.openingHours.friday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="saturday">Zaterdag</label>
                                <input
                                    type="text"
                                    id="saturday"
                                    bind:value={form.openingHours.saturday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="sunday">Zondag</label>
                                <input
                                    type="text"
                                    id="sunday"
                                    bind:value={form.openingHours.sunday}
                                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <button
                            type="submit"
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Opslaan
                        </button>
                        <a
                            href={`/shops/${shop.id}`}
                            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                        >
                            Annuleren
                        </a>
                    </div>
                </form>
            </div>
        {/if}
    </main>
</Layout>

<style>
    main {
        padding: 2rem;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
    }
    h1 {
        font-size: 2.5em;
        margin-bottom: 0.5em;
        color: #333;
    }
    label {
        font-size: 1em;
        color: #333;
    }
    input {
        margin-bottom: 1em;
    }
</style>