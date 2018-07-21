const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const getSafe = require('./get-safe').default;
const TYPES = require('./types').default;

export default function getDependencies (fileContents) {
	const ast = babylon.parse(fileContents, {sourceType: 'module'});
	const deps = new Set();
	const variables = {};
	let type;
	let arg;

	traverse(ast, {
		enter(path) {
			let exported;

			if (t.isExportDefaultDeclaration(path.node)) {
				exported = path.node.declaration;
			} else if (isModuleExports(path.node) || isTranspiledExportDefault(path.node)) {
				exported = path.node.right;
			} else if (t.isVariableDeclaration(path.node)) {
				path.node.declarations.forEach(declaration => {
					variables[declaration.id.name] = path.node;
				});
			}

			if (exported) {
				type = parseNode(exported, deps);
			}
		}
	});
	return { deps, type };
};

function isModuleExports (node) {
	return t.isAssignmentExpression(node) && node.left.object && node.left.property.name === 'exports';
}

function isTranspiledExportDefault (node) {
	return t.isAssignmentExpression(node) && node.left.object && node.left.object.name === 'exports';
}

function parseNode(node, deps) {
	let objectPattern;
	let type;

	switch (node.type) {
		case 'Identifier':
			// babelified classes come this way
			console.log('itsa class!');
			console.log(node);
			break;
		case 'ObjectExpression':
			type = TYPES.object;
			break;
		case 'FunctionExpression':
		case 'FunctionDeclaration':
		case 'ArrowFunctionExpression':
			objectPattern = node.params[0];
			type = node.async ? TYPES.asyncFunction : TYPES.function;
			break;
		case 'ClassDeclaration':
		case 'ClassExpression':
			const constructor = node.body.body.filter(n => n.kind === 'constructor')[0];
			objectPattern = constructor.params[0];
			type = TYPES.class;
			break;
		case 'CallExpression':
			// babelified async functions come this way
			console.log(node.callee);
			break;
		default:
			console.error(`Unexpected node type ${node.type}`);
	}

	if (objectPattern && objectPattern.properties) {
		objectPattern.properties.forEach(prop => {
			deps.add(prop.key.name);
		});
	}

	return type;
}
