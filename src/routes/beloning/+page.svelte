<script>
  // @ts-nocheck
  
  import { onMount } from 'svelte';
  import { Html5QrcodeScanner } from 'html5-qrcode';
  import Layout from '../layout.svelte';

  let user = null;

  if (typeof window !== "undefined") {
    user = JSON.parse(localStorage.getItem('user')) || null;
  }

  let scannedCode = '';
  let scanResult = null;
  let errorMessage = '';

  const onScanSuccess = (decodedText) => {
    scannedCode = decodedText;
    scanQRCode(scannedCode);
  };

  const onScanError = (error) => {
    console.error('Scan error:', error);
  };

  const scanQRCode = (code) => {
    fetch('http://localhost:3010/products/scan-qr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          scanResult = data;
          errorMessage = '';
          updateUserInLocalStorage(data.carbonDioxide);
        } else {
          scanResult = null;
          errorMessage = data.message || 'Unknown error';
        }
      })
      .catch((err) => {
        scanResult = null;
        console.error('Error scanning QR code:', err);
        errorMessage = 'Failed to scan QR code. Please try again.';
      });
  };

  const updateUserInLocalStorage = (carbonDioxide) => {
    if (user) {
      user.reduction = (user.reduction || 0) + carbonDioxide;
      if (typeof window !== "undefined") {
        localStorage.setItem('user', JSON.stringify(user));
      }
    }
  };

  onMount(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);
    scanner.render(onScanSuccess, onScanError);
  });
</script>
<Layout>
<div class="container mx-auto p-6">
  <div class="text-center mb-6">
    <h1 class="text-2xl font-bold text-gray-800">QR Code Scanner</h1>
    <p class="text-gray-600">Scan een QR-code of voer de code handmatig in.</p>
  </div>

  <!-- QR Code Scanner -->
  <div id="qr-reader" class="w-full max-w-sm mx-auto border border-gray-300 rounded-lg shadow-md"></div>

  <!-- Manual input for the code -->
  <div class="mt-6">
    <label for="qr-input" class="block text-sm font-medium text-gray-700">
      Handmatige invoer
    </label>
    <div class="mt-2 flex gap-2">
      <input
        id="qr-input"
        type="text"
        bind:value={scannedCode}
        placeholder="Voer de QR-code in"
        class="flex-1 px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        on:click={() => scanQRCode(scannedCode)}
        class="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
      >
        Scan Code
      </button>
    </div>
  </div>
</Layout>
  <!-- Display the results -->
  {#if scanResult}
    <div class="mt-6 bg-green-100 text-green-800 p-4 rounded-lg shadow-md">
      <h3 class="text-lg font-semibold">Resultaat</h3>
      <p class="mt-1">{scanResult.message}</p>
      <p class="mt-1 font-medium">CO2-uitstoot: {scanResult.carbonDioxide} g</p>
    </div>
  {/if}

  {#if errorMessage}
    <div class="mt-6 bg-red-100 text-red-800 p-4 rounded-lg shadow-md">
      <p>{errorMessage}</p>
    </div>
  {/if}

