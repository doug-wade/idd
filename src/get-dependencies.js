const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');
const getSafe = require('./get-safe').default;
const TYPES = require('./types').default;

export default function getDependencies (fileContents) {
	const ast = babylon.parse(fileContents, {sourceType: 'module'});
	const deps = new Set();
	let type;
	let arg;

	traverse(ast, {
		enter(path) {
			let exported;

			if (t.isExportDefaultDeclaration(path.node)) {
				exported = path.node.declaration;
			} else if (isModuleExports(path.node) || isTranspiledExportDefault(path.node)) {
				exported = path.node.right;
			}

			if (exported) {
				let objectPattern;

				switch (exported.type) {
					case 'ObjectExpression':
						type = TYPES.object;
						break;
					case 'FunctionExpression':
					case 'FunctionDeclaration':
					case 'ArrowFunctionExpression':
						objectPattern = exported.params[0];
						type = exported.async ? TYPES.asyncFunction : TYPES.function;
						break;
					case 'ClassDeclaration':
					case 'ClassExpression':
						const constructor = exported.body.body.filter(node => node.kind === 'constructor')[0];
						objectPattern = constructor.params[0];
						type = TYPES.class;
						break;
					case 'CallExpression':
						console.log(exported.callee);
						break;
					default:
						console.error(`Unexpected node type ${exported.type}`);
				}

				if (objectPattern && objectPattern.properties) {
					objectPattern.properties.forEach(prop => {
						deps.add(prop.key.name);
					});
				}
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
