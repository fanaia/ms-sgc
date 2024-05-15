const express = require('express');
const atividadesController = require('../controllers/atividadesController');

const router = express.Router();
router.post('/', atividadesController.create);
router.get('/', atividadesController.readAll);
router.get('/:id', atividadesController.readOne);
router.patch('/:id', atividadesController.update);
router.delete('/:id', atividadesController.delete);

module.exports = router;