// This is ecosystem file for PM2

const pack = require('./package.json');

module.exports = {
  apps: [
      {
        name: pack.name,
        script: "./index.js",
        watch: false,
        instances: 1,
        env: {
          "NODE_ENV": "production", // development
          "CRON_RUN": 1
        }
      }
  ]
}