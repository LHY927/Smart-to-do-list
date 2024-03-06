const db = require("../connection");

const getToDoItemById = (userId, id) => {
  return db
    .query("SELECT * FROM to_do_items WHERE user_id = $1 AND id = $2;", [userId, id])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const getToDoItemsByUserId = (id) => {
  return db
    .query("SELECT * FROM to_do_items WHERE user_id = $1;", [id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const addToDoItem = (toDoItem, userId) => {
  return db
    .query(
      "INSERT INTO to_do_items (user_id, title, category_id, description, due_date, completed, url, duration) VALUES ($1, $2, $3, $4, $5, $6, $7 ,$8) RETURNING *;",
      [
        userId,
        toDoItem.title,
        toDoItem.category_id,
        toDoItem.description,
        toDoItem.due_date,
        toDoItem.completed,
        toDoItem.url,
        toDoItem.duration,
      ]
    )
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const deleteToDoItem = (toDoItem) => {
  return db
    .query("DELETE FROM to_do_items WHERE id = $1 AND user_id = $2;", [
      toDoItem.id,
      toDoItem.user_id,
    ])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const updateToDoItem = (toDoItem, userId, toDoItemId) => {
  return db
    .query(
      "UPDATE to_do_items SET url = $1, title = $2, category_id = $3, description = $4, due_date = $5, completed = $6, duration = $7 WHERE id = $8 AND user_id = $9 RETURNING *;",
      [
        toDoItem.url,
        toDoItem.title,
        toDoItem.category_id,
        toDoItem.description,
        toDoItem.due_date,
        toDoItem.completed,
        toDoItem.duration,
        toDoItemId,
        userId,
      ]
    )
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

module.exports = {
  getToDoItemById,
  getToDoItemsByUserId,
  addToDoItem,
  deleteToDoItem,
  updateToDoItem,
};
