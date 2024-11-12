const express = require("express");
const router = express.Router();

// Test api
router.get("/", (req, res) => {
  res.send("<h3>Welcome to Node Express Boilerplate APIs (v2) services..<h3>");
});

module.exports = router;
