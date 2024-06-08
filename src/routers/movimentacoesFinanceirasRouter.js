const express = require("express");
const movimentacoesFinanceirasController = require("../controllers/movimentacoesFinanceirasController");

const router = express.Router();
router.post("/", movimentacoesFinanceirasController.save);
router.get("/", movimentacoesFinanceirasController.readAll);
router.get("/getSaldoTotal", movimentacoesFinanceirasController.getSaldoTotal);
router.get("/:id", movimentacoesFinanceirasController.readOne);
router.patch("/:id", movimentacoesFinanceirasController.save);
router.delete("/:id", movimentacoesFinanceirasController.delete);
router.put("/:id/approve/:approve", movimentacoesFinanceirasController.approve);

module.exports = router;
