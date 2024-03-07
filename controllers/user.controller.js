const asyncHandler = require("../middlewares/async.middleware");
const ErrorResponse = require("../utils/error-response.utils");

const { User } = require("../models");
const { createUserSchema, updateUserSchema } = require("../validation/user.validation");

// @desc      Get List of all users
// @route     GET /api/v2/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {

  const users = await User.findAll();

  return res.status(200).json({
    success: true,
    message: `List of all users`,
    count: users.length,
    data: users,
  });
});

// @desc      Get single user
// @route     GET /api/v2/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No User with the id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `User of id ${req.params.id}`,
    data: user,
  });
});

// @desc      Create User
// @route     POST /api/v2/users
// @access    Private/Admin
exports.addUser = asyncHandler(async (req, res, next) => {

  const reqBody = await createUserSchema(req.body);

  const userExists = await User.findOne({ where: { username: reqBody.username } });
  if (userExists) {
    return next(new ErrorResponse(`Username already exists`, 400));
  }

  const user = await User.create(reqBody);

  res.status(201).json({
    success: true,
    message: `User created successfully`,
    data: user,
  });
});

// @desc      Update User
// @route     PUT /api/v2/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {

  const user = await User.findByPk(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  const reqBody = await updateUserSchema(req.body);

  if (reqBody.username) {
    const existUser = await User.findOne({ where: { username: reqBody.username } })
    if (existUser && existUser.id !== req.params.id) {
      return next(new ErrorResponse(`Username already exists`, 400));
    }
  }
  
  await user.update(reqBody);

  res.status(200).json({
    success: true,
    message: `User with the id ${req.params.id} updated successfully`,
    data: user,
  });
});

// @desc      Delete User
// @route     DELETE /api/v2/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {

  const user = await User.findByPk(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`No user with the id of ${req.params.id}`, 404));
  }

  await user.destroy(); 

  res.status(200).json({
    success: true,
    message: `User with the id ${req.params.id} deleted successfully`,
    data: {},
  });
});
