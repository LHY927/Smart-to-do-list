/*
 * All routes for Widget Data are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /api/toDoItems-api
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const toDoItemsQueries = require("../db/queries/toDoItems");
const { getToDoItemById, getUserById } = require('../helpers/database');
const { categorizeToDoItem } = require('../helpers/categorizeToDoList');


// GET /api/todoitems
//get all toDoItems from user
router.get('/', async (req, res) => {
  console.log("req.user_id", req.session.userId);
  //const userId = req.session.userId;
  //rey inserted lines 21 to 28 to handle APIs
  const user = await getUserById(req.session.userId);
  const toDoItem = await getToDoItemById(req.session.userId);
  //returns an array of objects
  let templateVars = {
    user: user,
    toDoItem: toDoItem
  }
  //res.render('../somepage', templateVars);

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

// GET /api/todoitems/:id
// get a specific toDoItem from user
router.get('/:id', (req, res) => {
  console.log("req.user_id", req.session.userId);
  const userId = req.session.userId || 3;
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
        .json({ error: "this user do not have this todo item" });
    });
});

// POST /api/todoitems/new
//add a new toDoItem to user
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
//POST /api/todoitems/:id
//update a toDoItem from user
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

//GET /api/todoitems/:id/delete
//delete a toDoItem from user
router.get('/:id/delete', (req, res) => {
  const userId = req.session.userId;
  console.log("delete", userId);
  // const deleteToDoItem = req.body;
  const deleteToDoItem = {
    id: req.params.id,
    user_id: userId
  };
  console.log("deleteToDoItem", deleteToDoItem);

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
