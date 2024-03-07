const home = require("./home.route");


const user = require("./user.route");

module.exports = (app) => {
  app.use("/api/v2", home);

  app.use("/api/v2/users", user);
};
