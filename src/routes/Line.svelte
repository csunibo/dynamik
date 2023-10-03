<script lang="ts">
	export let name: string;
	export let href: string;
	export let icon: string;
</script>

<li>
	<a class="py-8 justify-center border-base-content border-2 mb-4" {href}> {icon} {name} {icon} </a>
</li>
