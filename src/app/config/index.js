import development from './development'
//import staging from './staging'
//import production from './production'

const env = process.env.NODE_ENV || 'development';

const config = {
  development,
//  staging,
//  production,
};

export default config[env];
