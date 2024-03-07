const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('../helpers/database');

router.get("/:id", (req, res) => {
  req.session.userId = req.params.id;
  console.log("req.session.userId", req.session.userId);
  // send the user somewhere
  res.redirect("/");
});

// logging in
router.post('/', async (req, res) => {
  // query the database for the email input by user
  getUserByEmail(req.body.email)
    .then(user => {
      if (!user) {
        res.json({error: 'User does not exist'});

      } else {
        // check password
        if (!bcrypt.compareSync(req.body.password, user.password)) {
          res.json({error: 'Password does not match'});

        } else {
          req.session = { user_id: user.id };
          res.redirect('/tasks');
        }
      }
    })
    .catch(err => {
      console.error('login error', err);
    });
});
return router;
module.exports = router;
