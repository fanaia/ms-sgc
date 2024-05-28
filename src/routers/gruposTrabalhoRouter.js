const express = require("express");
const gruposTrabalhoController = require("../controllers/gruposTrabalhoController");

const router = express.Router();
router.post("/", gruposTrabalhoController.create);
router.get("/", gruposTrabalhoController.readAll);
router.get("/:id", gruposTrabalhoController.readOne);
router.patch("/:id", gruposTrabalhoController.update);
router.delete("/:id", gruposTrabalhoController.delete);

module.exports = router;
