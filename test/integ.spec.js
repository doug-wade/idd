import path from 'path';
import cp from 'child_process';
import test from 'ava';

test('runs arrow-functions', async t => {
	const results = await runFixture('functions');
	t.is(results.trim(), 'Hallo Wereld');
});

test('runs async-functions', async t => {
	const results = await runFixture('async-functions');
	t.is(results.trim(), 'Salamu Dunia!')
});

test('runs classes', async t => {
	const results = await runFixture('async-functions');
	t.is(results.trim(), 'سلام نړی')
});

test('runs example', async t => {
	const results = await runFixture('example');
	t.is(results.trim(), 'Hello World!');
});

test('runs functions', async t => {
	const results = await runFixture('functions');
	t.is(results.trim(), 'Bonjour le monde');
});

test('runs mocks', async t => {
	const results = await runFixture('mocks');
	t.is(results.trim(), 'Привет мир!');
});

test('runs the objects example', async t => {
	const results = await runFixture('objects');
	t.is(results.trim(), 'こんにちは世界');
});

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
