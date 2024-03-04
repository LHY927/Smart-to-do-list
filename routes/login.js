const express = require('express');
const router  = express.Router();

router.get('/login/:id', (req, res) => {
  // using encrypted cookies
  req.session.user_id = req.params.id;

  // or using plain-text cookies
  res.cookie('user_id', req.params.id);
  console.log("user_id", req.params.id);
  // send the user somewhere
  res.redirect('/');
});


module.exports = router;
