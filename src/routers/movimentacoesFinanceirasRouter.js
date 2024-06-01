const express = require("express");
const movimentacoesFinanceirasController = require("../controllers/movimentacoesFinanceirasController");

const router = express.Router();
router.post("/", movimentacoesFinanceirasController.create);
router.get("/", movimentacoesFinanceirasController.readAll);
router.get("/:id", movimentacoesFinanceirasController.readOne);
router.patch("/:id", movimentacoesFinanceirasController.update);
router.delete("/:id", movimentacoesFinanceirasController.delete);

module.exports = router;
