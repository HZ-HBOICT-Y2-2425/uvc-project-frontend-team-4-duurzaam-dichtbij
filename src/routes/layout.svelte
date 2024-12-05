<script>
    import { onMount } from "svelte";

    let sidebarVisible = false; // Sidebar visibility state
    let menubarVisible = false; // Menubar visibility state (only for mobile)

    onMount(async () => {
        menubarVisible = window.innerWidth >= 768;
    });

    function toggleSidebar() {
        sidebarVisible = !sidebarVisible;
    }

    function toggleMenubar() {
        menubarVisible = !menubarVisible;
    }
</script>

<div id="menubar" class:visible={menubarVisible}>
    <ul id="menu-items">
        <li><a href="/">Home</a></li>
        <li><a href="/recepten">Recepten</a></li>
        <li><a href="/community">Community</a></li>
        <li><a href="/voortgang">Voortgang</a></li>
        <li><a href="/profiel">Profiel</a></li>
    </ul>
</div>
<div id="container">
    <div id="sidebar" class:visible={sidebarVisible}>
        <slot name="sidebar" />
    </div>
    <div id="page">
        <button id="sidebar-toggle-button" on:click={toggleSidebar}>
            {sidebarVisible ? '<' : '>'}
        </button>
        <slot />
    </div>
</div>
<button id="hamburger-menu-button" on:click={toggleMenubar}>
    ☰
</button>

<style>
    :global(body) {
        margin: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
    }

    #page {
        display: inline;
        flex: none;
    }

    #container {
        display: flex;
        flex: 1;
        overflow: hidden;
        position: relative;
    }

    #menubar {
        background: #333;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 20px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 3000;
        transition: transform 0.3s ease-in-out;
    }

    /* Menubar height adjustments */
    #menubar:not(.visible) {
        transform: translateY(-100%);
    }

    #menu-items {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: nowrap; /* Prevent overflow of menu items */
        gap: 20px;
    }

    #menu-items li {
        height: 50px;
        width: 100%; /* Full width for clickability on mobile */
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #menu-items li a {
        text-decoration: none; /* Remove underline */
        color: inherit; /* Inherit text color from parent */
        width: 100%; /* Make the link fill the entire li */
        height: 100%; /* Match li height for clickability */
        display: flex; /* Use flexbox for centering */
        align-items: center; /* Vertical centering */
        justify-content: center; /* Horizontal centering */
    }

    /* Ensure proper stacking of menu items on smaller screens */
    @media (max-width: 768px) {
        #menu-items {
            flex-direction: column;
            gap: 10px;
            padding: 10px 0;
            width: 100%;
        }

        #menubar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: auto; /* Adjust height based on content */
        }

        #menu-items li {
            text-align: center;
            width: 100%; /* Ensure full-width for mobile menu items */
        }
    }

    /* On larger screens, menubar is always visible */
    @media (min-width: 768px) {
        #menubar {
            transform: none; /* Always visible */
            position: static;
            height: 50px; /* Fixed height for desktop */
        }

        #menu-items {
            flex-direction: row;
            gap: 20px;
        }

        #menu-items li {
            padding-inline: 10px;
        }

        #hamburger-menu-button {
            display: none; /* Hide hamburger button */
        }
    }

    #sidebar {
        width: 250px;
        background: #f4f4f4;
        padding: 20px;
        overflow-y: auto;
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;
        z-index: 2000; /* Sidebar is above map and Leaflet controls */
    }

    #sidebar.visible {
        transform: translateX(0);
    }

    #sidebar-toggle-button {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        background: #333;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 5px 10px;
        cursor: pointer;
        z-index: 2001; /* Button is above the sidebar */
    }

    #hamburger-menu-button {
        position: absolute;
        right: 10px;
        top: 10px;
        background: #333;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        font-size: 1.2em;
        cursor: pointer;
        z-index: 3002; /* Ensure above everything else */
    }
</style>