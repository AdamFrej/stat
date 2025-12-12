<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Chart from '$lib/components/Chart.svelte';
	import { fetchSubjects, fetchVariables, fetchData } from '$lib/api';
	import type { GusSubject, GusVariable, ChartType, DataPoint } from '$lib/types';

	// State
	let subjects = $state<GusSubject[]>([]);
	let variables = $state<GusVariable[]>([]);

	let selectedSubjectId = $state<string | null>(null);
	let selectedVariableId = $state<number | string | null>(null);

	let chartType = $state<ChartType>('bar');

	let chartData = $state<DataPoint[]>([]);
	let loadingData = $state(false);
	let loadingVariables = $state(false);
	let error = $state<string | null>(null);

	// Load initial subjects
	onMount(async () => {
		try {
			// Fetch top-level categories (e.g., K1 = Environment, K2 = People, etc.)
			// Assuming the API returns root subjects when no parent-id is provided or specific known roots.
			// The GUS API structure is complex, usually 'subjects' returns a tree.
			// Let's try fetching root subjects.
			subjects = await fetchSubjects();
		} catch (e) {
			console.error('Failed to load subjects', e);
			error = 'Failed to load data categories. The API might be unavailable.';
		}
	});

	// Effect: Load variables when subject changes
	$effect(() => {
		if (selectedSubjectId) {
			loadVariables(selectedSubjectId);
		} else {
			variables = [];
			selectedVariableId = null;
		}
	});

	// Effect: Load data when variable changes
	$effect(() => {
		if (selectedVariableId) {
			loadData(selectedVariableId);
		} else {
			chartData = [];
		}
	});

	async function loadVariables(subjectId: string) {
		loadingVariables = true;
		error = null;
		try {
			variables = await fetchVariables(subjectId);
			selectedVariableId = null; // Reset selection
		} catch (e) {
			console.error('Failed to load variables', e);
			error = 'Failed to load variables for this category.';
		} finally {
			loadingVariables = false;
		}
	}

	async function loadData(variableId: number | string) {
		loadingData = true;
		error = null;
		try {
			// Fetch last 10 years of data
			const currentYear = new Date().getFullYear();
			const response = await fetchData(variableId, currentYear - 10, currentYear);

			// Transform API response to generic DataPoint[]
			// Assuming response.results[0].values holds the time series
			if (response.results && response.results.length > 0) {
				chartData = response.results[0].values.map(v => ({
					year: v.year,
					val: v.val
				}));
			} else {
				chartData = [];
				error = 'No data available for this variable.';
			}
		} catch (e) {
			console.error('Failed to load data', e);
			error = 'Failed to load visualization data.';
		} finally {
			loadingData = false;
		}
	}
</script>

<div class="flex h-full w-full">
	<Sidebar
		{subjects}
		{variables}
		bind:selectedSubjectId
		bind:selectedVariableId
		bind:chartType
		{loadingVariables}
	/>

	<div class="flex-1 overflow-y-auto bg-white p-8">
		<div class="mx-auto max-w-5xl">
			<div class="mb-8">
				<h1 class="text-2xl font-bold text-gray-900">
					{#if selectedVariableId && variables.find(v => v.id === selectedVariableId)}
						{variables.find(v => v.id === selectedVariableId)?.n1}
					{:else}
						Workspace
					{/if}
				</h1>
				<p class="text-gray-500">
					{#if selectedSubjectId && subjects.find(s => s.id === selectedSubjectId)}
						{subjects.find(s => s.id === selectedSubjectId)?.name}
					{:else}
						Select a category and variable to generate a graph.
					{/if}
				</p>
			</div>

			{#if error}
				<div class="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
					{error}
				</div>
			{/if}

			{#if loadingData}
				<div class="flex h-[500px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
					<div class="flex flex-col items-center gap-3 text-gray-400">
						<div class="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"></div>
						<p>Loading data...</p>
					</div>
				</div>
			{:else if chartData.length > 0}
				<Chart data={chartData} type={chartType} xKey="year" yKey="val" />
			{:else if !selectedVariableId}
				<div class="flex h-[500px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
					<div class="text-center text-gray-400">
						<p>No data selected</p>
						<p class="text-sm">Use the sidebar to choose a dataset</p>
					</div>
				</div>
			{/if}

			{#if chartData.length > 0}
				<div class="mt-8 rounded-lg border border-gray-200">
					<table class="min-w-full divide-y divide-gray-200 text-sm">
						<thead class="bg-gray-50">
							<tr>
								<th class="px-4 py-3 text-left font-medium text-gray-700">Year</th>
								<th class="px-4 py-3 text-right font-medium text-gray-700">Value</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-gray-200 bg-white">
							{#each chartData as row}
								<tr>
									<td class="px-4 py-2 text-gray-900">{row.year}</td>
									<td class="px-4 py-2 text-right text-gray-600 font-mono">{row.val}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	</div>
</div>
