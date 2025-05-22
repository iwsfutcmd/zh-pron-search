import type { RequestHandler } from './$types';
import data from '$lib/data';
import type { Config } from '@sveltejs/adapter-vercel';

export const config: Config = {
	runtime: 'edge'
};

let db: any;

const initDb = async () => {
	const initSqlJs = (await import('sql.js')).default;
	const SQL = await initSqlJs();

	db = new SQL.Database();
	db.create_function('regexp', (pattern: string, text: string) => {
		try {
			return new RegExp(`${pattern}`).test(text);
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
			insert.run([pron, [...chars].join('')]);
		}
		insert.free();
	});
};

initDb();

type DbResult = { values: [string, string][] };

export const GET: RequestHandler = async ({ url }) => {
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
