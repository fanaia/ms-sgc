const express = require("express");
const projetosController = require("../controllers/projetosController");

const router = express.Router();
router.post("/", projetosController.create);
router.get("/", projetosController.readAll);
router.get("/:id", projetosController.readOne);
router.patch("/:id", projetosController.update);
router.delete("/:id", projetosController.delete);

module.exports = router;
