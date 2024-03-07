const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");


router.route("/")
  .get(getUsers)
  .post(addUser);

router.route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
