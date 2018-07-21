import path from 'path';
import idd from '../../../..';

const {greet, config} = idd(path.join(__dirname, 'lib'), {
	config: {greeting: 'Привет мир!'}
});

greet();
