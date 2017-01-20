import chalk from 'chalk';

export default class Logger {
	constructor({config}) {
		this.level = config.level;
	}
	log(msg) {
		if (this.level !== 'quiet') {
			console.log(msg);
		}
	}
	error(msg) {
		if (this.level !== 'quiet' && this.level !== 'silent') {
			console.log(chalk.red(msg));
		}
	}
};
