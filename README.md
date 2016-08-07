# idd ![idd travis build status](https://travis-ci.org/doug-wade/idd.svg) ![idd appveyor build status](https://ci.appveyor.com/api/projects/status/github/doug-wade/idd?branch=master&svg=true)

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
export default function () {
	return {
		language: 'ru-ru',
		level: 'info'
	};
};
```

lib/greeter.js

```javascript
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
```

lib/Logger.js

```javascript
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
```

index.js

```javascript
import path from 'path';
import idd from '../../../..';

const {greeter} = idd(path.join(__dirname, 'lib'));

greeter.greet();
```

Then the output would be 'Hello World!'.  If you were to change config to be
instead 	

```javascript
export default function() {
	language: 'ru-ru',
	level: 'error'
}
```

Then the output would be 'Привет, мир!'.


## Testing

A good dependency injection system should make unit testing easy.  To mock out
your dependencies, just provide an optional third option with the mocks

```javascript
import {sinon} from 'sinon';
import idd from 'idd';
import test from 'ava';

test('Greet was called', t => {
	const greet = sinon.spy();
	const config = { greeting: 'Hello World!'};
	const {greeter} = idd('./lib', { config, greet });

	greeter.greet();

	t.true(greet.calledOnce);
});
```


## Roadmap

Idd is under active development.  Some planned features:

- Write a test case for requiring deeply nested dependency trees from the top level
- Write a test case for the React Server example
- Detect cycles in the graph and warn if the user adds a strict mode option
