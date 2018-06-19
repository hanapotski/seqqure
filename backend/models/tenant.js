const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  tenantName: Joi.string().required(),
  street: Joi.string().required(),
  suite: Joi.string().allow(""),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.number()
    .integer()
    .required(),
  slogan: Joi.string().required(),
  accountNumber: Joi.number()
    .integer()
    .required(),
  subscriptionStatus: Joi.string().required(),
  licenseAgency: Joi.string().required(),
  licenseType: Joi.string().required(),
  licenseNumber: Joi.string().required(),
  stripeId: Joi.string().allow(""),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date(),
  _id: Joi.objectId()
};

module.exports = Joi.object().keys(schema);
