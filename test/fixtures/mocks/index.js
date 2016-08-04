import path from 'path';
import idd from '../../../..';

const {greet, config} = idd({
	dirname: path.join(__dirname, 'lib'),
	mocks: {config: {greeting: 'Привет, мир!'}}
});
greet();
console.log(config.greeting);
