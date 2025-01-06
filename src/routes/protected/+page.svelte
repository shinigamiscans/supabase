<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    let session = null;
    let accessToken = '';
    let refreshToken = '';
    let jwtToken = '';
    let backendEndpoint = 'https://your-backend-endpoint.com/verify-token'; // Default endpoint
    let responseMessage = '';

    onMount(async () => {
        const { data } = await supabase.auth.getSession();
        session = data?.session;

        if (!session) {
            // Redirect to login if not logged in
            window.location.href = '/login';
        } else {
            // Extract tokens from session
            accessToken = session.access_token;
            refreshToken = session.refresh_token;
            jwtToken = session.access_token; // Prefill the form with the access token
        }
    });

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = '/login';
        }
    };

    const refreshSession = async () => {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
            responseMessage = `Error refreshing session: ${error.message}`;
        } else {
            const { data } = await supabase.auth.getSession();
            session = data?.session;
            accessToken = session?.access_token || '';
            refreshToken = session?.refresh_token || '';
            jwtToken = session?.access_token || '';
            responseMessage = 'Session refreshed successfully.';
        }
    };

    const sendTokenToBackend = async () => {
        try {
            const response = await fetch(backendEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}` // Send the token in the Authorization header
                }
            });

            if (response.ok) {
                const result = await response.json();
                responseMessage = `Success: ${result.message}`;
            } else {
                responseMessage = `Error: ${response.statusText}`;
            }
        } catch (error) {
            responseMessage = `Error: ${error.message}`;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
    <div class="mt-7 bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg w-[40rem] p-6">
        <h1 class="text-2xl font-bold text-white mb-6">Protected Page</h1>
        {#if session}
            <!-- Access Token -->
            <p class="mb-4 text-sm">Your Access Token:</p>
            <div class="bg-zinc-700 p-4 rounded-lg text-sm text-white mb-6">
                <div class="overflow-x-auto break-words whitespace-pre-wrap">{accessToken}</div>
                <button
                    class="mt-4 py-2 px-4 bg-white text-zinc-800 text-sm rounded-lg hover:bg-gray-100 focus:outline-none"
                    on:click={() => navigator.clipboard.writeText(accessToken)}
                >
                    Copy Access Token
                </button>
            </div>

            <!-- Refresh Token -->
            <p class="mb-4 text-sm">Your Refresh Token:</p>
            <div class="bg-zinc-700 p-4 rounded-lg text-sm text-white mb-6">
                <div class="overflow-x-auto break-words whitespace-pre-wrap">{refreshToken}</div>
                <button
                    class="mt-4 py-2 px-4 bg-white text-zinc-800 text-sm rounded-lg hover:bg-gray-100 focus:outline-none"
                    on:click={() => navigator.clipboard.writeText(refreshToken)}
                >
                    Copy Refresh Token
                </button>
            </div>

            <!-- Refresh Session -->
            <button
                on:click={refreshSession}
                class="mt-4 py-2 px-4 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 focus:outline-none mb-6"
            >
                Refresh Session
            </button>

            <!-- Backend Endpoint Input -->
            <p class="mb-4 text-sm">Backend Endpoint:</p>
            <input
                type="text"
                bind:value={backendEndpoint}
                placeholder="Enter backend endpoint"
                class="w-full p-3 bg-zinc-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring focus:ring-blue-500 mb-4"
            />

            <!-- Form to Send JWT Token -->
            <p class="mb-4 text-sm">Send Your JWT Token to Backend:</p>
            <form
                on:submit|preventDefault={sendTokenToBackend}
                class="space-y-4"
            >
                <textarea
                    bind:value={jwtToken}
                    rows="4"
                    class="w-full p-3 bg-zinc-700 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring focus:ring-blue-500"
                ></textarea>
                <div class="flex gap-4">
                    <button
                        type="submit"
                        class="py-2 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                    >
                        Send Token
                    </button>
                    <button
                        on:click={logout}
                        class="py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none"
                    >
                        Logout
                    </button>
                </div>
            </form>

            <!-- Response Message -->
            {#if responseMessage}
                <p class="mt-4 text-sm text-green-400">{responseMessage}</p>
            {/if}
        {:else}
            <p>Redirecting to login...</p>
        {/if}
    </div>
</div>
