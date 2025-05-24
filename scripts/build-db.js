import initSqlJs from 'sql.js';
import { writeFileSync } from 'fs';

import data from './data/data.js';
import verifiers from './data/verifiers.js';

const SQL = await initSqlJs();
const db = new SQL.Database();
db.create_function('regexp', (pattern, text) => {
	if (typeof text !== 'string') return false;
	try {
		return new RegExp(`${pattern}`).test(text);
	} catch {
		return false;
	}
});

let debug = {};

Object.keys(data).forEach((system) => {
	debug[system] = new Set();
	db.run(`
            CREATE TABLE ${system} (
                pron TEXT PRIMARY KEY,
                chars TEXT
            );
        `);

	const insert = db.prepare(`INSERT INTO ${system} (pron, chars) VALUES (?, ?)`);

	for (const [pron, chars] of Object.entries(data[system])) {
		debug[system].add(pron);
		insert.run([pron, [...chars].join('')]);
	}
	insert.free();
	writeFileSync(
		`debug/${system}.txt`,
		[...debug[system]]
			.filter((pron) => !verifiers[system]?.test(pron))
			.sort()
			.join('\n')
	);
});

const binaryArray = db.export();
writeFileSync('static/characters.sqlite', Buffer.from(binaryArray));

console.log('✅ Database written to static/characters.sqlite');
