const express = require("express");
const gruposTrabalhoController = require("../controllers/gruposTrabalhoController");

const router = express.Router();
router.post("/", gruposTrabalhoController.save);
router.get("/", gruposTrabalhoController.readAll);
router.get("/:id", gruposTrabalhoController.readOne);
router.patch("/:id", gruposTrabalhoController.save);
router.delete("/:id", gruposTrabalhoController.delete);
router.put("/:id/approve/:approve", gruposTrabalhoController.approve);

module.exports = router;
