import test from 'ava';
import TYPES from '../dist/types.js';

test('can be required', t => {
	// this test doesn't succeed if the import at the top level failed...
	t.pass();
});

test('has all the supported types', t => {
	t.truthy(!!TYPES.asyncFunction);
	t.truthy(!!TYPES.class);
	t.truthy(!!TYPES.function);
	t.truthy(!!TYPES.object);
});
