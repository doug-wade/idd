import path from 'path';
import cp from 'child_process';
import test from 'ava';

test('runs the example', async t => {
	const results = await runFixture('example');
	t.is(results.trim(), 'Hello World!\nHello World!');
});

test('runs the mocks', async t => {
	const results = await runFixture('mocks');
	t.is(results.trim(), 'Привет, мир!\nПривет, мир!');
});

// test('runs the more complicated example', async t => {
// 	const results = await runFixture('more-complicated-example');
// 	t.is(results.trim(), 'Привет, мир!');
// });

async function runFixture(fixture) {
	await exec('babel --presets=es2015 --out-dir build/ lib/*.js index.js', {cwd: path.join('fixtures', fixture)});
	return await exec('node ' + path.join('fixtures', fixture, 'build', 'index.js'));
}

function exec(cmd, opts) {
	return new Promise((resolve, reject) => {
		cp.exec(cmd, opts, (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}
