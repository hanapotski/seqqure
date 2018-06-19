const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  name: Joi.string().required(),
  organizationType: Joi.string().required(),
  legalName: Joi.string().required(),
  taxIdNumber: Joi.number().required(),
  addresses: Joi.array().required(),
  phones: Joi.array().items(Joi.object()),
  isAdmin: Joi.boolean(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date(),
  _id: Joi.objectId()
};

module.exports = Joi.object().keys(schema);
