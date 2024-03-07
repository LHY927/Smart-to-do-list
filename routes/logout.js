const express = require('express');
const router  = express.Router();

// Log a user out
router.get("/", (req, res) => {
  console.log("logout route", req.session.userId);
  req.session.userId = null;
  res.redirect("/");
});
return router;
module.exports = router;
