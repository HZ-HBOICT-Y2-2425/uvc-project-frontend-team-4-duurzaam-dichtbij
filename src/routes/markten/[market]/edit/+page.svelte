<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
    import Layout from "../../../layout.svelte";
  export let data; // Data passed from the server

  // Form data state
  let formData = {
    name: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
    description: "",
    location: {
      city: "",
      address: "",
    },
  };

  // State for form submission feedback
  let submissionResponse = "";
  let isSubmitting = false;

  // Validation errors
  let errors = {};

  // Populate formData with the market data from the server
  onMount(() => {
    if (data.market) {
      const { name, dayOfWeek, startTime, endTime, description, location } = data.market;

      formData = { name, description, location: { city: location.city, address: location.address }, dayOfWeek, startTime, endTime };
    }
  });

  // Validation logic
  const validateForm = () => {
    errors = {}; // Reset errors

    if (!formData.name.trim()) errors.name = "Naam is verplicht.";
    if (!formData.dayOfWeek) errors.dayOfWeek = "Dag van de week is verplicht.";
    if (!formData.startTime) errors.startTime = "Starttijd is verplicht.";
    if (!formData.endTime) errors.endTime = "Eindtijd is verplicht.";
    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.timeRange = "Starttijd moet voor eindtijd liggen.";
    }
    if (!formData.description.trim()) errors.description = "Beschrijving is verplicht.";
    if (!formData.location.city.trim()) errors.city = "Stad is verplicht.";
    if (!formData.location.address.trim()) errors.address = "Adres is verplicht.";

    return Object.keys(errors).length === 0;
  };

  // Form submission
  const submitForm = async () => {
    submissionResponse = "";

    if (!validateForm()) {
      submissionResponse = "Corrigeer de fouten.";
      return;
    }

    isSubmitting = true;

    try {
      const response = await fetch(`http://localhost:3010/markets/market/${data.market.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        submissionResponse = "Markt succesvol bijgewerkt!";
        goto(`/markten/${data.market.id}`);
      } else {
        submissionResponse = `Fout: ${response.statusText}`;
      }
    } catch (error) {
      submissionResponse = `Fout: ${error.message}`;
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Layout>
  <main class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
      <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Bewerk Markt</h1>
      <form class="space-y-4" on:submit|preventDefault={submitForm}>
        <div>
          <label for="name" class="block text-gray-700 font-medium mb-1">Naam</label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            placeholder="Boerenmarkt"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          {#if errors.name}
            <p class="text-red-500 text-sm mt-1">{errors.name}</p>
          {/if}
        </div>
      
        <div>
          <label for="day" class="block text-gray-700 font-medium mb-1">Dag van de week</label>
          <select id="day" bind:value={formData.dayOfWeek} class="w-full border rounded px-4 py-2">
            <option value="">Selecteer een dag</option>
            <option value="maandag">Maandag</option>
            <option value="dinsdag">Dinsdag</option>
            <option value="woensdag">Woensdag</option>
            <option value="donderdag">Donderdag</option>
            <option value="vrijdag">Vrijdag</option>
            <option value="zaterdag">Zaterdag</option>
            <option value="zondag">Zondag</option>
          </select>
          {#if errors.dayOfWeek}<p class="text-red-500 text-sm">{errors.dayOfWeek}</p>{/if}
        </div>
      
        <div>
          <label for="start-time" class="block text-gray-700 font-medium mb-1">Starttijd</label>
          <input
            id="start-time"
            type="time"
            bind:value={formData.startTime}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          {#if errors.startTime}
            <p class="text-red-500 text-sm mt-1">{errors.startTime}</p>
          {/if}
        </div>
      
        <div>
          <label for="end-time" class="block text-gray-700 font-medium mb-1">Eindtijd</label>
          <input
            id="end-time"
            type="time"
            bind:value={formData.endTime}
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          {#if errors.endTime}
            <p class="text-red-500 text-sm mt-1">{errors.endTime}</p>
          {/if}
          {#if errors.timeRange}
            <p class="text-red-500 text-sm mt-1">{errors.timeRange}</p>
          {/if}
        </div>
      
        <div>
          <label for="description" class="block text-gray-700 font-medium mb-1">Beschrijving</label>
          <textarea
            id="description"
            bind:value={formData.description}
            placeholder="Weekmarkt in Middelburg met allerlei verse soorten groenten en fruit."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          ></textarea>
          {#if errors.description}
            <p class="text-red-500 text-sm mt-1">{errors.description}</p>
          {/if}
        </div>
      
        <div>
          <h2 class="text-lg font-bold text-gray-800 mb-2">Locatie</h2>
          <label for="city" class="block text-gray-700 font-medium mb-1">Stad</label>
          <input
            id="city"
            type="text"
            bind:value={formData.location.city}
            placeholder="Middelburg"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          {#if errors.city}
            <p class="text-red-500 text-sm mt-1">{errors.city}</p>
          {/if}
        
          <label for="address" class="block text-gray-700 font-medium mb-1">Adres</label>
          <input
            id="address"
            type="text"
            bind:value={formData.location.address}
            placeholder="Het Groene Woud, 1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
          />
          {#if errors.address}
            <p class="text-red-500 text-sm mt-1">{errors.address}</p>
          {/if}
        </div>
      
        <button
          type="submit"
          disabled={isSubmitting}
          class="w-full bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Bijwerken..." : "Bijwerken"}
        </button>
      </form>
      {#if submissionResponse}
        <p class="mt-4 text-center font-medium text-red-500">{submissionResponse}</p>
      {/if}
    </div>
  </main>
</Layout>