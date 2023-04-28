const logger = require("../startup/logger");
module.exports = function (err, req, res, next) {
  //logging işlemi
  logger.log("error", err.message);
  res.status(500).send("Server Hatası");
};
