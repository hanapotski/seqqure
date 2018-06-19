const responses = require("../models/responses");
const tenantsService = require("../services/tenants.service");
const apiPrefix = "/api/tenants";

const readAll = (req, res) => {
  tenantsService
    .readAll()
    .then(tenants => {
      const responseModel = new responses.ItemsResponse();
      responseModel.items = tenants;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const readById = (req, res) => {
  tenantsService
    .readById(req.params.id)
    .then(tenant => {
      const responseModel = new responses.ItemResponse();
      responseModel.item = tenant;
      res.json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const readInvitesById = (req, res) => {
  tenantsService
    .readInvitesById(req.params.id)
    .then(invites => {
      res.json(new responses.ItemsResponse(invites));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const readAdminsById = (req, res) => {
  tenantsService
    .readAdminsById(req.params.id)
    .then(admins => {
      res.json(new responses.ItemsResponse(admins));
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const create = (req, res) => {
  tenantsService
    .create(req.body)
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
};

const update = (req, res) => {
  tenantsService
    .update(req.params.id, req.model)
    .then(tenant => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(new responses.ErrorResponse(err));
    });
};

const _delete = (req, res) => {
  tenantsService
    .delete(req.params.id)
    .then(() => {
      const responseModel = new responses.SuccessResponse();
      res.status(200).json(responseModel);
    })
    .catch(err => {
      console.log(err);
      return res.status(500).send(new responses.ErrorResponse(err));
    });
};

module.exports = {
  readAll,
  readById,
  readInvitesById,
  readAdminsById,
  create,
  update,
  delete: _delete
};
