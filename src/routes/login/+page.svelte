<script>
    import { supabase } from '$lib/supabase';

    let email = '';

    const loginWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
        if (error) console.error('Error logging in with Google:', error.message);
    };

    const loginWithDiscord = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord' });
        if (error) console.error('Error logging in with Discord:', error.message);
    };

    const loginWithMagicLink = async () => {
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }

        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            console.error('Error sending magic link:', error.message);
        } else {
            // Redirect to /check-email after sending the magic link
            window.location.href = '/check-email';
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-950 border border-zinc-700 rounded-xl shadow-lg w-96">
        <div class="p-6">
            <div class="text-center">
                <h1 class="text-2xl font-bold text-white">Sign In</h1>
                <p class="mt-2 text-sm text-neutral-400">Please choose your login method below.</p>
            </div>

            <div class="mt-6 space-y-4">
                <button
                    on:click={loginWithGoogle}
                    class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                >
                    <img class="w-5" src="/google-icon.svg" alt="Google Icon">
                    Sign in with Google
                </button>
                <button
                    on:click={loginWithDiscord}
                    class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                >
                    <img class="w-5" src="/discord-icon.svg" alt="Discord Icon">
                    Sign in with Discord
                </button>
            </div>

            <div class="py-4 text-xs text-neutral-500 uppercase text-center">or</div>

            <div>
                <input
                    type="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring focus:ring-blue-500"
                />
                <button
                    on:click={loginWithMagicLink}
                    class="mt-4 w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                >
                    Login with Magic Link
                </button>
            </div>
        </div>
    </div>
</div>
