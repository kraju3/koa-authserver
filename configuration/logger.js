const log4js = require('log4js');
const config = require('./config.json')

log4js.configure({
    appenders:config.logger.appenders,
    categories:config.logger.categories
})

const logger = log4js.getLogger()


module.exports = logger;