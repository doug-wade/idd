# idd ![idd travis build status](https://travis-ci.org/doug-wade/idd.svg) ![idd appveyor build status](https://ci.appveyor.com/api/projects/status/github/doug-wade/idd?branch=master&svg=true) ![idd code coverage status](http://codecov.io/github/doug-wade/idd?branch=master)

A dependency injection system with destructuring.  Combines a common pattern
of using a single destructuring argument to avoid confusing the order of
arguments to high-parity functions, possibly with many optional parameters.


## Getting Started

To install the dependency injection system, use `npm install`

	npm i -S idd

Then, from other peer directories, you can require the files as properties
on the directory's default export

lib/config.js

	export default {
		language: 'en-us',
		level: 'info'
	}

lib/logger.js

	import chalk from 'chalk';
	export default class logger {
		constructor({config}) {
			this.level = config.level;
		}
		log(msg) {
			if (this.level !== 'quiet') {
				chalk.green(msg);
			}
		}
		error(msg) {
			if (this.level !== 'quiet' && this.level !== 'silent') {
				chalk.red(msg);
			}
		}
	}

lib/i18n.js

	export default ({config}) => {
		return (args) => {
			'en-us': ['Hello World!', 'implement me'],
			'ru-ru': ['Привет, мир!', 'реализовуюй меня']
			}[config.language](args);
		};
	};

index.js

```javascript
import idd from 'idd';

cosnt {greeter, logger} = idd('./lib');

logger.log(i18n(0));
try {
	throw new Error(1);
} catch (e) {
	logger.error(e);
	throw e;
}

// Output:
// Hello World!
// implement me
```

Of course, if you were to change config to be instead 	

```javascript
export default {
	language: 'ru-ru',
	level: 'error'
}
```

Then the ouput would be 'реализовуюй меня'.


## Testing

A good dependency injection system should make unit testing easy.  To mock out
your dependencies, just provide an optional third option with the mocks

```javascript
import {sinon} from 'sinon';
import idd from 'idd';

import {greeter} from idd('./lib', { config: { greeting: 'Hello World!'}});
greeter.greet();
```


## React Server

This makes structuring React Server projects small and easy to read

```javascript
import '../build/styles/index.css';
import React from 'react';
import {RootElement} from 'react-server';
import idd from 'idd';

const {actions, config, stores, components} = idd('..');
const {Header, TodoList, Footer} = components;

export default class IndexPage {
	handleRoute(next) {
		if (!config.SERVER_SIDE) {
			actions.pageView('index');
		}
		return next();
	}

	getTitle() {
		return 'React Server Todo';
	}

	getElements() {
		return [
			<RootElement key={0}>
				<Header/>
			</RootElement>,
			<RootElement when={stores.todoStore} key={1}>
				<TodoList/>
			</RootElement>
		];
	}
}
```
