const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

export default fileContents => {
	const ast = babylon.parse(fileContents, {sourceType: 'module'});
	const deps = new Set();

	traverse(ast, {
		enter(path) {
			if (t.isExportDefaultDeclaration(path.node) && path.node.params && path.node.params[0] && path.node.params[0].properties) {
				path.node.params[0].properties.forEach(prop => {
					deps.add(prop.key.name);
				});
			} else if (t.isVariableDeclaration(path.node)) {
				path.node.declarations.forEach(n => {
					if (!n.id.name.startsWith('_')) {
						deps.add(n.id.name);
					}
				});
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
