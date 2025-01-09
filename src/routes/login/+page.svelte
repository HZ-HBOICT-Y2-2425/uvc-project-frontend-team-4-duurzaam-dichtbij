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


    const users = [
        {
            id: 1,
            name: 'Henk de Vries',
            username: 'a',
            password: 'p',
            email: 'testuser@example.com',
            role: "admin",
            level: 1,
            reduction: 5
        },
        {
            id: 2,
            name: 'Ria de Boer',
            username: 'u',
            password: 'p',
            email: 'testuser@example.com',
            role: "user",
            level: 1,
            reduction: 7
        },
        {
            id: 3,
            name: 'Henk-Jan van Luiten',
            username: 'u2',
            password: 'p',
            email: 'testuser@example.com',
            role: "user",
            level: 1,
            reduction: 4
        },
        {
            id: 4,
            name: 'Marjan de Vries',
            username: 'u3',
            password: 'p',
            email: 'testuser@example.com',
            role: "user",
            level: 1,
            reduction: 9
        },
        {
            id: 5,
            name: 'Peter de Boer',
            username: 'u4',
            password: 'p',
            email: 'testuser@example.com',
            role: "user",
            level: 1,
            reduction: 14
        },
    ];

    function handleLogin() {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
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
