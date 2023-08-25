<script lang="ts">
	import settings from '$lib/settings';
    import { page } from '$app/stores';
    
    
    const client_id = '38c53abf6a4cf6666d15'
    const url= `https://github.com/login/oauth/authorize?scope=user:email%20repo&client_id=${client_id}&state=${btoa($page.url.pathname)}`
</script>

{#if ($settings.githubToken === undefined ) } 
    <a class='btn' href='{url}'>
    Login
    </a>
{:else}
    <buggon class='btn'>
        Upload File
    </buggon>
{/if}

