/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/users");

router.get('/:id', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.send({ error: "no user" });
  }

  userQueries.getUserById(userId)
    .then(users => {
      res.json({ users });
      console.log("getUsersById", users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/:id', (req, res) => {
  const userId = req.session.userId;
  const { name, email, password } = req.body;

  if (!userId) {
    return res.send({ error: "no user" });
  }

  userQueries.updateUser(userId, name, email, password)
    .then(users => {
      res.json({ users });
      console.log("updateUser", users);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});


module.exports = router;
