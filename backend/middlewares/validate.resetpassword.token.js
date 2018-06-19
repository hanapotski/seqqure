const dotenv = require("dotenv");

const userServices = require("../services/users.service");
const responses = require("../models/responses");

const validate = (req, res, next) => {
  const token = req.params.token;

  userServices.confirmUserBeforeResetPassword(token).then(user => {
    if (user && user.resetPasswordId) {
      const now = new Date().getTime();
      const then = user.resetPasswordId.getTimestamp().getTime();
      const secsExpired = (now - then) / 1000;
      const expiration = +process.env.RESET_PASSWORD;
      if (secsExpired > expiration) {
        res.status(403).send(new responses.ErrorResponse("Link expired"));
        return;
      }
    } else {
      res.status(403).send(new responses.ErrorResponse("Link expired"));
      return;
    }
    next();
  });
};

module.exports = validate;
