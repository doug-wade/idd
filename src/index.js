import fs from 'fs';
import path from 'path';
import getDeps from './get-dependencies';
import TYPES from './types';

export default function idd (opts) {
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
		const contents = readfile(path.join(dirname, member));
		let {deps, type} = getDeps(contents);
		for (let dep of deps.keys()) {
			if (!visited.has(dep)) {
				loadDep({destruct, dirname, member: dep + '.js', mocks, visited});
			}
		}
		const modulePath = path.join(dirname, member);
		let mod = require(modulePath);
		if (mod.default) {
			mod = mod.default;
		}
		switch (type) {
			case TYPES.object:
				destruct[key] = mod;
				break;
			case TYPES.function:
				destruct[key] = (...args) => { return mod(destruct, ...args); }
				break;
			case TYPES.class:
				destruct[key] = class IddWrapperClass extends mod {
					constructor(...args) {
						super(destruct, ...args);
					}
				}
			case TYPES.asyncFunction:
				destruct[key] = async (...args) => {
					await mod(destruct, ...args);
				}
			default:
				console.error('Unexpected export type ' + type);
				break;
		}
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
