const router = require("express").Router();
const organizationController = require("../controllers/organizations.controller");
const validateBody = require("../filters/validate.body");
const Organization = require("../models/organization");

module.exports = router;

// api routes ===========================================================
router.get("/", organizationController.readAll);
router.get("/:id([0-9a-fA-F]{24})", organizationController.readById);
router.post("/", validateBody(Organization), organizationController.create);
router.put(
  "/:id([0-9a-fA-F]{24})",
  validateBody(Organization),
  organizationController.update
);
router.delete("/:id([0-9a-fA-F]{24})", organizationController.delete);
