# idd ![idd travis build status](https://travis-ci.org/doug-wade/idd.svg) ![idd appveyor build status](https://ci.appveyor.com/api/projects/status/github/doug-wade/idd?branch=master&svg=true) ![idd codecov status](https://img.shields.io/codecov/c/github/doug-wade/idd.svg)

A dependency injection system with destructuring.  Combines a common pattern
of using a single destructuring argument to avoid confusing the order of
arguments to high-parity functions, possibly with many optional parameters.


## Getting Started

To install the dependency injection system, use `npm install`

```shell
npm install --save idd
```

Then, from other peer directories, you can require the files as properties
on the directory's default export

lib/config.js

```javascript
export default {
	language: 'ru-ru',
	level: 'info'
};
```

lib/greet.js

```javascript
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
```

lib/logger.js

```javascript
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
```

index.js

```javascript
import path from 'path';
import idd from '../../../..';

const {greet} = idd(path.join(__dirname, 'lib'));

greet();
```

Then the output would be 'Hello World!'.  If you were to change config to be
instead 	

```javascript
export default function() {
	language: 'ru-ru',
	level: 'error'
}
```

There would be no output.


## Testing

A good dependency injection system should make unit testing easy.  To mock out
your dependencies, just provide an optional third option with the mocks

```javascript
import {sinon} from 'sinon';
import idd from 'idd';
import test from 'ava';

test('Greet was called', t => {
	const logger = { log: sinon.spy() };
	const config = { language: 'ru-ru', level: 'info' };
	const {greet} = idd(path.join(__dirname, 'lib'), { config, greet });

	greeter.greet();

	t.true(greet.calledOnce);
});
```
