const express = require("express");
const projetosController = require("../controllers/projetosController");

const router = express.Router();
router.post("/", projetosController.save);
router.get("/", projetosController.readAll);
router.get("/:id", projetosController.readOne);
router.patch("/:id", projetosController.save);
router.delete("/:id", projetosController.delete);
router.put("/:id/approve/:approve", projetosController.approve);

module.exports = router;
