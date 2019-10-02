const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/resultcontroller');
const { ensureAuthenticated } = require('../lib/auth');

router.all('*', ensureAuthenticated);
router.get('/', ResultController.index);
router.get('/genrate', ResultController.generate);

module.exports = router;
