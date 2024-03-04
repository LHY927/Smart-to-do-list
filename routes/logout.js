const express = require('express');
const router  = express.Router();

// Log a user out
router.post("/logout", (req, res) => {
  req.session.userId = null;
  res.send({});
});
