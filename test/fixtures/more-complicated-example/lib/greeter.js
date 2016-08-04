export default ({config, Logger}) => {
	const l = new Logger();
	return {
		greet: () => {
			if (config.language === 'en-us') {
				l.log('Hello World!');
			} else if (config.language === 'ru-ru') {
				l.log('Привет, мир!');
			} else {
				l.error('unsupported language ' + config.language);
			}
		}
	};
};
