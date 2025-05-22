import type { RequestHandler } from './$types';

let db: any = null;

type DbResult = { values: [string, string][] };

export const GET: RequestHandler = async ({ fetch, url }) => {
	if (!db) {
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
	}
	const regex = (url.searchParams.get('regex') || '').normalize('NFC');
	const system = url.searchParams.get('system') || '';
	const page = parseInt(url.searchParams.get('page') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = page * limit;

	const countQuery = `
        SELECT COUNT(*) as count FROM ${system} WHERE regexp(?, pron);
    `;
	const countRes = db.exec(countQuery, [regex]) as DbResult[];
	const total = countRes[0]?.values[0][0] || '0';

	const query = `
        SELECT pron, chars FROM ${system} WHERE regexp(?, pron)
        ORDER BY pron
        LIMIT ? OFFSET ?;
    `;
	const res = db.exec(query, [regex, limit, offset]) as DbResult[];
	const results = res[0]?.values.map(([pron, chars]) => [pron, chars]) || [];

	return new Response(
		JSON.stringify({
			results,
			total: parseInt(total)
		})
	);
};
