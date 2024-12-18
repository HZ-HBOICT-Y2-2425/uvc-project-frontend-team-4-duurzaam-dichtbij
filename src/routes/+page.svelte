<script>
    import { onMount } from "svelte";
    import Layout from "./layout.svelte";

    onMount(async () => {
        console.log('Page loaded');
    });
</script>

<Layout>
    <div slot="sidebar">
        <!-- Sidebar content specific to this page -->
        <h2>Custom Sidebar Content</h2>
        <p>This is specific to the map page.</p>
        <p>Oehh!</p>
    </div>

    <h2>Profiellll</h2>
</Layout>

<style>
    
</style>