import path from 'path';
import idd from '../../../..';

const {config} = idd(path.join(__dirname, 'lib'));

console.log(config.greeting);
