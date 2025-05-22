<script lang="ts">
	const search = async (query: { regex: string; system: string }) => {
		const params = new URLSearchParams();
		params.append('regex', query.regex);
		params.append('system', query.system);
		const res = await fetch(`/search?${params.toString()}`);
		return await res.json();
	};
	const systems = ['GwongDung', 'PinYin', 'SouTseu', 'TungDzih', 'TsyetHjunH'];
	let system = $state(systems[0]);
	let input = $state('');
	let results: [string, string][] = $state([]);

	$effect(() => {
		if (input) {
			search({ regex: input, system }).then((newResults) => {
				results = newResults;
			});
		} else {
			results = [];
		}
	});
</script>

<div id="options">
	<input type="search" bind:value={input} />

	<select bind:value={system}>
		{#each systems as key}
			<option value={key}>{key}</option>
		{/each}
	</select>
</div>
<div id="results">
	{#if input}
		{#each results as [pron, chars]}
			<div>{pron}</div>
			<div>
				{#each chars as char}
					<a href={`https://en.wiktionary.org/wiki/${char}`} target="_blank">{char}</a>
				{/each}
			</div>
		{/each}
	{/if}
</div>

<style>
	#options {
		display: flex;
		justify-content: space-between;
		inline-size: 100%;
	}

	#results {
	}
	#results a {
		font-size: 3rem;
		text-decoration: none;
		color: black;
	}
</style>
