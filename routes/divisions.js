const express = require('express');
const router = express.Router();
const DivisionController = require('../controllers/divisioncontroller');

router.get('/', DivisionController.index);
router.get('/new', DivisionController.new);
router.post('/create', DivisionController.create);
router.get('/edit/:id', DivisionController.edit);
router.post('/update', DivisionController.update);
router.post('/destroy', DivisionController.destroy);
router.post('/order', DivisionController.updateDivisionOrder);
router.post('/players', DivisionController.updatePlayerDivision);

module.exports = router;
