import test from 'ava';
import getSafe from '../dist/get-safe.js';

test('can be required', t => {
	// this test doesn't succeed if the import at the top level failed...
	t.pass();
});

test('retrieves a deeply nested object', t => {
	const expected = 'an expected string';
	const obj = {
		path: {
			to: {
				deeply: {
					nested:{
						value: expected
					}
				}
			}
		}
	};

	const actual = getSafe(obj, 'path.to.deeply.nested.value');

	t.is(actual, expected);
});

test('retrieves a nested object with array access', t => {
	const expected = 'an expected string';
	const obj = {
		a: { b: [ {c: 'erroneous' }, {c: expected}] }
	};

	const actual = getSafe(obj, 'a.b[1].c');

	t.is(actual, expected);
});

test('returns undefined for missing paths', t => {
	const obj = {};

	const actual = getSafe(obj, 'path.to.deeply.nested.value');

	t.is(actual, undefined);
});

test('returns undefined for missing array access', t => {
	const obj = {
		a: { b: [] }
	};

	const actual = getSafe(obj, 'a.b[1].c');

	t.is(actual, undefined);
});

test('returns undefined for undefined object', t => {
	const obj = undefined;

	const actual = getSafe(obj, 'path.to.deeply.nested.value');

	t.is(actual, undefined);
});
