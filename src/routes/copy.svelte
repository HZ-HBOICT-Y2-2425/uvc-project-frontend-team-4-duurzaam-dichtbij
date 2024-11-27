<script>
    import { onMount } from "svelte";
    import "leaflet/dist/leaflet.css";

    let map;
    let sidebarVisible = false; // Sidebar visibility state
    let menubarVisible = false; // Menubar visibility state (only for mobile)

    onMount(async () => {
        menubarVisible = window.innerWidth >= 768;

        const L = await import("leaflet");

        // Initialize map
        map = L.map('map').setView([51.533370759239155, 3.9179992675781254], 10);

        // Add a tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Add a marker
        L.marker([51.533370759239155, 3.9179992675781254]).addTo(map).bindPopup("A pretty popup!").openPopup();

        map.on('click', function (/** @type {{ latlng: any; }} */ e) {
            const coord = e.latlng;
            const lat = coord.lat;
            const lng = coord.lng;
            console.log(`${lat} ${lng}`);
        });
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
        <li>Home</li>
        <li>About</li>
        <li>Services</li>
        <li>Contact</li>
    </ul>
</div>
<div id="container">
    <div id="sidebar" class:visible={sidebarVisible}>
        Sidebar content here...
    </div>
    <div id="map"></div>
    <button id="sidebar-toggle-button" on:click={toggleSidebar}>
        {sidebarVisible ? '<' : '>'}
    </button>
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
        cursor: pointer;
        color: white;
    }

    /* Ensure proper stacking of menu items on smaller screens */
    @media (max-width: 768px) {
        #menu-items {
            flex-direction: column;
            gap: 10px;
            padding: 10px 0;
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

        #hamburger-menu-button {
            display: none; /* Hide hamburger button */
        }
    }

    #container {
        display: flex;
        flex: 1;
        overflow: hidden;
        position: relative;
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

    #map {
        flex: 1;
        height: 100%;
        position: relative;
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