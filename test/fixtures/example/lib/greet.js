export default ({config, Logger}) => {
	const logger = new Logger();
	switch (config.language) {
		case 'en-us':
			logger.log('Hello World!');
			break;
		case 'ru-ru':
			logger.log('Привет, мир!');
			break;
		default:
			logger.error('unsupported language ' + config.language);
			break;
	}
};
