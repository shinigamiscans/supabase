<script>
    import '../app.css'; // Import the global CSS
    import { supabase } from '$lib/supabase';
    import { onMount } from 'svelte';

    onMount(async () => {
        // Ensure session fetch only runs on the client
        const { data } = await supabase.auth.getSession();
        if (!data?.session && window.location.pathname === '/protected') {
            // Redirect to login if not logged in
            window.location.href = '/login';
        }
    });
</script>

<slot />
