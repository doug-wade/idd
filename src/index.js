import fs from 'fs';
import path from 'path';
import getDeps from './get-dependencies';

export default function (opts) {
	let dirname;
	let mocks;
	if (typeof opts === 'string') {
		dirname = opts;
		mocks = {};
	} else {
		dirname = opts.dirname;
		mocks = opts.mocks;
	}
	const members = readdir(dirname);
	const destruct = {};
	const visited = new Set();

	// TODO: side-effects aren't very functional...
	members.forEach(member => loadDep({destruct, dirname, member, mocks, visited}));

	return destruct;
}

function loadDep({destruct, dirname, member, mocks, visited}) {
	// Import dependencies without the file extension.  This means that you
	// can't have files in the same directory that have the same name but
	// different extensions.
	const key = path.basename(member, path.extname(member));

	// We have already loaded this member if it is a dependency of a previous
	// member.  If so, skip it.
	if (visited.has(key)) {
		return;
	}

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
		const contents = readfile(path.join(dirname, member));
		let deps = getDeps(contents);
		for (let dep of deps.keys()) {
			if (!visited.has(dep)) {
				loadDep({destruct, dirname, member: dep + '.js', mocks, visited});
			}
		}
		const modulePath = path.join(dirname, member);
		// We pass a halfway constructed version of each module to itself in its
		// constructor.  We could take __filename as a parameter and remove it
		// explicitly, but better would be to detect the cycle and throw an error,
		// if configured by the user.
		const module = require(modulePath);
		destruct[key] = module.default(destruct);
	}

	visited.add(key);
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

function readfile(filepath) {
	let contents;
	try {
		contents = fs.readFileSync(filepath).toString();
	} catch (err) {
		console.error(err);
		throw err;
	}
	return contents;
}
