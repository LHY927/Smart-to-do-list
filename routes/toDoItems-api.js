/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/toDoItems-api
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const toDoItemsQueries = require("../db/queries/toDoItems");

//get all toDoItems from user
router.get('/', (req, res) => {
  console.log("req.user_id", req.session.userId);
  const userId = req.session.userId;

  if (!userId) {
    return res.send({ error: "no users" });
  }

  toDoItemsQueries.getToDoItemsByUserId(userId)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("item", toDoItems);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.get('/:id', (req, res) => {
  console.log("req.user_id", req.session.userId);
  const userId = req.session.userId;
  const toDoItemId = req.params.id;
  console.log("toDoItemId", req.params.id);

  if (!userId) {
    return res.send({ error: "no users" });
  }

  if (!toDoItemId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.getToDoItemById(userId, toDoItemId)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("Items", toDoItems);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/new', (req, res) => {
  const userId = req.session.userId || 3;
  const addToDoItem = req.body;
  console.log("addToDoItem before", addToDoItem);

  if (!userId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.addToDoItem(addToDoItem, userId)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("added ToDoItem", toDoItems);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

router.post('/:id', (req, res) => {
  const userId = req.session.userId || 3;
  const addToDoItem = req.body;
  const toDoItemId = req.params.id;
  console.log("toDoItemId: ", toDoItemId);

  if (!userId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.updateToDoItem(addToDoItem, userId, toDoItemId)
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

router.get('/:id/delete', (req, res) => {
  const userId = req.session.userId;
  console.log("delete", userId);
  // const deleteToDoItem = req.body;
  const deleteToDoItem = {
    id: req.params.id,
    user_id: userId
  };

  if (!userId) {
    return res.send({ error: "no todo items" });
  }

  toDoItemsQueries.deleteToDoItem(deleteToDoItem)
    .then(toDoItems => {
      res.json({ toDoItems });
      console.log("deleteToDoItem success");
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

module.exports = router;
