<!-- src/routes/login/+page.svelte -->
<script>
    import { supabase } from '$lib/supabase'
    import { onMount } from 'svelte'
    import toast, { Toaster } from 'svelte-5-french-toast'

    let activeTab = 'social'
    onMount(() => {
        const p = new URLSearchParams(window.location.search)
        const t = p.get('tab')
        if (t === 'password') activeTab = 'credentials'
    })
    function switchTab(tab) {
        activeTab = tab
        const u = new URL(window.location.href)
        u.searchParams.set('tab', tab === 'credentials' ? 'password' : 'social')
        window.history.replaceState({}, '', u)
    }

    let email = ''
    let isSending = false
    let isGoogleLoading = false
    let isDiscordLoading = false
    let isTwitterLoading = false
    async function sendOtp() {
        if (!email) {
            toast.error('Please enter a valid email.', { style: 'border-radius: 8px; background: #333; color: #fff;' })
            return
        }
        isSending = true
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false }
            })
            if (error) {
                toast.error('Failed to send OTP.', { style: 'border-radius: 8px; background: #333; color: #fff;' })
            } else {
                toast.success('OTP sent. Check your email.', { style: 'border-radius: 8px; background: #333; color: #fff;' })
                setTimeout(() => {
                    window.location.href = `/check-email?email=${encodeURIComponent(email)}`
                }, 1500)
            }
        } finally {
            isSending = false
        }
    }
    async function loginWithGoogle() {
        isGoogleLoading = true
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
            if (error) toast.error('Google login failed.', { style: 'border-radius: 8px; background: #333; color: #fff;' })
        } finally {
            isGoogleLoading = false
        }
    }
    async function loginWithDiscord() {
        isDiscordLoading = true
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'discord' })
            if (error) toast.error('Discord login failed.', { style: 'border-radius: 8px; background: #333; color: #fff;' })
        } finally {
            isDiscordLoading = false
        }
    }
    async function loginWithTwitter() {
        isTwitterLoading = true
        try {
            const { error } = await supabase.auth.signInWithOAuth({ provider: 'twitter' })
            if (error) toast.error('Twitter login failed.', { style: 'border-radius: 8px; background: #333; color: #fff;' })
        } finally {
            isTwitterLoading = false
        }
    }

    let username = ''
    let password = ''
    let isPasswordLoginLoading = false
    let loginError = ''
    async function loginWithCredentials() {
        loginError = ''
        if (!username || !password) {
            loginError = 'Please enter email and password.'
            return
        }
        isPasswordLoginLoading = true
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email: username, password })
            if (error) {
                loginError = 'Login failed. Check your credentials.'
            } else if (data?.user) {
                window.location.href = '/protected'
            }
        } finally {
            isPasswordLoginLoading = false
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg w-96">
        <div class="flex border-b border-zinc-700">
            <button
                class="w-1/2 p-4 text-center hover:bg-zinc-800"
                class:font-bold={activeTab === 'social'}
                class:bg-zinc-800={activeTab === 'social'}
                on:click={() => { switchTab('social') }}
            >
                OTP
            </button>
            <button
                class="w-1/2 p-4 text-center hover:bg-zinc-800"
                class:font-bold={activeTab === 'credentials'}
                class:bg-zinc-800={activeTab === 'credentials'}
                on:click={() => { switchTab('credentials') }}
            >
                Password
            </button>
        </div>
        <div class="p-6">
            {#if activeTab === 'social'}
                <h2 class="text-xl font-bold mb-4">Sign in</h2>
                <div class="space-y-4 mb-4">
                    <button
                        on:click={loginWithGoogle}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                        disabled={isGoogleLoading}
                    >
                        {#if isGoogleLoading} Loading... {:else} <img class="w-5" src="/google-icon.svg" alt="Google" />  Google {/if}
                    </button>
                    <button
                        on:click={loginWithDiscord}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                        disabled={isDiscordLoading}
                    >
                        {#if isDiscordLoading} Loading... {:else} <img class="w-5" src="/discord-icon.svg" alt="Discord" />  Discord {/if}
                    </button>
                    <button
                        on:click={loginWithTwitter}
                        class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg bg-white text-zinc-900 hover:bg-gray-100 focus:outline-none"
                        disabled={isTwitterLoading}
                    >
                        {#if isTwitterLoading} Loading... {:else} <img class="w-5" src="/x-icon.svg" alt="Twitter" />  Twitter {/if}
                    </button>
                </div>
                <div class="py-4 text-xs text-neutral-500 uppercase text-center">or</div>
                <input
                    type="email"
                    placeholder="Enter your email"
                    bind:value={email}
                    class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                    on:click={sendOtp}
                    class="mt-4 w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                    disabled={isSending}
                >
                    {#if isSending} Sending... {:else} Send OTP {/if}
                </button>
            {/if}
            {#if activeTab === 'credentials'}
                <h2 class="text-xl font-bold mb-4">Login with Password</h2>
                {#if loginError}
                    <p class="text-sm text-red-400 mb-4">{loginError}</p>
                {/if}
                <input
                    type="text"
                    placeholder="Email"
                    bind:value={username}
                    class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white mb-4"
                />
                <input
                    type="password"
                    placeholder="Password"
                    bind:value={password}
                    class="w-full py-3 px-4 bg-zinc-700 text-sm rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-white mb-4"
                />
                <button
                    on:click={loginWithCredentials}
                    class="w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                    disabled={isPasswordLoginLoading}
                >
                    {#if isPasswordLoginLoading} Logging in... {:else} Login {/if}
                </button>
                <div class="flex justify-between mt-4 text-xs text-neutral-400">
                    <a href="/reset-password" class="hover:text-neutral-200">Forgot Password?</a>
                    <a href="/register" class="hover:text-neutral-200">Register</a>
                </div>
            {/if}
        </div>
    </div>
</div>
<Toaster />
