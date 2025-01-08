<!-- src/routes/confirm/+page.svelte -->
<script>
    import { supabase } from '$lib/supabase'
    import { onMount } from 'svelte'

    let userEmail = ''
    let isResending = false
    let errorMessage = ''
    let resendSuccessMessage = ''

    onMount(() => {
        userEmail = localStorage.getItem('pendingEmail') || ''
    })

    async function resendVerification() {
        errorMessage = ''
        resendSuccessMessage = ''
        if (!userEmail) {
            errorMessage = 'No pending registration found.'
            return
        }
        isResending = true
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: userEmail,
                options: {
                    emailRedirectTo: `${import.meta.env.VITE_HOME_URL}/login?tab=password`
                }
            })
            if (error) {
                errorMessage = error.message
            } else {
                resendSuccessMessage = 'A new verification email has been sent. Check your inbox again.'
            }
        } finally {
            isResending = false
        }
    }

    function clearPendingEmail() {
        localStorage.removeItem('pendingEmail')
        userEmail = ''
        resendSuccessMessage = ''
        errorMessage = ''
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-900 border border-zinc-700 rounded-xl shadow-lg w-96 p-6">
        <h1 class="text-2xl font-bold mb-4">Registration Successful</h1>
        {#if userEmail}
            <p class="text-sm text-neutral-400 mb-4">
                We sent a verification link to <span class="font-medium">{userEmail}</span>. Check your inbox to complete registration.
            </p>
            {#if errorMessage}
                <p class="text-red-400 mb-4">{errorMessage}</p>
            {/if}
            {#if resendSuccessMessage}
                <p class="text-green-400 mb-4">{resendSuccessMessage}</p>
            {/if}
            <p class="text-sm text-neutral-400">Didn't receive the email?</p>
            <button
                on:click={resendVerification}
                class="mt-2 w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
                disabled={isResending}
            >
                {#if isResending}
                    Resending...
                {:else}
                    Resend Verification
                {/if}
            </button>
            <button
                on:click={clearPendingEmail}
                class="mt-2 w-full py-3 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none text-sm"
            >
                Cancel / Clear
            </button>
            <div class="mt-6 text-sm text-neutral-400">
                <a href="/login?tab=password" class="hover:text-neutral-200">Back to Login</a>
            </div>
        {:else}
            <p class="text-sm text-neutral-400 mb-4">
                No pending registration found.
            </p>
            <div class="mt-6 text-sm text-neutral-400">
                <a href="/register" class="hover:text-neutral-200">Register</a>
            </div>
        {/if}
    </div>
</div>
