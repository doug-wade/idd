export default ({config, Logger}) => {
	const logger = new Logger();
	return {
		greet: () => {
			if (config.language === 'en-us') {
				logger.log('Hello World!');
			} else if (config.language === 'ru-ru') {
				logger.log('Привет, мир!');
			} else {
				logger.error('unsupported language ' + config.language);
			}
		}
	};
};
