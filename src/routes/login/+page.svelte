<script>
    // @ts-nocheck
    import { onMount } from "svelte";
    import { goto, afterNavigate } from '$app/navigation';
    import Layout from "../layout.svelte";
    import { users } from "$lib/users";

    const base = '/';
    let previousPage = base;

    afterNavigate(({from}) => {
        console.log(base);
        previousPage = from?.url.pathname || previousPage;
        if (previousPage.toLocaleLowerCase() === window.location.pathname.toLocaleLowerCase() || previousPage.replace(' ', '') == '') {
            previousPage = base;
        }
    });

    let username = '';
    let password = '';
    let errorMessage = '';

    async function handleLogin() {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            if (user.shopId) {
                const res = await fetch(`http://localhost:3010/shops/shop/${user.shopId}`);
                if (res.ok) {
                    const shop = await res.json();
                    user.shop = shop;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            } else {
                localStorage.setItem('user', JSON.stringify(user));
            }
            goto(previousPage);
        } else {
            errorMessage = 'Onjuiste gebruikersnaam of wachtwoord';
        }
    }

    let ref = null;
    onMount(() => {
        errorMessage = '';
        ref.focus();
        localStorage.setItem('userList', JSON.stringify(users));
    });
</script>

<Layout>
    <section class="flex justify-center items-center min-h-full bg-gray-100 p-5 box-border">
        <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md text-center animate-fadeIn">
            <h2 class="text-2xl text-gray-800 mb-5">Inloggen</h2>
    
            <div class="mb-5 text-left">
                <label for="username" class="block text-sm font-bold text-gray-600 mb-2">Gebruikersnaam</label>
                <input type="text" id="username" bind:this={ref} bind:value={username} placeholder="Gebruikersnaam" class="w-full p-3 border border-gray-300 rounded-lg text-base outline-none transition duration-300 focus:border-green-500 focus:shadow-outline-green"/>
            </div>
    
            <div class="mb-5 text-left">
                <label for="password" class="block text-sm font-bold text-gray-600 mb-2">Wachtwoord</label>
                <input type="password" id="password" bind:value={password} placeholder="Wachtwoord" class="w-full p-3 border border-gray-300 rounded-lg text-base outline-none transition duration-300 focus:border-green-500 focus:shadow-outline-green" />
            </div>
    
            <button type="submit" on:click={handleLogin} class="w-full p-3 bg-green-500 text-white text-base font-bold rounded-lg cursor-pointer transition duration-300 hover:bg-green-600">Inloggen</button>
    
            {#if errorMessage}
                <p class="text-red-500 text-sm mt-4 font-bold">{errorMessage}</p>
            {/if}
        </div>
    </section>
</Layout>
