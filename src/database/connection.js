const Sequelize = require("sequelize");

const sequelize = new Sequelize("todo-app", "postgres", "postgres", {
  host: "127.0.0.1",
  dialect: "postgres"
});

sequelize.authenticate().then(() => {
  console.log("Connection with PostgreSQL has been established successfully.");
}).catch((error) => {
  console.error('Unable to connect to the database:', error);
});

module.exports = sequelize;
global.sequelize = sequelize;