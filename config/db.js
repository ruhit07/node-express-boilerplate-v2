const { Sequelize } = require('sequelize');
const winston = require('../middlewares/winston');
const config = require('./config');

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 0,
      idle: 10000,
      acquire: 30000,
    },
    define: {
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const connectPostgreSQL = () => {
  sequelize.authenticate()
    .then(() => winston.info(`Postgre Database connected...`.yellow.bold))
    .catch(err => winston.error(`ERROR: ${err}`));
};


module.exports = {
  sequelize,
  Sequelize,
  connectPostgreSQL
};
