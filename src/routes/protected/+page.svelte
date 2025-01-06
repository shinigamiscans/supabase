<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    let session = null;
    let accessToken = '';
    let refreshToken = '';
    let jwtToken = '';
    let pasetoToken = '';
    let pasetoResponse = '';
    let responseMessage = '';
    let showToast = false; // For Copy Toast
    let isSendingToken = false; // For Send Token Button
    let isTestingToken = false; // For Test Token Button
    let pasetoEndpoint = 'https://chat.shng.me/protected'; // Default API endpoint for PASETO token
    let authEndpoint = 'https://chat.shng.me/auth'; // Default /auth endpoint

    onMount(async () => {
        const { data } = await supabase.auth.getSession();
        session = data?.session;

        if (!session) {
            // Redirect to login if not logged in
            window.location.href = '/login';
        } else {
            accessToken = session.access_token;
            refreshToken = session.refresh_token;
            jwtToken = session.access_token;
        }
    });

    const showCopyToast = () => {
        showToast = true;
        setTimeout(() => {
            showToast = false;
        }, 1500);
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            window.location.href = '/login';
        }
    };

    const sendTokenToBackend = async () => {
        isSendingToken = true;
        try {
            const response = await fetch(authEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${jwtToken}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                pasetoToken = result.token;
                responseMessage = 'Token sent successfully.';
            } else {
                responseMessage = `Error: ${response.statusText}`;
            }
        } catch (error) {
            responseMessage = `Error: ${error.message}`;
        } finally {
            isSendingToken = false;
        }
    };

    const testPasetoToken = async () => {
        isTestingToken = true;
        try {
            const response = await fetch(pasetoEndpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${pasetoToken}`,
                },
            });

            if (response.ok) {
                const result = await response.json();
                pasetoResponse = JSON.stringify(result.data, null, 2);
            } else {
                pasetoResponse = `Error: ${response.statusText}`;
            }
        } catch (error) {
            pasetoResponse = `Error: ${error.message}`;
        } finally {
            isTestingToken = false;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white px-4">
    <div class="relative mt-7 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg w-full max-w-4xl p-6">
        {#if showToast}
            <div class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white text-black text-sm px-4 py-2 rounded shadow-md">
                Copied to clipboard!
            </div>
        {/if}
        <h1 class="text-2xl font-bold text-white mb-6">Protected Page</h1>
        {#if session}
            <!-- Access Token -->
            <p class="mb-4 text-sm">Your Access Token:</p>
            <div class="bg-zinc-800 p-4 rounded-lg text-sm text-white mb-6">
                <div class="overflow-x-auto break-words whitespace-pre-wrap">{accessToken}</div>
                <button
                    class="mt-4 py-2 px-4 bg-white text-zinc-800 text-sm rounded-lg hover:bg-gray-100 focus:outline-none"
                    on:click={() => {
                        navigator.clipboard.writeText(accessToken);
                        showCopyToast();
                    }}
                >
                    Copy
                </button>
            </div>

            <!-- Refresh Token -->
            <p class="mb-4 text-sm">Your Refresh Token:</p>
            <div class="bg-zinc-800 p-4 rounded-lg text-sm text-white mb-6">
                <div class="overflow-x-auto break-words whitespace-pre-wrap">{refreshToken}</div>
                <button
                    class="mt-4 py-2 px-4 bg-white text-zinc-800 text-sm rounded-lg hover:bg-gray-100 focus:outline-none"
                    on:click={() => {
                        navigator.clipboard.writeText(refreshToken);
                        showCopyToast();
                    }}
                >
                    Copy
                </button>
            </div>

            <!-- API Endpoints -->
            <p class="mb-4 text-sm">API Endpoint for <strong>Sending</strong> JWT Token:</p>
            <input
                type="text"
                bind:value={authEndpoint}
                class="w-full py-3 px-4 bg-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white mb-6"
            />

            <p class="mb-4 text-sm">API Endpoint for <strong>Testing</strong> PASETO Token:</p>
            <input
                type="text"
                bind:value={pasetoEndpoint}
                class="w-full py-3 px-4 bg-zinc-800 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-white mb-6"
            />

            <!-- Send JWT Token -->
            <button
                on:click={sendTokenToBackend}
                class="py-2 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none mb-6"
                disabled={isSendingToken}
            >
                {#if isSendingToken}
                    Sending...
                {:else}
                    Send JWT to Backend
                {/if}
            </button>

            <!-- PASETO Token -->
            {#if pasetoToken}
                <p class="mb-4 text-sm">PASETO Token:</p>
                <div class="bg-zinc-800 p-4 rounded-lg text-sm text-white mb-6">
                    <div class="overflow-x-auto break-words whitespace-pre-wrap">{pasetoToken}</div>
                    <button
                        class="mt-4 py-2 px-4 bg-white text-zinc-800 text-sm rounded-lg hover:bg-gray-100 focus:outline-none"
                        on:click={() => {
                            navigator.clipboard.writeText(pasetoToken);
                            showCopyToast();
                        }}
                    >
                        Copy PASETO Token
                    </button>
                </div>
            {/if}

            <!-- Test Paseto Token -->
            {#if pasetoToken}
                <button
                    on:click={testPasetoToken}
                    class="py-2 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none mb-6"
                    disabled={isTestingToken}
                >
                    {#if isTestingToken}
                        Testing...
                    {:else}
                        Test Paseto Token
                    {/if}
                </button>
            {/if}

            <!-- PASETO Response -->
            {#if pasetoResponse}
                <p class="mb-4 text-sm">PASETO Response:</p>
                <pre class="bg-zinc-800 p-4 rounded-lg text-sm text-white mb-6">{pasetoResponse}</pre>
            {/if}

            <!-- Logout -->
            <button
                on:click={logout}
                class="py-2 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
            >
                Logout
            </button>

            <!-- Response Message -->
            {#if responseMessage}
                <p class="mt-4 text-sm text-green-400">{responseMessage}</p>
            {/if}
        {:else}
            <p>Redirecting to login...</p>
        {/if}
    </div>
</div>
