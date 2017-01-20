export default async ({b}) => {
	const message = await b();
	console.log(message);
};
