<script lang="ts">
	import type { GusSubject, GusVariable, ChartType } from '$lib/types';
	import { BarChart3, LineChart, AreaChart, ScatterChart, Database } from 'lucide-svelte';

	let {
		subjects = [],
		variables = [],
		selectedSubjectId = $bindable(),
		selectedVariableId = $bindable(),
		chartType = $bindable('bar'),
		loadingVariables = false
	} = $props<{
		subjects: GusSubject[];
		variables: GusVariable[];
		selectedSubjectId: string | null;
		selectedVariableId: number | string | null;
		chartType: ChartType;
		loadingVariables: boolean;
	}>();

	const chartTypes: { value: ChartType; label: string; icon: any }[] = [
		{ value: 'bar', label: 'Bar', icon: BarChart3 },
		{ value: 'line', label: 'Line', icon: LineChart },
		{ value: 'area', label: 'Area', icon: AreaChart },
		{ value: 'scatter', label: 'Scatter', icon: ScatterChart }
	];
</script>

<aside class="flex h-full w-80 flex-col gap-8 overflow-y-auto border-r border-gray-200 bg-gray-50 p-6">
	<div>
		<h2 class="mb-1 flex items-center gap-2 text-lg font-semibold text-gray-900">
			<Database class="h-5 w-5" /> Data Source
		</h2>
		<p class="mb-4 text-sm text-gray-500">Select data from Statistics Poland</p>

		<div class="space-y-4">
			<!-- Subject Select -->
			<div>
				<label for="subject" class="mb-1 block text-sm font-medium text-gray-700">Category</label>
				<select
					id="subject"
					bind:value={selectedSubjectId}
					class="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
				>
					<option value={null}>Select a category...</option>
					{#each subjects as subject}
						<option value={subject.id}>{subject.name}</option>
					{/each}
				</select>
			</div>

			<!-- Variable Select -->
			<div>
				<label for="variable" class="mb-1 block text-sm font-medium text-gray-700">Variable</label>
				<select
					id="variable"
					bind:value={selectedVariableId}
					disabled={!selectedSubjectId || loadingVariables}
					class="w-full rounded-md border border-gray-300 bg-white p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
				>
					{#if loadingVariables}
						<option>Loading variables...</option>
					{:else if variables.length === 0 && selectedSubjectId}
						<option value={null}>No variables available</option>
					{:else}
						<option value={null}>Select a variable...</option>
						{#each variables as variable}
							<option value={variable.id}>{variable.n1}</option>
						{/each}
					{/if}
				</select>
			</div>
		</div>
	</div>

	<div class="border-t border-gray-200 pt-6">
		<h2 class="mb-4 text-lg font-semibold text-gray-900">Visualization</h2>

		<div class="grid grid-cols-2 gap-3">
			{#each chartTypes as type}
				<button
					class="flex flex-col items-center justify-center gap-2 rounded-lg border p-3 transition-all duration-200 {chartType ===
					type.value
						? 'bg-blue-50 text-blue-700 ring-1 ring-blue-500 border-blue-500'
						: 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'}"
					onclick={() => (chartType = type.value)}
				>
					<type.icon class="h-6 w-6" />
					<span class="text-xs font-medium">{type.label}</span>
				</button>
			{/each}
		</div>
	</div>
</aside>
