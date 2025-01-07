<script>
    // @ts-nocheck
    import { onMount } from 'svelte';
    import Layout from '../layout.svelte';

    let users = [];
    let sortedUsers = [];

    onMount(() => {
        const storedUsers = localStorage.getItem('userList');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
            sortedUsers = [...users].sort((a, b) => b.reduction - a.reduction);
        }
    });
</script>

<Layout>
    <section class="flex justify-center items-center min-h-full bg-gray-100 p-5 box-border">
        <div class="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md text-center animate-fadeIn">
            <h2 class="text-2xl text-gray-800 mb-5">Leaderboard</h2>
            <table class="w-full table-auto">
                <thead>
                    <tr>
                        <th class="px-4 py-2">Rank</th>
                        <th class="px-4 py-2">Name</th>
                        <th class="px-4 py-2">Reduction</th>
                    </tr>
                </thead>
                <tbody>
                    {#each sortedUsers as user, index}
                        <tr class={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                            <td class="border px-4 py-2">{index + 1}</td>
                            <td class="border px-4 py-2">{user.name}</td>
                            <td class="border px-4 py-2">{(0.001 * (user.reduction)).toFixed(3)} kg</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </section>
</Layout>

<style>
    main {
        padding: 2rem;
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
    }
    h2 {
        font-size: 2em;
        margin-bottom: 1em;
        color: #333;
    }
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }
    th {
        background-color: #f4f4f4;
    }
    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
</style>