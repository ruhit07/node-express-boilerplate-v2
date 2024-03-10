const { User } = require('../models');
const config = require('../config/config');
const { env_mode } = require('../enums/common.enum');
const asyncHandler = require('../middlewares/async.middleware');

const ErrorResponse = require('../utils/error-response.utils');
const { registerUserSchema, loginUserSchema, updatePasswordSchema } = require('../validation/auth.validation');


// @desc      Register user
// @route     POST /api/v2/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {

  const reqBody = await registerUserSchema(req.body);

  const { name, email, username, password, role, phone_no } = reqBody;

  // Check for user
  let user = await User.findOne({ where: { username }, attributes: { include: 'password' } });
  if (user) {
    return next(new ErrorResponse('Username exists', 401));
  }

  // Create user
  user = await User.create({ name, email, username, password, role, phone_no });

  // Create token and back response
  delete user.dataValues?.password
  sendTokenResponse(user, 201, 'Registration successfull', res);
});


// @desc      Login user
// @route     POST /api/v2/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {

  const reqBody = await loginUserSchema(req.body);

  const { username, password } = reqBody;

  // Check for user
  let user = await User.findOne({ where: { username } });
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  };

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  if (!user.is_active) {
    return next(new ErrorResponse('User blocked', 401));
  }

  // Create token and back response
  delete user.dataValues?.password
  sendTokenResponse(user, 200, 'Login successfull', res);
});


// @desc      Logout user 
// @route     DELETE /api/v2/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {

  Object.entries(req.cookies).forEach(([key, value]) => res.clearCookie(key));

  res.status(200).json({
    success: true,
    message: "Logout successfully",
    data: {}
  });
});


// @desc      Get current logged in user
// @route     POST /api/v2/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`No User with the id of ${req.user.id}`, 404));
  }


  res.status(200).json({
    success: true,
    message: "Current logged in user",
    data: user
  });
});


// @desc      Delete current user
// @route     DELETE /api/v2/auth/me
// @access    Private
exports.deleteMe = asyncHandler(async (req, res, next) => {

  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const user = await User.findByPk(req.user.id);
  if (!user) {
    return next(new ErrorResponse(`No User with the id of ${req.user.id}`, 404));
  }

  await user.destroy();

  res.status(200).json({
    success: true,
    message: "Delete current user",
    data: user
  });
});


// @desc      Update user details
// @route     PUT /api/v2/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const reqBody = await updateUserDetailsSchema(req.body);

  if (reqBody.username) {
    const existUser = await User.findOne({ where: { username: reqBody.username } })
    if (existUser && existUser.id !== req.user.id) {
      return next(new ErrorResponse(`Username ${reqBody.username} address already in use!`, 409));
    }
  }

  const [rowsUpdated, [user]] = await User.update(reqBody, {
    where: { id: req.user.id },
    returning: true
  });

  res.status(200).json({
    success: true,
    message: "User details updated successfully",
    data: user
  });
});



// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorResponse('Authentication Failed', 401));
  }

  const reqBody = await updatePasswordSchema(req.body);

  const { currentPassword, newPassword } = reqBody;

  const user = await User.findByPk(req.user.id, { attributes: { include: 'password' } });
  if (!user) {
    return next(new ErrorResponse(`No User with the id of ${req.user.id}`, 404));
  };

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return next(new ErrorResponse('Password is incorrect', 401));
  };

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
    data: {}
  });

});


// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, message, res) => {

  // Create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + config.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 // 1 day = 24 * 60 * 60 * 1000 ms
    ),
    secure: config.SSL && config.NODE_ENV === env_mode.PRODUCTION
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .cookie('accessToken', token, { ...options, httpOnly: true })
    .json({
      success: true,
      message,
      data: {
        user,
        token
      }
    });
};