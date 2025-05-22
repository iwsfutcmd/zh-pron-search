import initSqlJs from 'sql.js';
import { writeFileSync } from 'fs';

import data from './data/data.js';

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

const binaryArray = db.export();
writeFileSync('static/characters.sqlite', Buffer.from(binaryArray));

console.log('✅ Database written to static/characters.sqlite');
