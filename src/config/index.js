import development from './environments/development';
import production from './environments/production';

const configs = {
    development,
    production,
};

// eslint-disable-next-line no-undef
export default configs[process.env.NODE_ENV] || configs.development;
