const express = require('express');
const router = express.Router();
const AjaxController = require('../controllers/ajaxcontroller');

router.get('/stats/:psn', AjaxController.getPvpStats);

module.exports = router;
