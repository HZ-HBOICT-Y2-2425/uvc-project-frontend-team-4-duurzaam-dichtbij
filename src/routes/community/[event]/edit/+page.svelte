<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  export let data; // Data passed from the server

  // Form data state
  let formData = {
    name: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
    location: {
      city: "",
      address: "",
    },
  };

  // Temporary fields for date and time inputs
  let startDate = "";
  let startTime = "";
  let endDate = "";
  let endTime = "";

  // State for form submission feedback
  let submissionResponse = "";
  let isSubmitting = false;

  // Validation errors
  let errors = {};

  // Function to combine date and time into ISO 8601 string
  const combineDateTime = (date, time) => {
    if (date && time) {
      return new Date(`${date}T${time}`).toISOString();
    }
    return "";
  };

  onMount(() => {
    if (data.event) {
      const {
        name,
        type,
        startDate: sDate,
        endDate: eDate,
        description,
        location,
      } = data.event;

      formData = {
        name,
        type, // Set the type here
        description,
        location: {
          city: location.city,
          address: location.address,
        },
      };

      // Extract date and time parts from ISO 8601 datetime
      const start = new Date(sDate);
      const end = new Date(eDate);

      startDate = start.toISOString().split("T")[0];
      startTime = start.toISOString().split("T")[1].slice(0, 5);
      endDate = end.toISOString().split("T")[0];
      endTime = end.toISOString().split("T")[1].slice(0, 5);
    }
  });

  // Validation logic
  const validateForm = () => {
    errors = {}; // Reset errors

    if (!formData.name.trim()) errors.name = "Event name is required.";
    if (!formData.type) errors.type = "Categorie is verplicht.";
    if (!startDate || !startTime)
      errors.startDate = "Start date and time are required.";
    if (!endDate || !endTime)
      errors.endDate = "End date and time are required.";
    if (
      combineDateTime(startDate, startTime) >= combineDateTime(endDate, endTime)
    ) {
      errors.dateRange =
        "Start date and time must be before end date and time.";
    }
    if (!formData.description.trim())
      errors.description = "Event description is required.";
    if (!formData.location.city.trim()) errors.city = "City is required.";
    if (!formData.location.address.trim())
      errors.address = "Address is required.";

    return Object.keys(errors).length === 0;
  };

  // Form submission
  const submitForm = async () => {
    submissionResponse = "";

    if (!validateForm()) {
      submissionResponse = "Please fix the highlighted errors.";
      return;
    }

    isSubmitting = true;

    formData.startDate = combineDateTime(startDate, startTime);
    formData.endDate = combineDateTime(endDate, endTime);

    try {
      const response = await fetch(
        `http://localhost:3010/events/event/${data.event.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        submissionResponse = "Event updated successfully!";
        goto(`/community/${data.event.id}`);
      } else {
        submissionResponse = `Error: ${response.statusText}`;
      }
    } catch (error) {
      submissionResponse = `Error: ${error.message}`;
    } finally {
      isSubmitting = false;
    }
  };
</script>

<main class="min-h-screen bg-gray-100 flex items-center justify-center">
  <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
    <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">
      Bewerk evenement
    </h1>
    <form class="space-y-4" on:submit|preventDefault={submitForm}>
      <div>
        <label for="name" class="block text-gray-700 font-medium mb-1">Naam</label>
        <input
          id="name"
          type="text"
          placeholder="Samen koken"
          bind:value={formData.name}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        {#if errors.name}
          <p class="text-red-500 text-sm mt-1">{errors.name}</p>
        {/if}
      </div>

      <div>
        <label for="type" class="block text-gray-700 font-medium mb-1">Categorie</label>
        <select
          id="type"
          placeholder="Selecteer een categorie"
          bind:value={formData.type}
          class="w-full border rounded px-4 py-2"
        >
          <option value="Kookgroep">Kookgroep</option>
          <option value="Boodschappen">Boodschappen</option>
          <option value="Workshop">Workshop</option>
          <option value="Proeverij">Proeverij</option>
          <option value="Rondleiding">Rondleiding</option>
          <option value="Kinderen">Kinderen</option>
          <option value="Overig">Overig</option>
        </select>
        {#if errors.type}
          <p class="text-red-500 text-sm mt-1">{errors.type}</p>
        {/if}
      </div>

      <div>
        <label for="startdate" class="block text-gray-700 font-medium mb-1">Startdatum</label>
        <input
          id="startdate"
          type="date"
          bind:value={startDate}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <label for="starttime" class="block text-gray-700 font-medium mb-1 mt-2"
          >Begintijd</label
        >
        <input
          id="starttime"
          type="time"
          bind:value={startTime}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        {#if errors.startDate}
          <p class="text-red-500 text-sm mt-1">{errors.startDate}</p>
        {/if}
      </div>

      <div>
        <label for="enddate" class="block text-gray-700 font-medium mb-1">Einddatum</label>
        <input
          id="enddate"
          type="date"
          bind:value={endDate}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        <label for="endtime" class="block text-gray-700 font-medium mb-1 mt-2">Eindtijd</label
        >
        <input
          id="endtime"
          type="time"
          bind:value={endTime}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
        {#if errors.endDate}
          <p class="text-red-500 text-sm mt-1">{errors.endDate}</p>
        {/if}
        {#if errors.dateRange}
          <p class="text-red-500 text-sm mt-1">{errors.dateRange}</p>
        {/if}
      </div>

      <div>
        <label for="description" class="block text-gray-700 font-medium mb-1">Beschrijving</label>
        <textarea
          id="description"
          bind:value={formData.description}
          placeholder="Kookgroep waarbij we samen allerlei lekkernijen gaan bereiden met boerenproducten."
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
        {isSubmitting ? "Updating..." : "Update"}
      </button>
    </form>
    {#if submissionResponse}
      <p class="mt-4 text-center font-medium text-red-500">
        {submissionResponse}
      </p>
    {/if}
  </div>
</main>
