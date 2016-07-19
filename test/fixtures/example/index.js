import path from 'path';
import idd from '../../../..';

const {greeter, greet} = idd(path.join(__dirname, 'lib'));

greeter.greet();
greet();
