/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const toDoItemsQueries = require("../db/queries/toDoItems");

router.get('/:id', (req, res) => {
  const userId = req.session.userId;

  if (!userId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.getToDoItemsByUserId(userId)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("getToDoItemsByUserId", toDoItems);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/:id', (req, res) => {
  const userId = req.session.userId;
  const addToDoItem = req.body;

  if (!userId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.updateToDoItem(addToDoItem)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("addToDoItem", toDoItems);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/:id/delete', (req, res) => {
  const userId = req.session.userId;
  const deleteToDoItem = req.body;

  if (!userId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.deleteToDoItem(deleteToDoItem)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("deleteToDoItem", toDoItems);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
