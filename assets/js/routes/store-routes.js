const express = require('express');
const Store = require("../controllers/store-controller.js");

const router = express.Router();

router.get('/store', Store.getStore);
router.get('/game/:id_of_game', Store.getGame);

module.exports = router;