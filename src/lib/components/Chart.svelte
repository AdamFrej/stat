<script lang="ts">
	import { Chart, Svg, Axis, Bars, Spline, Area, Points, Highlight, Tooltip, TooltipItem } from 'layerchart';
	import { scaleBand, scaleLinear, scalePoint } from 'd3-scale';
	import { format } from 'd3-format';
	import type { ChartType, DataPoint } from '$lib/types';

	let { data, type = 'bar', xKey = 'year', yKey = 'val' } = $props<{
		data: DataPoint[];
		type: ChartType;
		xKey?: string;
		yKey?: string;
	}>();

	// Determine the X scale based on chart type
	// Bars need bandwidth (scaleBand), Lines/Points work well with scalePoint for categorical data
	let scaleX = $derived(type === 'bar' ? scaleBand().padding(0.3) : scalePoint().padding(0.5));
</script>

<div class="h-[500px] w-full p-4 border rounded-xl border-gray-200 bg-white shadow-sm">
	<Chart
		{data}
		x={(d) => d[xKey]}
		xScale={scaleX}
		y={(d) => d[yKey]}
		yScale={scaleLinear()}
		yDomain={[0, null]}
		padding={{ top: 20, right: 20, bottom: 40, left: 60 }}
		tooltip={{ mode: 'bisect-x' }}
	>
		<Svg>
			<Axis placement="left" grid rule format={(d) => format('.2s')(d)} />
			<Axis placement="bottom" rule />

			{#if type === 'bar'}
				<Bars class="fill-blue-600 transition-all duration-300 hover:fill-blue-700" radius={4} />
			{:else if type === 'line'}
				<Spline class="stroke-blue-600 stroke-2" />
				<Points class="fill-white stroke-blue-600 stroke-2" radius={4} />
			{:else if type === 'area'}
				<Area class="fill-blue-600/20" line={{ class: "stroke-blue-600 stroke-2" }} />
				<Points class="fill-white stroke-blue-600 stroke-2" radius={4} />
			{:else if type === 'scatter'}
				<Points class="fill-blue-600/80 stroke-white" radius={6} />
			{/if}

			<Highlight area bar class="fill-transparent" />
		</Svg>

		<Tooltip header={(data) => data[xKey]} let:data>
			<TooltipItem label="Value" value={data[yKey]} format=",.2f" />
		</Tooltip>
	</Chart>
</div>
