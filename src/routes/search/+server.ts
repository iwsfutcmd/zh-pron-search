import type { RequestHandler } from './$types';
import data from '$lib/data';

let db: any;

// Initialize database on server startup
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

// Initialize database when the server starts
initDb();

type DbResult = { values: [string, string][] };

export const GET: RequestHandler = async ({ url }) => {
	const regex = (url.searchParams.get('regex') || '').normalize('NFC');
	const system = url.searchParams.get('system') || '';
	const query = `
        SELECT pron, chars FROM ${system} WHERE regexp(?, pron);
    `;
	const res = db.exec(query, [regex]) as DbResult[];
	const results = res[0]?.values.map(([pron, chars]) => [pron, chars]) || [];

	return new Response(JSON.stringify(results));
};
