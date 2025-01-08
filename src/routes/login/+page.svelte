<!-- src/routes/login/+page.svelte -->
<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';
    import toast, { Toaster } from 'svelte-5-french-toast';

    // === Tab Control ===
    let activeTab = 'otp'; // "otp" or "credentials"

    // Read "?tab=password" from URL to switch directly to credentials tab if needed
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'password') {
            activeTab = 'credentials';
        }
    });

    // === Email OTP Login State ===
    let email = '';
    let isSending = false;           // For OTP sending
    let isGoogleLoading = false;
    let isDiscordLoading = false;
    let isTwitterLoading = false;

    const sendOtp = async () => {
        if (!email) {
            toast.error('Please enter a valid email address.', {
                style: 'border-radius: 8px; background: #333; color: #fff;',
            });
            return;
        }

        isSending = true;
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true, // Automatically create user if they don't exist
                },
            });

            if (error) {
                console.error('Error sending OTP:', error.message);
                toast.error('Failed to send OTP. Please try again.', {
                    style: 'border-radius: 8px; background: #333; color: #fff;',
                });
            } else {
                console.log('OTP sent successfully.');
                toast.success('OTP sent successfully! Check your email.', {
                    style: 'border-radius: 8px; background: #333; color: #fff;',
                });

                // Redirect user to the /check-email page to enter OTP
                setTimeout(() => {
                    window.location.href = `/check-email?email=${email}`;
                }, 2000);
            }
        } finally {
            isSending = false;
        }
    };

    // === OAuth ===
    const loginWithGoogle = async () => {
        isGoogleLoading = true;
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
            if (error) {
                console.error('Error logging in with Google:', error.message);
                alert('Google login failed. Please try again.');
            }
        } finally {
            isGoogleLoading = false;
        }
    };

    const loginWithDiscord = async () => {
        isDiscordLoading = true;
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord' });
            if (error) {
                console.error('Error logging in with Discord:', error.message);
                alert('Discord login failed. Please try again.');
            }
        } finally {
            isDiscordLoading = false;
        }
    };

    const loginWithTwitter = async () => {
        isTwitterLoading = true;
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'twitter' });
            if (error) {
                console.error('Error logging in with Twitter:', error.message);
                alert('Twitter login failed. Please try again.');
            }
        } finally {
            isTwitterLoading = false;
        }
    };

    // === Username/Password Login State ===
    let username = '';
    let password = '';
    let isPasswordLoginLoading = false;
    let loginError = '';

    const loginWithCredentials = async () => {
        loginError = '';
        if (!username || !password) {
            loginError = 'Please enter both username (or email) and password.';
            return;
        }
        isPasswordLoginLoading = true;
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username, // or "email: username" if your "username" is actually an email
                password
            });
            if (error) {
                console.error('Error logging in with credentials:', error.message);
                loginError = 'Login failed. Please check your credentials.';
            } else if (data?.user) {
                // Successfully logged in
                window.location.href = '/protected';
            }
        } catch (err) {
            console.error('Exception logging in:', err);
            loginError = 'An unexpected error occurred.';
        } finally {
            isPasswordLoginLoading = false;
        }
    };
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-950 border border-zinc-700 rounded-xl shadow-lg w-96">
        <!-- TAB HEADERS -->
        <div class="flex border-b border-zinc-700">
            <button
                class="w-1/2 p-4 text-center hover:bg-zinc-800"
                class:font-bold={activeTab === 'otp'}
                on:click={() => activeTab = 'otp'}
            >
                Email OTP
            </button>
            <button
                class="w-1/2 p-4 text-center hover:bg-zinc-800"
                class:font-bold={activeTab === 'credentials'}
                on:click={() => activeTab = 'credentials'}
            >
                Login Form
            </button>
        </div>

        <div class="p-6">
            <!-- OTP TAB -->
            {#if activeTab === 'otp'}
                <h2 class="text-xl font-bold text-white mb-4">Sign in with Email OTP</h2>

                <!-- OAuth Buttons -->
                <div class="space-y-4 mb-4">
                    <!-- Google -->
                    <button
                        on:click={loginWithGoogle}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                        disabled={isGoogleLoading}
                    >
                        {#if isGoogleLoading}
                            <span>Loading...</span>
                        {:else}
                            <img class="w-5" src="/google-icon.svg" alt="Google Icon" />
                            Sign in with Google
                        {/if}
                    </button>
                    <!-- Discord -->
                    <button
                        on:click={loginWithDiscord}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                        disabled={isDiscordLoading}
                    >
                        {#if isDiscordLoading}
                            <span>Loading...</span>
                        {:else}
                            <img class="w-5" src="/discord-icon.svg" alt="Discord Icon" />
                            Sign in with Discord
                        {/if}
                    </button>
                    <!-- Twitter -->
                    <button
                        on:click={loginWithTwitter}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                        disabled={isTwitterLoading}
                    >
                        {#if isTwitterLoading}
                            <span>Loading...</span>
                        {:else}
                            <img class="w-5" src="/x-icon.svg" alt="Twitter Icon" />
                            Sign in with Twitter
                        {/if}
                    </button>
                </div>

                <!-- Divider -->
                <div class="py-4 text-xs text-neutral-500 uppercase text-center">or</div>

                <!-- Email OTP Form -->
                <div>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        bind:value={email}
                        class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                        on:click={sendOtp}
                        class="mt-4 w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                        disabled={isSending}
                    >
                        {#if isSending}
                            Sending...
                        {:else}
                            Send OTP
                        {/if}
                    </button>
                </div>
            {/if}

            <!-- USERNAME/PASSWORD TAB -->
            {#if activeTab === 'credentials'}
                <h2 class="text-xl font-bold text-white mb-4">Login with Username/Password</h2>
                <!-- Error -->
                {#if loginError}
                    <p class="text-sm text-red-400 mb-2">{loginError}</p>
                {/if}

                <div class="space-y-4">
                    <input
                        type="text"
                        placeholder="Email or Username"
                        bind:value={username}
                        class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        bind:value={password}
                        class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
                    />
                    <button
                        on:click={loginWithCredentials}
                        class="mt-4 w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                        disabled={isPasswordLoginLoading}
                    >
                        {#if isPasswordLoginLoading}
                            Logging in...
                        {:else}
                            Login
                        {/if}
                    </button>

                    <!-- Forgot Password / Register Links -->
                    <div class="flex justify-between mt-2 text-sm text-neutral-400">
                        <a href="/reset-password" class="hover:text-neutral-200">Forgot Password?</a>
                        <a href="/register" class="hover:text-neutral-200">Register</a>
                    </div>
                </div>
            {/if}
        </div>
    </div>
</div>
<Toaster />