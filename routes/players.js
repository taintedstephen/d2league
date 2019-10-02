const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playercontroller');
const { ensureAuthenticated } = require('../lib/auth');

router.all('*', ensureAuthenticated);
router.get('/', PlayerController.index);
router.get('/new', PlayerController.new);
router.post('/create', PlayerController.create);
router.get('/edit/:id', PlayerController.edit);
router.post('/update', PlayerController.update);
router.post('/remove', PlayerController.destroy);

module.exports = router;
