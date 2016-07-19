import fs from 'fs';
import path from 'path';

export default function (dirname, mocks) {
	const members = readdir(dirname);
	const destruct = {};

	// For each of the dependencies in the injection dependency graph.  Eventually,
	// this should create a new dependency graph, and then kick off an in-order
	// traversal of the full graph afterwards.
	members.forEach(member => {
		// Import dependencies without the file extension.  This means that you
		// can't have files in the same directory that have the same name but
		// different extensions.
		const key = path.basename(member, path.extname(member));

		// previous mocks take precedence over currently existing mocks take
		// precendence over what is required.  I don't have any examples of using
		// the if case.
		if (process.mocks && process.mocks[key]) {
			destruct[key] = process.mocks[key];
		} else if (mocks && mocks[key]) {
			process.mocks = process.mocks || {};
			process.mocks[key] = mocks[key];
			destruct[key] = mocks[key];
		} else {
			// doug.wade 2016/07/18 I'm not sure how I would use import, since it has
			// to be top level.  As much as I don't like using common js requires, I
			// assume that node.js will provide an api for the import cache the same
			// as there is an api for the require cache.
			destruct[key] = require(path.join(dirname, member)).default;
		}
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
