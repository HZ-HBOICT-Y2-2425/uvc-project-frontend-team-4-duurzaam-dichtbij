<script>
    import { onMount } from "svelte";
    import Layout from "../layout.svelte";

    onMount(async () => {
        console.log('Page loaded');
    });
</script>

<Layout>
    <div slot="sidebar-toggle-button"></div>

    <h2>Profiellll</h2>
</Layout>

<style>
    
</style>