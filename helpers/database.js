// helper functions to access the database
const { db } = require('../db/connection');
const bcrypt = require('bcrypt');

// addTask inserts a newly added task to the database with its category
const addToDoItems = async function (obj) {
  const { toDoItem, userId, categoryId } = obj;

  const queryString = `
  INSERT INTO tasks (title, user_id, category_id)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  const queryString = `
  const values = [task, user_id, category_id];

  try {
    const res = await db.query(queryString, values);
    return res.rows[0];

  } catch (err) {
    console.error('query error', err.stack);

  }
}

const checkAllEmails = async function (user_id) {
  const queryString = `
  SELECT email
  FROM users
  WHERE id != ${user_id};
  `;
  try {
    const res = await db.query(queryString);
    const emails = []
    for (let each of res.rows){
      emails.push(each.email)
    }
    return emails;

  } catch (err) {
    console.error('query error', err.stack);

  }
}

const getUserByEmail = async (email) => {
  const queryString = `
    SELECT *
    FROM users
    WHERE email = $1
  `;
  const queryParams = [email];

  try {
    const res = await db.query(queryString, queryParams);
    return res.rows[0] || null;

  } catch (err) {
    console.error('query error', err.stack);
  }

}

const getToDoListById = async (id) => {
  const queryString = `
    SELECT user_id, input, category_id
    FROM todoitems
    WHERE user_id = $1
  `;

  const queryParams = [id];

  try {
    const res = await db.query(queryString, queryParams);
    return res.rows;

  } catch (err) {
    console.error('query error', err.stack);

  }
}

module.exports = {
  addToDoItems,
  checkAllEmails,
  getUserByEmail,
  getToDoListById
};
