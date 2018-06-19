const responses = require("../models/responses");
const companyService = require("../services/company.service");

const readAll = (req, res) => {
  const tenantId = req.session.passport.user.tenantId;

  companyService
    .readAll(tenantId)
    .then(company => {
      const responseModel = new responses.ItemsResponse();
      responseModel.items = company;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const update = (req, res) => {
  const tenantId = req.session.passport.user.tenantId;

  companyService
    .update(tenantId, req.model)
    .then(company => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse());
    });
};


module.exports = { readAll, update };
