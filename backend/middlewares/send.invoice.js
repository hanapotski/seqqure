const responses = require("../models/responses");
const paymentsServices = require("../services/payments.service");
const tenantsServices = require("../services/tenants.service");
const mongodb = require("../mongodb.connection");
const ObjectId = mongodb.ObjectId;

const sendInvoice = (req, res, next) => {
  const escrowInfo = req.body.escrowInfo;
  if (escrowInfo.escrowStatus === "closed" && !escrowInfo.invoiceId) {
    tenantsServices
      .readById(ObjectId(req.session.passport.user.tenantId))
      .then(tenant => {
        paymentsServices
          .createInvoiceItem(tenant.stripeId)
          .then(response => {
            req.body.escrowInfo.invoiceId = response.id;
            next();
          })
          .catch(err =>
            res
              .status(401)
              .send(
                new responses.ErrorResponse("Please setup your stripe account")
              )
          );
      })
      .catch(err => res.status(401).send(new responses.ErrorResponse(err)));
  } else {
    next();
  }
};

module.exports = sendInvoice;
