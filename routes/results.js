const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/resultcontroller');
const { ensureAuthenticated } = require('../lib/auth');

router.all('*', ensureAuthenticated);
router.get('/', ResultController.index);
router.get('/generate', ResultController.generate);
router.post('/save-schedule', ResultController.saveSchedule);
router.post('/clear', ResultController.purge);
router.get('/add/:id', ResultController.add);
router.get('/edit/:id', ResultController.edit);
router.post('/save-result', ResultController.save);

module.exports = router;
