import path from 'path';
import cp from 'child_proccess';
import test from 'ava';

test('runs the example', async t => {
	const results = await runFixture('example');
	t.is(results, 'Hello World!');
});

test('runs the more complicated example', async t => {
	const results = await runFixture('more-complicated');
	t.is(results, 'Привет, мир!');
});

function runFixture(fixture) {
	return new Promise((resolve, reject) => {
		cp.exec('node ' + path.join(fixture, 'index.js'), (error, stdout, stderr) => {
			if (error) {
				console.error(stderr);
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});
}
