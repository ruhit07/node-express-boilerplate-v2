const express = require('express');
const router = express.Router();

const { jwtConfig } = require('../middlewares/jwt-config.middleware');
 
const {
  register 
} = require('../controllers/auth.controller');

router.use(jwtConfig);

router.post('/register', register);


module.exports = router;
