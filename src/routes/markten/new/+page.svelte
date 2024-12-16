<script>
  import { goto } from "$app/navigation";
    import Layout from "../../layout.svelte";

  // Formulier data
  const formData = {
      name: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
      description: "",
      location: {
          city: "",
          address: ""
      }
  };

  // Validatie fouten
  let errors = {};
  let submissionResponse = "";
  let isSubmitting = false;

  // Functie om formulier te valideren
  const validateForm = () => {
      errors = {};

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

  // Functie om formulier te verzenden
  const submitForm = async () => {
      if (!validateForm()) {
          submissionResponse = "Corrigeer de fouten.";
          return;
      }

      isSubmitting = true;
      submissionResponse = "";

      try {
          const response = await fetch("http://localhost:3010/markets/markets", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData)
          });

          if (response.ok) {
              submissionResponse = "Markt succesvol aangemaakt!";
              goto("/markten");
          } else {
              const errorText = await response.text();
              submissionResponse = `Fout: ${errorText}`;
          }
      } catch (error) {
          submissionResponse = `Fout: ${error.message}`;
      } finally {
          isSubmitting = false;
      }
  };
</script>

<Layout>
    <div slot="sidebar-toggle-button"></div>
    <main class="min-h-screen bg-gray-100 flex items-center justify-center">
      <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Nieuwe Markt</h1>
          <form on:submit|preventDefault={submitForm} class="space-y-4">
              <div>
                  <label for="name" class="block text-gray-700 font-medium mb-1">Naam</label>
                  <input placeholder="Boerenmarkt" id="name" type="text" bind:value={formData.name} class="w-full border rounded px-4 py-2" />
                  {#if errors.name}<p class="text-red-500 text-sm">{errors.name}</p>{/if}
              </div>
              <div>
                  <label for="day" class="block text-gray-700 font-medium mb-1">Dag van de week</label>
                  <select id="day" bind:value={formData.dayOfWeek} class="w-full border rounded px-4 py-2">
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
                  <label for="starttime" class="block text-gray-700 font-medium mb-1">Starttijd</label>
                  <input id="starttime" type="time" bind:value={formData.startTime} class="w-full border rounded px-4 py-2" />
                  {#if errors.startTime}<p class="text-red-500 text-sm">{errors.startTime}</p>{/if}
              </div>
              <div>
                  <label for="endtime" class="block text-gray-700 font-medium mb-1">Eindtijd</label>
                  <input id="endtime" type="time" bind:value={formData.endTime} class="w-full border rounded px-4 py-2" />
                  {#if errors.endTime}<p class="text-red-500 text-sm">{errors.endTime}</p>{/if}
                  {#if errors.timeRange}<p class="text-red-500 text-sm">{errors.timeRange}</p>{/if}
              </div>
              <div>
                  <label for="description" class="block text-gray-700 font-medium mb-1">Beschrijving</label>
                  <textarea placeholder="Weekmarkt in Middelburg met allerlei verse soorten groenten en fruit." id="description" bind:value={formData.description} class="w-full border rounded px-4 py-2"></textarea>
                  {#if errors.description}<p class="text-red-500 text-sm">{errors.description}</p>{/if}
              </div>
              <div>
                  <label for="city" class="block text-gray-700 font-medium mb-1">Stad</label>
                  <input placeholder="Middelburg" id="city" type="text" bind:value={formData.location.city} class="w-full border rounded px-4 py-2" />
                  {#if errors.city}<p class="text-red-500 text-sm">{errors.city}</p>{/if}
              </div>
              <div>
                  <label for="address" class="block text-gray-700 font-medium mb-1">Adres</label>
                  <input placeholder="Het Groene Woud, 1" id="address" type="text" bind:value={formData.location.address} class="w-full border rounded px-4 py-2" />
                  {#if errors.address}<p class="text-red-500 text-sm">{errors.address}</p>{/if}
              </div>
              <button
                  type="submit"
                  disabled={isSubmitting}
                  class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              >
                  {isSubmitting ? "Verzenden..." : "Verzend"}
              </button>
          </form>
          {#if submissionResponse}<p class="text-center text-red-500 mt-4">{submissionResponse}</p>{/if}
      </div>
    </main>
</Layout>