<script>
    import { onMount } from 'svelte'; // Verkeerde import die niet gebruikt wordt
    
    let message = "Hello, world!";
  
    onMount(() => {
      console.log("Component is mounted!");
    });
  
    // Onbedoelde fout: variabele wordt niet gedefinieerd
    const greetingMessage = sayHello(message); // Er is geen functie `sayHello`
  </script>
  
  <main>
    <h1>{message}</h1>
  </main>
  
  <style>
    h1 {
      color: red; /* Hardcoded kleur die als waarschuwing zou kunnen verschijnen */
    }
  </style>