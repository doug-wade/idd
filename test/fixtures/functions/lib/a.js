export default ({b}) => () => {
	b();
	console.log('hello from a!');
};
