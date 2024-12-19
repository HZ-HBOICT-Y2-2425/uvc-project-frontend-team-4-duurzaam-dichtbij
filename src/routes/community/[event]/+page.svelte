<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // To access route parameters
  import { goto, afterNavigate } from '$app/navigation';

  const base = '/';
  let previousPage = base;

  afterNavigate(({from}) => {
      console.log(base);
      previousPage = from?.url.pathname || previousPage;
      if (previousPage.toLocaleLowerCase() === window.location.pathname.toLocaleLowerCase() || previousPage.replace(' ', '') == '') {
          previousPage = base;
      }
  })

  let event = null; // Market data
  let error = null;
  let storedUser = null;
  let applied = null; // Track applied status

  // Load data on mount
  onMount(async () => {
    const eventId = $page.params.event;
    storedUser = JSON.parse(localStorage.getItem("user"));
    await fetchEventDetails(eventId);
    if (storedUser) {
      await fetchAppliedStatus(eventId, storedUser.id);
    }
  });

  // Fetch event details
  const fetchEventDetails = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/events/event/${id}`);
      if (!response.ok) throw new Error(`Failed to fetch event details: ${response.statusText}`);
      event = await response.json();
    } catch (err) {
      error = err.message;
    }
  };

  // Check if user is applied
  const fetchAppliedStatus = async (eventId, userId) => {
    try {
      const response = await fetch(`http://localhost:3010/events/events/${eventId}/apply/${userId}`);
      if (!response.ok) throw new Error(`Failed to fetch application status: ${response.statusText}`);
      applied = await response.json();
    } catch (err) {
      error = err.message;
    }
  };

  // Apply to event
  const applyEvent = async (eventId, userId) => {
    try {
      const response = await fetch(`http://localhost:3010/events/events/${eventId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userId }),
      });
      if (!response.ok) throw new Error(`Failed to apply: ${response.statusText}`);
      await fetchAppliedStatus(eventId, userId); // Update applied status
    } catch (err) {
      error = err.message;
    }
  };

  // De-apply from event
  const deApplyEvent = async (eventId, userId) => {
    try {
      const response = await fetch(`http://localhost:3010/events/events/${eventId}/apply`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: userId }),
      });
      if (!response.ok) throw new Error(`Failed to de-apply: ${response.statusText}`);
      await fetchAppliedStatus(eventId, userId); // Update applied status
    } catch (err) {
      error = err.message;
    }
  };

  const deleteEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3010/events/event/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error(`Failed to delete event: ${response.statusText}`);
      goto("/community");
    } catch (err) {
      error = err.message;
    }
  };
</script>

<main class="min-h-screen bg-gray-100 py-8 px-4">
{#if error}
  <p class="text-center text-red-500 font-medium">Error: {error}</p>
{:else if !event}
  <p class="text-center text-gray-500 font-medium">Evenementdetails aan het laden...</p>
{:else}
  <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
    <div class="flex justify-between">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
      <button id='copylink' on:click={() => { const copyButton = document.getElementById('copylink'); if (copyButton) copyButton.innerText = 'Link gekopieerd!'; navigator.clipboard.writeText(window.location.href); }} class="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition">Deel</button>
    </div>
    
    <p class="text-gray-600 mb-6">{event.description}</p>
    
    <div class="flex flex-wrap gap-6">
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Details</h2>
        <ul class="text-gray-600 space-y-2">
          <li><strong>Categorie</strong> {event.type}</li>
          <li><strong>Begin</strong> {new Date(event.startDate).toLocaleString()}</li>
          <li><strong>Eind</strong> {new Date(event.endDate).toLocaleString()}</li>
        </ul>
      </div>
      <div class="flex-1">
        <h2 class="text-lg font-semibold text-gray-700 mb-2">Locatie</h2>
        <ul class="text-gray-600 space-y-2">
          <li><strong>Stad</strong> {event.location.city}</li>
          <li><strong>Adres</strong> {event.location.address}</li>
        </ul>
      </div>
    </div>

    <div class="mt-8 text-center flex justify-between">
      <a href="{previousPage}" class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition">
        Terug
      </a>
      {#if storedUser}
        {#if applied === null}
          <button class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition">
            Aanmeldstatus ophalen...
          </button>
        {:else if applied}
          <button on:click={() => deApplyEvent(event.id, storedUser.id)} class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition">
            Afmelden
          </button>
        {:else}
          <button on:click={() => applyEvent(event.id, storedUser.id)} class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition">
            Aanmelden
          </button>
        {/if}
      {/if}      
      <a href="/community/{event.id}/edit" class="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition">
        Bewerken
      </a>
      <button on:click={() => deleteEvent(event.id)} class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition">
        Verwijderen
      </button>
    </div>
  </div>
{/if}
</main>
