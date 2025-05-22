<script lang="ts">
	import { onMount } from 'svelte';
	import type { Database } from 'sql.js';
	const LIMIT = 10;

	const search = (regex: string, system: string, page: number) => {
		const offset = page * LIMIT;

		const countQuery = `
            SELECT COUNT(*) as count FROM ${system} WHERE regexp(?, pron);
        `;
		const countRes = db.exec(countQuery, [regex]);
		total = (countRes[0]?.values[0][0] as number) ?? 0;

		const query = `
            SELECT pron, chars FROM ${system} WHERE regexp(?, pron)
            ORDER BY pron
            LIMIT ? OFFSET ?;
        `;
		const res = db.exec(query, [regex, LIMIT, offset]);
		results = res[0]?.values.map(([pron, chars]) => [pron as string, chars as string]) ?? [];

		totalPages = Math.ceil(total / LIMIT);
	};
	let system = $state('');
	let input = $state('');
	let page = $state(0);
	let total = $state(0);
	let results: [string, string][] = $state([]);
	let systems = $state([] as string[]);

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
	let db: Database;
	onMount(async () => {
		const initSqlJs = (await import('sql.js')).default;
		const SQL = await initSqlJs({
			locateFile: () => '/sql-wasm.wasm'
		});
		const res = await fetch('/characters.sqlite');
		const buffer = await res.arrayBuffer();

		db = new SQL.Database(new Uint8Array(buffer));
		db.create_function('regexp', (pattern: string, value: string) => {
			if (typeof value !== 'string') return false;
			try {
				return new RegExp(pattern).test(value);
			} catch {
				return false;
			}
		});

		const tableQuery = "SELECT name FROM sqlite_master WHERE type='table';";
		const tableResult = db.exec(tableQuery);
		systems = tableResult[0]?.values.map((row) => row[0] as string) ?? [];
		system = systems[0];
	});
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
