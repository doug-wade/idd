import fs from 'fs';
import path from 'path';

export default function (dirname) {
	const members = readdir(dirname);
	const destruct = {};
	members.forEach(member => {
		const key = path.basename(member, path.extname(member));
		destruct[key] = require(path.join(dirname, member)).default;
	});
	return destruct;
}

function readdir(dir) {
	let contents;
	try {
		contents = fs.readdirSync(dir);
	} catch (err) {
		console.error(err);
		throw err;
	}
	return contents;
}
