import fs from 'fs';
import path from 'path';

export default async function(dirname) {
	const members = await readdir(dirname);
	const destruct = {};
	members.forEach((member) => {
		console.log('requiring ' + member);
		destruct[member] = require(path.join(dirname, member));
	});
	return destruct;
};

function readdir(dir) {
	return new Promise(function (resolve, reject) {
		fs.readdir(dir, (error, contents) => {
			if (error) {
				console.error(error);
				reject(error);
			} else {
				resolve(contents);
			}
		});
	});
}
