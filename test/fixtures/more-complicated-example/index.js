import path from 'path';
import idd from '../../../..';

const {greeter} = idd(path.join(__dirname, 'lib'));

greeter.greet();
