const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const schema = {
  escrowId: Joi.objectId(),
  personId: Joi.objectId(),
  securityRoleId: Joi.objectId(),
  _id: Joi.objectId(),
  tenantId: Joi.object(),
  createdById: Joi.object(),
  modifiedById: Joi.object(),
  modifiedDate: Joi.date()
};

module.exports = Joi.object().keys(schema);
