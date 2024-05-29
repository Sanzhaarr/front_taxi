const express = require('express');
const Auth = require("../controllers/reg-controller.js");

const router = express.Router();

router.get('/reg', Auth.getReg);

router.get('/reg/driver', Auth.getRegDriver);

module.exports = router;