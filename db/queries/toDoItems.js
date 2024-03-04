const db = require("../connection");

const gettoDoItemsById = (id) => {
  return db
    .query("SELECT * FROM to_do_items WHERE id = $1;", [id])
    .then((data) => {
      return data.rows;
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const addToDoItem = (toDoItem) => {
  return db
    .query(
      "INSERT INTO to_do_items (user_id, title, category_id, description, due_date, completed) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [
        toDoItem.user_id,
        toDoItem.title,
        toDoItem.category_id,
        toDoItem.description,
        toDoItem.due_date,
        toDoItem.completed,
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
    .query("DELETE FROM to_do_items WHERE id = $1 AND user_id = $2;", [toDoItem.id, toDoItem.user_id])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const updateToDoItem = (toDoItem) => {
  return db
    .query(
      "UPDATE to_do_items SET url = $1, title = $2, category_id = $3, description = $4, due_date = $5, completed = $6 WHERE id = $7 AND user_id = $8 RETURNING *;",
      [
        toDoItem.url,
        toDoItem.title,
        toDoItem.category_id,
        toDoItem.description,
        toDoItem.due_date,
        toDoItem.completed,
        toDoItem.id,
        toDoItem.user_id
      ]
    ).then((data) => {
      return data.rows[0];
    }
    ).catch((err) => {
      console.log("err", err.message);
    });
};

module.exports = { gettoDoItemsById, addToDoItem, deleteToDoItem, updateToDoItem};
