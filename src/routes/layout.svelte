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

<div id="menubar" class:visible={menubarVisible}>
    <ul id="menu-items">
        <li><a href="/">Home</a></li>
        <li><a href="/kaart">Kaart</a></li>
        <li><a href="/recepten">Recepten</a></li>
        {#if user}
        <li><a href="/markten">Markten</a></li>
        {/if}
        <li><a href="/community">Community</a></li>
        <li><a href="/voortgang">Voortgang</a></li>
        <li><a href="/profiel">Profiel</a></li>
        <li><a href="/Qrcode">qr</a></li>
    </ul>
</div>

<div id="container">
    <div id="sidebar" class:visible={sidebarVisible}>
        <slot name="sidebar" />
    </div>
    <div id="page">
        <slot name="sidebar-toggle-button">
            <button id="sidebar-toggle-button" on:click={toggleSidebar}>
                {sidebarVisible ? '<' : '>'}
            </button>
        </slot>
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
        flex: auto;
    }

    #container {
        display: flex;
        flex: 1;
        overflow: auto;
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
        /*transition: transform 0.3s ease-in-out;*/
    }

    #menubar:not(.visible) {
        transform: translateY(-100%);
    }

    #menu-items {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: nowrap;
        gap: 20px;
    }

    #menu-items li {
        height: 50px;
        width: 100%; 
        display: flex;
        align-items: center;
        justify-content: center;
    }

    #menu-items li a {
        text-decoration: none; 
        color: inherit;
        width: 100%; 
        height: 100%;
        display: flex;
        align-items: center; 
        justify-content: center; 
    }

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
            height: auto; 
        }

        #menu-items li {
            text-align: center;
            width: 100%; 
        }
    }

    @media (min-width: 768px) {
        #menubar {
            transform: none;
            position: static;
            height: 50px; 
        }

        #menu-items {
            flex-direction: row;
            gap: 20px;
        }

        #menu-items li {
            padding-inline: 10px;
        }

        #hamburger-menu-button {
            display: none; 
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
        z-index: 2000;
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
        z-index: 2001;
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
        z-index: 3002;
    }
</style>
