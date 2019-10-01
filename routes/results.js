const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/resultcontroller');
const { ensureAuthenticated } = require('../lib/auth');

router.all('*', ensureAuthenticated);
router.get('/', ResultController.index);
router.get('/new', ResultController.new);
router.post('/create', ResultController.create);
router.get('/edit/:id', ResultController.edit);
router.post('/update', ResultController.update);

module.exports = router;
