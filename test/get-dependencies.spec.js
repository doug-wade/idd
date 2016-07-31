import test from 'ava';
import getDeps from '../dist/get-dependencies.js';

test('can be required', t => {
	// this test doesn't succeed if the import at the top level failed...
	t.pass();
});

test('returns an empty set for a function with no dependencies', t => {
	const depSet = getDeps('export default () => { }');
	t.is(depSet.size, 0);
});

test('returns a single dependency for a function with one dependency', t => {
	const dep = 'foo';
	const depSet = getDeps('export default ({ ' + dep + ' }) => foo()');
	t.is(depSet.size, 1);
	t.true(depSet.has(dep));
});
