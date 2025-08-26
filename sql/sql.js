const mysql = require("mysql2/promise");

const pool = mysql.createPool({
 host: 'localhost', user: 'root', database: 'book_store', password: 'jonas'
});

async function main(query, params = []) {
  const [results] = await pool.execute(query, params);
  return results;
}

module.exports = { main };
