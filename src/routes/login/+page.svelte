<script>
    import { onMount } from "svelte";
    import { goto } from '$app/navigation';

    let username = '';
    let password = '';
    let errorMessage = '';

    const users = [
        {
            id: 1,
            name: 'Test User',
            username: 't',
            password: 'p',
            email: 'testuser@example.com',
            reduction: 5
        }
    ];

    function handleLogin() {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            goto('/voortgang');
        } else {
            errorMessage = 'Onjuiste gebruikersnaam of wachtwoord';
        }
    }

    onMount(() => {
        errorMessage = '';
    });
</script>

<div id="wrapper">
    <div id="login-container">
        <h2 class="heading">Inloggen</h2>

        <div class="form-group">
            <label for="username">Gebruikersnaam</label>
            <input type="text" id="username" bind:value={username} placeholder="Gebruikersnaam" />
        </div>

        <div class="form-group">
            <label for="password">Wachtwoord</label>
            <input type="password" id="password" bind:value={password} placeholder="Wachtwoord" />
        </div>

        <button on:click={handleLogin}>Inloggen</button>

        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
    </div>
</div>

<style>
    /* Wrapper om de inhoud lokaal te centreren */
    #wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh; /* Volledige hoogte van de viewport */
        background-color: #f4f7fc;
        padding: 20px; /* Voor kleinere schermen */
        box-sizing: border-box;
    }

    #login-container {
        width: 100%;
        max-width: 400px;
        padding: 25px;
        background-color: white;
        border-radius: 12px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        text-align: center;
        animation: fadeIn 0.5s ease;
    }

    .heading {
        font-size: 2rem;
        color: #333;
        margin-bottom: 20px;
    }

    .form-group {
        margin-bottom: 20px;
        text-align: left;
    }

    .form-group label {
        font-size: 0.9rem;
        font-weight: bold;
        color: #555;
        margin-bottom: 8px;
        display: block;
    }

    .form-group input {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
        transition: all 0.3s ease;
    }

    .form-group input:focus {
        border-color: #4caf50;
        box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
    }

    button {
        width: 100%;
        padding: 12px;
        background-color: #4caf50;
        color: white;
        font-size: 1rem;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    button:hover {
        background-color: #45a049;
    }

    .error {
        color: #f44336;
        font-size: 0.9rem;
        margin-top: 15px;
        font-weight: bold;
    }


</style>
