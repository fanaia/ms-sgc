const express = require("express");
const IndexController = require("../controllers/indexController");
const router = express.Router();

router.get("/", IndexController.test);
router.post("/login", IndexController.login);
router.post("/createSeed", IndexController.createSeed);

module.exports = router;
