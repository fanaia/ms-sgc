const express = require('express');
const atividadesController = require('../controllers/atividadesController');

const router = express.Router();
router.post('/', atividadesController.save);
router.get('/', atividadesController.readAll);
router.get('/:id', atividadesController.readOne);
router.patch('/:id', atividadesController.save);
router.delete('/:id', atividadesController.delete);

module.exports = router;