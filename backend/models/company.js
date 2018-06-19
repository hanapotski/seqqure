const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  name: Joi.string().required(),
  legalName: Joi.string().required(),
  street: Joi.string().required(),
  suite: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  zip: Joi.number()
    .integer()
    .required(),
  licenseNumber: Joi.number()
    .integer()
    .required(),
  taxIdNumber: Joi.string().required(),
  phones: Joi.array().items(Joi.object()),

  emails: Joi.array().items(Joi.object()),
  wireInstructionId: Joi.string().required(),

  licenseAgency: Joi.string().required(),

  licenseNumber: Joi.string().required(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date()
};

module.exports = Joi.object().keys(schema);
