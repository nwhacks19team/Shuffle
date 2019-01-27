const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'shuffle',
  password: 'password',
  port: 5432,
});

const getUsers = () => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      console.log(error);
    }
    console.log((results.rows));
  });
};

const getTokens = (users) => {
  const text = "SELECT token FROM users WHERE username IN ($1)";
  pool.query(text, users, (error, results) => {
    if (error) {
      console.log(error);
    }
    console.log(results.rows);
    return results.rows;
  });
}

module.exports = {
  getUsers,
  getTokens
}