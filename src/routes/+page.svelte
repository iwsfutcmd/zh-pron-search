<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { type Database } from 'sql.js';
	import data from '$lib/data';
	let system = 'GwongDung';
	let input = '';
	let db: Database;

	const search = (regex: string, system: string) => {
		const query = `
            SELECT pron, chars FROM ${system} WHERE regexp('${regex}', pron);
        `;
		const res = db.exec(query);
		return res[0]?.values || [];
	};

	onMount(async () => {
		if (!browser) return;

		const initSqlJs = (await import('sql.js')).default;
		const wasmUrl = (await import('sql.js/dist/sql-wasm.wasm?url')).default;

		const SQL = await initSqlJs({
			locateFile: () => wasmUrl
		});

		db = new SQL.Database();
		db.create_function('regexp', (pattern: string, text: string) => {
			try {
				return new RegExp(pattern).test(text);
			} catch {
				return false;
			}
		});
		Object.keys(data).forEach((system) => {
			db.run(`
                CREATE TABLE ${system} (
                pron TEXT PRIMARY KEY,
                chars TEXT
                );
            `);

			const insert = db.prepare(`INSERT INTO ${system} (pron, chars) VALUES (?, ?)`);

			for (const [pron, chars] of Object.entries(data[system])) {
				insert.run([pron, chars.join('')]);
			}
			// for (const [char, entries] of GwongDungRawData) {
			// 	for (const entry of entries) {
			// 		insert.run([entry[0], char]);
			// 	}
			// }
			insert.free();
		});
		// Set up schema, insert data, etc.
	});
</script>

<div id="options">
	<input type="text" bind:value={input} />

	<select bind:value={system}>
		{#each Object.keys(data) as key}
			<option value={key}>{key}</option>
		{/each}
	</select>
</div>
<div id="results">
	{#if input}
		{#each (search(input, system) ?? []).toSorted() as [pron, chars]}
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
