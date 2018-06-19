const responses = require("../models/responses");
const escrowPeopleService = require("../services/escrow.people.service");
const apiPrefix = "/api/escrowPeople";

module.exports = {
  readAll,
  search,
  create,
  update,
  delete: _delete
};

function readAll(req, res) {
  escrowPeopleService
    .readAll(req.params.escrowId)
    .then(people => {
      const responseModel = new responses.ItemsResponse();
      responseModel.items = people;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function search(req, res) {
  const tenantId = req.session.passport.user.tenantId;
  escrowPeopleService
    .search(req.params.name, tenantId)
    .then(people => {
      const responseModel = new responses.ItemsResponse();
      responseModel.item = people;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function create(req, res) {
  escrowPeopleService
    .create(req.model)
    .then(id => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = id;
      res
        .status(201)
        .location(`${apiPrefix}/${id}`)
        .json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function update(req, res) {
  escrowPeopleService
    .update(req.params.id, req.model)
    .then(person => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
}

function _delete(req, res) {
  escrowPeopleService
    .delete(req.params.id)
    .then(() => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(new responses.ErrorResponse(err));
    });
}
