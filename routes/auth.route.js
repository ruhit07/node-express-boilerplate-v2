const express = require('express');
const router = express.Router();

const { protect } = require('../middlewares/auth.middleware');
const { jwtConfig } = require('../middlewares/jwt-config.middleware');
 
const {
  register, 
  login,
  logout, 
  getMe,
  deleteMe,
  updateDetails,
  updatePassword
} = require('../controllers/auth.controller');

router.use(jwtConfig);

router.post('/register', register);
router.post('/login', login);
router.delete('/logout', protect, logout);
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
