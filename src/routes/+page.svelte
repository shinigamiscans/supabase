<script>
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    onMount(async () => {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
            // Redirect to protected if logged in
            window.location.href = '/protected';
        } else {
            // Redirect to login if not logged in
            window.location.href = '/login';
        }
    });
</script>

<div class="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
    <p>Loading...</p>
</div>
