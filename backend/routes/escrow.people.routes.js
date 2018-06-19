const router = require("express").Router();
const escrowPeopleController = require("../controllers/escrow.people.controller");
const validateBody = require("../filters/validate.body");
const Person = require("../models/escrowPerson");

module.exports = router;

// api routes ===========================================================
router.get("/:escrowId([0-9a-fA-F]{24})", escrowPeopleController.readAll);
router.get("/search/:name", escrowPeopleController.search);
router.post("/", validateBody(Person), escrowPeopleController.create);
router.put(
  "/:id([0-9a-fA-F]{24})",
  validateBody(Person),
  escrowPeopleController.update
);
router.delete("/:id([0-9a-fA-F]{24})", escrowPeopleController.delete);
