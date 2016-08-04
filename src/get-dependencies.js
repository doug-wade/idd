const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

export default fileContents => {
	const ast = babylon.parse(fileContents, {sourceType: 'module'});
	const deps = new Set();
	let arg;

	traverse(ast, {
		enter(path) {
			if (t.isExportDefaultDeclaration(path.node) && path.node.params && path.node.params[0] && path.node.params[0].properties) {
				path.node.params[0].properties.forEach(prop => {
					deps.add(prop.key.name);
				});
			} else if (t.isVariableDeclaration(path.node)) {
				path.node.declarations.forEach(n => {
					if (n.init && n.init.object && n.init.object.name && n.init.object.name === arg) {
						deps.add(n.id.name);
					}
				});
			} else if (t.isAssignmentExpression(path.node) && path.node.left.object && path.node.left.property.name === 'exports') {
				console.log(path.node.right);
				if (path.node.right && path.node.right.params && path.node.right.params[0]) {
					arg = path.node.right.params[0];
					console.log(arg);
				}
			} else if (t.isAssignmentExpression(path.node) && path.node.left.object.name === 'exports' && path.node.left.property.name === 'default') {
				if (path.node.right && path.node.right.params && path.node.right.params[0]) {
					arg = path.node.right.params[0].name;
				}
			}
		}
	});

	// TODO: we should use a visitor (maybe babel-traverse?) to walk the ast.
	// short term, maybe checking every body node to see if it is a declaration
	// with params would get us through the night?
	if (ast.program.body[0].declaration && ast.program.body[0].declaration.params[0]) {
		ast.program.body[0].declaration.params[0].properties.forEach(prop => {
			deps.add(prop.key.name);
		});
	}
	return deps;
};
