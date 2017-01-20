import path from 'path';
import idd from '../../../..';

const {greet} = idd(path.join(__dirname, 'lib'));

greet();
