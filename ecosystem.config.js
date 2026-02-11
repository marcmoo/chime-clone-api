const dotenv = require('dotenv');
const path = require('path');

const env = dotenv.config({
  path: path.resolve(__dirname, '.env'),
}).parsed || {};

module.exports = {
  apps: [
    {
      name: 'chime-api',
      script: 'dist/main.js',
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        ...env,
      },
    },
  ],
};
