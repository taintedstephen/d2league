const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/indexcontroller');
const UserController = require('../controllers/usercontroller');
const { ensureAuthenticated } = require('../lib/auth');

router.get('/', IndexController.index);
router.get('/login', UserController.login);
router.get('/admin', ensureAuthenticated, IndexController.admin);

module.exports = router;
