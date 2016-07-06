# idd

A dependency injection system with destructuring.  Combines a common pattern
of using a single destructuring argument to avoid confusing the order of
arguments to high-parity functions, possibly with many optional parameters.


## Getting Started

To install the dependency injection system, use `npm install`

    npm i -S idd

To provide a lib directory that has its interdependencies injected, add an
index.js with an import, invocation, and export

    cat "import idd from 'idd'; export default idd();" > lib/index.js

Then, from other peer directories, you can require the files as properties
on the directory's default export

lib/greeter.js

	export default () => {
		console.log('Hello World');
	};

index.js

	import {greeter} from './lib';
	greeter.greet();
	// Output:
	// Hello world!


## Usage

Of course, dependency injection isn't very interesting without dependencies,
so let's add a couple of dependencies

lib/config.js

	export default {
		language: 'en-us',
		level: 'info'
	}

lib/logger.js

	import chalk from 'chalk';
	export default class logger {
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
	}

lib/greeter.js

	export default ({config, logger}) => {
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

index.js

	import {greeter} from './lib';
	greeter.greet();
	// Output:
	// Hello World!
