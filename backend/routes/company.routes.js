const router = require("express").Router();
const companyController = require("../controllers/company.controller");
const validateBody = require("../filters/validate.body");
const Company = require("../models/company");

module.exports = router;

// api routes ===========================================================
router.get("/", companyController.readAll);
router.put("/", validateBody(Company), companyController.update);
