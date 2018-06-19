const router = require("express").Router();
const tenantsController = require("../controllers/tenants.controller");
const validateBody = require("../filters/validate.body");
const Tenant = require("../models/tenant");

module.exports = router;

// api routes ===========================================================
router.get("/", tenantsController.readAll);
router.get("/:id([0-9a-fA-F]{24})/admins", tenantsController.readAdminsById);
router.get("/:id([0-9a-fA-F]{24})/invites", tenantsController.readInvitesById);
router.get("/:id([0-9a-fA-F]{24})", tenantsController.readById);
router.post("/", validateBody(Tenant), tenantsController.create);
router.put(
  "/:id([0-9a-fA-F]{24})",
  validateBody(Tenant, { allowUnknown: true }),
  tenantsController.update
);
router.delete("/:id([0-9a-fA-F]{24})", tenantsController.delete);
