<script>
    import { supabase } from '$lib/supabase';

    let email = '';
    let password = '';
    let confirmPassword = '';
    let registerError = '';
    let registerSuccess = '';
    let isRegistering = false;

    const handleRegister = async () => {
        registerError = '';
        registerSuccess = '';
        if (!email || !password || !confirmPassword) {
            registerError = 'Please fill in all fields.';
            return;
        }
        if (password !== confirmPassword) {
            registerError = 'Passwords do not match.';
            return;
        }
        isRegistering = true;
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });
            if (error) {
                registerError = error.message;
            } else if (data.user) {
                registerSuccess = 'Registration successful! Please check your email for verification.';
            }
        } catch (err) {
            registerError = `Unexpected error: ${err.message}`;
        } finally {
            isRegistering = false;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-950 border border-zinc-700 rounded-xl shadow-lg w-96 p-6">
        <h1 class="text-2xl font-bold mb-4">Register</h1>

        {#if registerError}
            <p class="text-red-400 mb-4">{registerError}</p>
        {/if}
        {#if registerSuccess}
            <p class="text-green-400 mb-4">{registerSuccess}</p>
        {/if}

        <input
            type="email"
            placeholder="Email"
            bind:value={email}
            class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white mb-4"
        />
        <input
            type="password"
            placeholder="Password"
            bind:value={password}
            class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white mb-4"
        />
        <input
            type="password"
            placeholder="Confirm Password"
            bind:value={confirmPassword}
            class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white mb-4"
        />

        <button
            on:click={handleRegister}
            class="w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
            disabled={isRegistering}
        >
            {#if isRegistering}
                Registering...
            {:else}
                Register
            {/if}
        </button>

        <div class="mt-4 text-sm text-neutral-400">
            <a href="/login" class="hover:text-neutral-200">Back to Login</a>
        </div>
    </div>
</div>
