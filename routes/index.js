const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/indexcontroller');
const UserController = require('../controllers/usercontroller');

router.get('/', IndexController.index);
router.get('/fixtures', IndexController.fixtures);
router.get('/login', UserController.login);

module.exports = router;
