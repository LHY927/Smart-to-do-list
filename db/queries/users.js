const db = require("../connection");

const getUsers = () => {
  return db.query("SELECT * FROM users;").then((data) => {
    return data.rows;
  }).catch((err) => {
    console.log("err", err.message);
  }
  );
};

const getUserById = (id) => {
  return db
    .query("SELECT * FROM users WHERE id = $1;", [id])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

const updateUser = (id, name, email, password) => {
  return db
    .query("UPDATE users SET name = $2, email = $3, password = $4 WHERE id = $1;", [id, name, email, password])
    .then((data) => {
      return data.rows[0];
    })
    .catch((err) => {
      console.log("err", err.message);
    });
};

module.exports = { getUsers, getUserById, updateUser };
