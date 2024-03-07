const express = require("express");
const router = express.Router();

// Test api
router.get("/", (req, res) => {
  res.send("<h3>Welcome to Inventory Management APIs (v1) services..<h3>");
});

module.exports = router;
