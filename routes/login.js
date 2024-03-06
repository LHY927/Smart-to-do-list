const express = require("express");
const router = express.Router();

router.get("/:id", (req, res) => {
  req.session.userId = req.params.id;
  console.log("req.session.userId", req.session.userId);
  // send the user somewhere
  res.redirect("/");

});

module.exports = router;
