<script>
    import { supabase } from '$lib/supabase';
    import toast, { Toaster } from 'svelte-5-french-toast';

    let email = '';
    let isSendingReset = false;

    const resetPassword = async () => {
        if (!email) {
            toast.error('Please enter a valid email address.', {
                style: 'border-radius: 8px; background: #333; color: #fff;',
            });
            return;
        }

        isSendingReset = true;
        try {
            const redirectTo = `${import.meta.env.VITE_HOME_URL}/update-password`;
            const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });

            if (error) {
                toast.error(`Error: ${error.message}`, {
                    style: 'border-radius: 8px; background: #333; color: #fff;',
                });
            } else {
                toast.success('Password reset email sent. Check your inbox!', {
                    style: 'border-radius: 8px; background: #333; color: #fff;',
                });

                // Optionally clear the email field after success
                email = '';
            }
        } catch (err) {
            toast.error(`Unexpected error: ${err.message}`, {
                style: 'border-radius: 8px; background: #333; color: #fff;',
            });
        } finally {
            isSendingReset = false;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg w-96 p-6">
        <h1 class="text-2xl font-bold mb-4">Reset Password</h1>

        <input
            type="email"
            bind:value={email}
            placeholder="Your email address"
            class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white mb-4"
        />

        <button
            on:click={resetPassword}
            class="w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
            disabled={isSendingReset}
        >
            {#if isSendingReset}
                Sending...
            {:else}
                Reset Password
            {/if}
        </button>

        <!-- Link back to login -->
        <div class="mt-4 text-sm text-neutral-400">
            <a href="/login?tab=password" class="hover:text-neutral-200">Back to Login</a>
        </div>
    </div>
</div>

<!-- Toaster for Notifications -->
<Toaster />
