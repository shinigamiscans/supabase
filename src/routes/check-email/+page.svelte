<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    let email = ''; // Email entered by the user
    let otp = ['', '', '', '', '', '']; // OTP input values
    let isVerifying = false;
    let errorMessage = '';

    const verifyOtp = async () => {
        const token = otp.join(''); // Combine OTP digits
        if (!token || token.length !== 6) {
            errorMessage = 'Please enter all fields.';
            return;
        }

        isVerifying = true;
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });

            if (error) {
                console.error('Error verifying OTP:', error.message);
                errorMessage = 'Invalid OTP. Please try again.';
            } else {
                console.log('OTP verified successfully.');
                window.location.href = '/protected'; // Redirect to protected page
            }
        } finally {
            isVerifying = false;
        }
    };

    const handlePaste = (event) => {
        const pastedData = event.clipboardData.getData('text').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            otp = digits;
        }
    };

    // Load email from query string (if applicable)
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        email = params.get('email') || '';
        document.addEventListener('paste', handlePaste);
    });
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-950 text-white">
    <div class="mt-7 bg-zinc-950 border border-zinc-700 rounded-xl shadow-lg w-[28rem] p-6">
        <h1 class="text-2xl font-bold text-white mb-4">Enter OTP</h1>
        <p class="mb-6 text-sm text-neutral-400">
            A one-time password (OTP) has been sent to <span class="font-medium">{email}</span>. Enter it below to log in.
        </p>

        {#if errorMessage}
            <p class="text-sm text-red-500 mb-4">{errorMessage}</p>
        {/if}

        <div id="otp-form" class="flex gap-2 justify-center mb-6">
            {#each otp as value, index}
                <input
                    type="text"
                    maxlength="1"
                    bind:value={otp[index]}
                    on:input={(e) => otp[index] = e.target.value}
                    class="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-zinc-700 p-2 text-center text-2xl font-medium text-white outline-none sm:text-4xl focus:ring focus:ring-blue-500"
                />
            {/each}
        </div>

        <button
            on:click={verifyOtp}
            class="w-full py-3 px-4 bg-white text-zinc-800 font-medium rounded-lg hover:bg-gray-100 focus:outline-none"
            disabled={isVerifying}
        >
            {#if isVerifying}
                Verifying...
            {:else}
                Verify OTP
            {/if}
        </button>
    </div>
</div>
