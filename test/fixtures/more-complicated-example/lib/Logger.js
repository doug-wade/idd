import chalk from 'chalk';

export default () => class Logger {
	constructor() {
		this.level = process.env.LEVEL;
	}
	log(msg) {
		if (this.level !== 'quiet') {
			console.log(msg);
		}
	}
	error(msg) {
		if (this.level !== 'quiet' && this.level !== 'silent') {
			chalk.red(msg);
		}
	}
};
