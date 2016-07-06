import test from 'ava';

import idd from '..';

test('idd can be required and called', t => {
	try {
		idd();
	} catch (e) {
		console.error(e);
		t.fail();
	}
	t.pass();
});
