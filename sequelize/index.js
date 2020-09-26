const Sequelize = require('sequelize');

const dbname = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const dbport = process.env.DB_PORT

const sequelize = new Sequelize(dbname, username, password, {
  host: process.env.DB_URL,
  port: dbport,
  dialect: 'postgres',
  ssl: 'Amazon RDS',
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');
    if (process.env.NODE_ENV === 'development') {
      console.log(sequelize.models)
      await sequelize.sync();
      console.log('All models synced.');
    }
  } catch (error) {
    console.log(error);
  }
}
)();

module.exports = sequelize;
