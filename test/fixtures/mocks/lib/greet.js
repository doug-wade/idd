import path from 'path';
import idd from '../../../../..';

const {config} = idd(path.join(__dirname, '.'));

export default () => console.log(config.greeting);
