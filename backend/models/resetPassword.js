const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  password: Joi.string()
    .regex(/^(?=.*[0-9]).{6,}$/)
    .required()
};

module.exports = Joi.object().keys(schema);
