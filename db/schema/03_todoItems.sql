DROP TABLE IF EXISTS to_do_items CASCADE;

CREATE TABLE to_do_items (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  description TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT FALSE
);
