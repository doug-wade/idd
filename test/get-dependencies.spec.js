import test from 'ava';
import getDeps from '../dist/get-dependencies';
import TYPES from '../dist/TYPES';
import {transform} from 'babel-core';

const REPLACE_TOKEN = '%s';
const EXPORT_TYPES = [
	'export default',
	'module.exports =',
	'exports.default ='
];

const TEMPLATES = [
	{ templ: `function (${REPLACE_TOKEN}) { }`, type: TYPES.function },
	{ templ: `(${REPLACE_TOKEN}) => { }`, type: TYPES.function },
	{ templ: `async function (${REPLACE_TOKEN}) { }`, type: TYPES.asyncFunction },
	{ templ: `async (${REPLACE_TOKEN}) => { }`, type: TYPES.asyncFunction },
	{ templ: `class TestClass { constructor(${REPLACE_TOKEN}) { } }`, type: TYPES.class }
];
const TEST_DEP = 'foo';
const TEST_DEPS = [TEST_DEP, 'bar', 'baz', 'quux'];

test('can be required', t => {
	// this test doesn't succeed if the import at the top level failed...
	t.pass();
});

EXPORT_TYPES.forEach(exportType => {
	test(`${exportType} { foo: "bar"}: no deps`, t => {
		const {babelified, unbabelified} = getCode({ exportType, template: '{ foo: "bar" }', deps: [] });
		const {deps, type} = getDeps(unbabelified);

		t.is(deps.size, 0);
		t.is(TYPES.object, type);
	});

	TEMPLATES.forEach(template => {
		const title = `${exportType} ${template.templ}`;
		test(title + ': no deps', t => {
			const {babelified, unbabelified} = getCode({ exportType, template: template.templ, deps: [] });
			const {deps, type} = getDeps(unbabelified);

			t.is(deps.size, 0);
			t.is(template.type, type);
		});

		test(title + ': one dependency', t => {
			const {babelified, unbabelified} = getCode({ exportType, template: template.templ, deps: [TEST_DEP] });
			const {deps, type} = getDeps(unbabelified);

			t.is(deps.size, 1);
			t.true(deps.has(TEST_DEP));
			t.is(template.type, type);
		});

		test(title + ': many dependencies', t => {
			const {babelified, unbabelified} = getCode({ exportType, template: template.templ, deps: TEST_DEPS });
			const {deps, type} = getDeps(unbabelified);

			t.is(deps.size, TEST_DEPS.length);
			TEST_DEPS.forEach(dep => t.true(deps.has(dep)));
			t.is(template.type, type);
		});
	});
});

function getCode({exportType, template, deps}) {
	const unbabelified = `${exportType} ${template.replace(REPLACE_TOKEN, '{' + deps.join(', ') + '}')};`;
	const {code} = transform(unbabelified, {presets: ["es2015", "stage-0"]});
	return {unbabelified, babelified: code};
}
