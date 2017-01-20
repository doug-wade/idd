import path from 'path';
import idd from '../../../..';

const {logger} = idd(path.join(__dirname, 'lib'));
log = new Logger('verbose');

log.info('hello world');
