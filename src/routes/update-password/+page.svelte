<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    let newPassword = '';
    let confirmPassword = '';
    let errorMsg = '';
    let successMsg = '';
    let isUpdating = false;

    // Ensure the user is authenticated via the recovery link
    onMount(async () => {
        const { data, error } = await supabase.auth.getSession();

        if (!data?.session || error) {
            // If not authenticated, redirect to login
            window.location.href = '/login?tab=password';
        }
    });

    const updatePassword = async () => {
        errorMsg = '';
        successMsg = '';

        if (!newPassword || !confirmPassword) {
            errorMsg = 'Please fill out both fields.';
            return;
        }

        if (newPassword !== confirmPassword) {
            errorMsg = 'Passwords do not match.';
            return;
        }

        isUpdating = true;
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                errorMsg = error.message;
            } else {
                successMsg = 'Password updated successfully! Redirecting to login...';

                // Redirect to login with credentials tab after a short delay
                setTimeout(() => {
                    window.location.href = '/login?tab=password';
                }, 2000);
            }
        } catch (err) {
            errorMsg = `Unexpected error: ${err.message}`;
        } finally {
            isUpdating = false;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-950 border border-zinc-700 rounded-xl shadow-lg w-96 p-6">
        <h1 class="text-2xl font-bold mb-4">Update Password</h1>

        {#if errorMsg}
            <p class="text-red-400 mb-4">{errorMsg}</p>
        {/if}
        {#if successMsg}
            <p class="text-green-400 mb-4">{successMsg}</p>
        {/if}

        <input
            type="password"
            placeholder="New Password"
            bind:value={newPassword}
            class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white mb-4"
        />
        <input
            type="password"
            placeholder="Confirm New Password"
            bind:value={confirmPassword}
            class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white mb-4"
        />
        <button
            on:click={updatePassword}
            class="w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
            disabled={isUpdating}
        >
            {#if isUpdating}
                Updating...
            {:else}
                Update Password
            {/if}
        </button>
    </div>
</div>
