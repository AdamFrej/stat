<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="flex h-screen flex-col bg-gray-50 text-gray-900">
	<header class="flex h-14 shrink-0 items-center border-b border-gray-200 bg-white px-6 shadow-sm">
		<div class="flex items-center gap-2">
			<span class="text-xl font-bold tracking-tight text-blue-600">StatWorkspace</span>
		</div>
	</header>

	<main class="flex min-h-0 flex-1 overflow-hidden">
		{@render children()}
	</main>
</div>
