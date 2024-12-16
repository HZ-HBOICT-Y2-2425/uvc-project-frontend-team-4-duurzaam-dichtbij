<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // To access route parameters
  import { goto } from "$app/navigation";
    import Layout from "../../layout.svelte";

  let market = null; // Market data
  let error = null;

  // Fetch market details
  const fetchMarketDetails = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3010/markets/market/${id}`,
      );
      if (!response.ok)
        throw new Error(
          `Failed to fetch market details: ${response.statusText}`,
        );
      market = await response.json();
    } catch (err) {
      error = err.message;
    }
  };

  const deleteMarket = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3010/markets/market/${id}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok)
        throw new Error(`Failed to delete market: ${response.statusText}`);
      goto("/markten");
    } catch (err) {
      error = err.message;
    }
  };

  const copyLink = () => {
    const copyButton = document.getElementById("copylink");
    if (copyButton) copyButton.innerText = "Link gekopieerd!";
    navigator.clipboard.writeText(window.location.href);
  };

  const verify = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3010/markets/market/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: true }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to verify market: ${response.statusText}`);
      market.verified = true; // Update the state
    } catch (err) {
      error = err.message;
    }
  };

  const deVerify = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3010/markets/market/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verified: false }),
        },
      );
      if (!response.ok)
        throw new Error(`Failed to deverify market: ${response.statusText}`);
      market.verified = false; // Update the state
    } catch (err) {
      error = err.message;
    }
  };

  // Load data on mount
  onMount(async () => {
    const marketId = $page.params.market;
    await fetchMarketDetails(marketId);
  });
</script>

<Layout>
  <div slot="sidebar-toggle-button"></div>
  <main class="min-h-screen bg-gray-100 py-8 px-4">
    {#if error}
      <p class="text-center text-red-500 font-medium">Error: {error}</p>
    {:else if !market}
      <p class="text-center text-gray-500 font-medium">
        Marktdetails aan het laden...
      </p>
    {:else}
      <div class="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div class="flex justify-between">
          <h1 class="text-3xl font-bold text-gray-800 mb-4">{market.name}</h1>
          <div class="flex space-x-1">
            <button
              id="copylink"
              on:click={copyLink}
              class="bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >Deel</button
            >
            {#if market.verified}
              <button
                id="verify"
                on:click={() => deVerify(market.id)}
                class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition"
                >Deverifieer</button
              >
            {:else}
              <button
                id="verify"
                on:click={() => verify(market.id)}
                class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
                >Verifieer</button
              >
            {/if}
          </div>
        </div>

        <p class="text-gray-600 mb-6">{market.description}</p>

        <div class="flex flex-wrap gap-6">
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Details</h2>
            <ul class="text-gray-600 space-y-2">
              <li><strong>Dag</strong> {market.dayOfWeek}</li>
              <li><strong>Begin</strong> {market.startTime}</li>
              <li><strong>Eind</strong> {market.endTime}</li>
            </ul>
          </div>
          <div class="flex-1">
            <h2 class="text-lg font-semibold text-gray-700 mb-2">Locatie</h2>
            <ul class="text-gray-600 space-y-2">
              <li><strong>Stad</strong> {market.location.city}</li>
              <li><strong>Adres</strong> {market.location.address}</li>
            </ul>
          </div>
        </div>

        <div class="mt-8 text-center flex justify-between">
          <a
            href="/markten"
            class="bg-green-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Terug
          </a>
          <a
            href="/markten/{$page.params.market}/edit"
            class="bg-orange-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-orange-600 transition"
          >
            Bewerken
          </a>
          <button
            on:click={deleteMarket(market.id)}
            class="bg-red-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-600 transition"
          >
            Verwijderen
          </button>
        </div>
      </div>
    {/if}
  </main>
</Layout>