<script lang="ts">
	import systems from '$lib/systems';
	const LIMIT = 10;
	const search = async (regex: string, system: string, page: number) => {
		const params = new URLSearchParams();
		params.append('regex', regex);
		params.append('system', system);
		params.append('limit', `${LIMIT}`);
		params.append('page', `${page}`);
		const res = await fetch(`/api/search?${params.toString()}`);
		const data = await res.json();
		results = data.results;
		total = data.total;
		totalPages = Math.ceil(total / LIMIT);
	};
	let system = $state(systems[0]);
	let input = $state('');
	let page = $state(0);
	let total = $state(0);
	let results: [string, string][] = $state([]);
	let totalPages = $state(0);

	$effect(() => {
		if (input) {
			search(input, system, page);
		} else {
			results = [];
			total = 0;
			totalPages = 0;
		}
	});

	const previousPage = () => {
		if (page > 0) page--;
	};

	const nextPage = () => {
		if (page < totalPages - 1) page++;
	};
</script>

<main>
	<div id="header">
		<div id="options">
			<input type="search" bind:value={input} oninput={() => (page = 0)} />
			<select bind:value={system} onchange={() => (page = 0)}>
				{#each systems as key}
					<option value={key}>{key}</option>
				{/each}
			</select>
		</div>
		<div id="pagination">
			{#if totalPages > 1}
				<button onclick={previousPage} disabled={page === 0}>←</button>
				<button onclick={nextPage} disabled={page >= totalPages - 1}>→</button>
			{/if}
		</div>
	</div>
	<div id="results">
		{#if input}
			{#each results as [pron, chars]}
				<div class="pron">{pron}</div>
				<div>
					{#each chars as char}
						<a href={`https://en.wiktionary.org/wiki/${char}`} target="_blank">{char}</a>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
</main>

<style>
	main {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}
	#header {
		display: flex;
		position: sticky;
		inset-block-start: 0.5rem;
		flex-direction: column;
		gap: 0.5rem;
	}
	#options {
		display: flex;
		justify-content: space-between;
	}
	#pagination {
		display: flex;
		justify-content: space-between;
	}
	#pagination button {
		inline-size: 100%;
		block-size: 2rem;
	}
	#results .pron {
		text-align: center;
		font-family: sans-serif;
		font-size: 1.5rem;
	}
	#results a {
		display: inline-block;
		inline-size: 3rem;
		text-align: center;
		font-size: 3rem;
		text-decoration: none;
		color: black;
	}
</style>
