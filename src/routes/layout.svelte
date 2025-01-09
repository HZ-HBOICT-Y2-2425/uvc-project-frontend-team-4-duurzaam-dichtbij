<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import "../app.css";

    let sidebarVisible = false; // Sidebar visibility state
    let menubarVisible = false; // Menubar visibility state (only for mobile)

    export let user = null; // User object

    // Check the login status from localStorage
    onMount(() => {
        menubarVisible = window.innerWidth >= 768;
        
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    });

    function toggleSidebar() {
        sidebarVisible = !sidebarVisible;
    }

    function toggleMenubar() {
        menubarVisible = !menubarVisible;
    }
</script>

<div id="menubar" class="bg-gray-800 text-white flex items-center justify-center px-5 absolute top-0 left-0 right-0 z-[3999] md:static md:h-12 md:transform-none transition-transform duration-300" class:visible={menubarVisible}>
    <ul id="menu-items" class="list-none m-0 p-5 flex flex-col gap-5 w-full md:flex-row md:gap-5 md:p-0 md:w-auto">
        <li class="h-12 w-full flex items-center justify-center text-center md:w-auto md:px-2"><a href="/" class="no-underline text-inherit w-full h-full flex items-center justify-center">Home</a></li>
        <li class="h-12 w-full flex items-center justify-center text-center md:w-auto md:px-2"><a href="/kaart" class="no-underline text-inherit w-full h-full flex items-center justify-center">Kaart</a></li>
        <li class="h-12 w-full flex items-center justify-center text-center md:w-auto md:px-2"><a href="/recepten" class="no-underline text-inherit w-full h-full flex items-center justify-center">Recepten</a></li>
        <li class="h-12 w-full flex items-center justify-center text-center md:w-auto md:px-2"><a href="/markten" class="no-underline text-inherit w-full h-full flex items-center justify-center">Markten</a></li>
        <li class="h-12 w-full flex items-center justify-center text-center md:w-auto md:px-2"><a href="/community" class="no-underline text-inherit w-full h-full flex items-center justify-center">Community</a></li>
        <li class="h-12 w-full flex items-center justify-center text-center md:w-auto md:px-2"><a href="/profiel" class="no-underline text-inherit w-full h-full flex items-center justify-center">Profiel</a></li>
    </ul>
</div>

<div id="container" class="flex-1 overflow-auto relative flex">
    <div id="page" class="inline-flex-auto w-full">
        <slot />
    </div>
</div>

<button id="hamburger-menu-button" class="absolute right-2.5 top-2.5 bg-gray-800 text-white border-none rounded px-3.5 py-2.5 text-xl cursor-pointer z-[4000] md:hidden" on:click={toggleMenubar}>
    ☰
</button>

<style>
    :global(body) {
        margin: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    #menubar:not(.visible) {
        transform: translateY(-100%);
    }

    #menubar.visible {
        transform: translateY(0);
    }

    @media (min-width: 768px) {
        #menubar {
            transform: none !important;
        }
    }
</style>
