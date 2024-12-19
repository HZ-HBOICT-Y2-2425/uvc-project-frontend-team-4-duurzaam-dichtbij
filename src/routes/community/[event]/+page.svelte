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
  
    // Fetch market details
    const fetchEventDetails = async (id) => {
      try {
        const response = await fetch(`http://localhost:3010/events/event/${id}`);
        if (!response.ok) throw new Error(`Failed to fetch event details: ${response.statusText}`);
        event = await response.json();
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
  
    // Load data on mount
    onMount(async () => {
      const eventId = $page.params.event;
      await fetchEventDetails(eventId);
    });
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
          <a href="/community/{$page.params.event}/edit" class="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition">
            Bewerken
          </a>
          <button on:click={deleteEvent(event.id)} class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition">
            Verwijderen
          </button>
        </div>
      </div>
    {/if}
  </main>
  