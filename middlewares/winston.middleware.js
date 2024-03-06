const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  filename: `${__dirname}/../logs/app-%DATE%.log`,
  datePattern: 'DD-MM-YYYY',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
});

// timezone function winston calls to get timezone(ASIA/Dhaka)
const timezoned = () => new Date().toLocaleString('en-US', {
  timeZone: 'Asia/Dhaka',
});

// options for logger object
const options = {
  file: {
    level: 'info',
    filename: `${__dirname}/../logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
    colorize: false
  },
  fileError: {
    level: 'error',
    filename: `${__dirname}/../logs/errors.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
    colorize: false
  },
  exception: {
    filename: `${__dirname}/../logs/exceptions.log`,
  },
  rejection: {
    filename: `${__dirname}/../logs/rejections.log`,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

// logger object with above defined options
const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.File(options.fileError),
    new winston.transports.Console(options.console),
    transport,
  ],
  exceptionHandlers: [
    new winston.transports.File(options.exception)
  ],
  rejectionHandlers: [
    new winston.transports.File(options.rejection)
  ],
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.timestamp({ format: timezoned, }),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  exitOnError: false,
});


// create a stream object with a 'write' function that will be used by `morgan`
// use the 'info' log level so the output will be picked up by both transports (file and console)
logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;