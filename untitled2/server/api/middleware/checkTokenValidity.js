const mysql = require('mysql2');
const dbConfig = require("../../config/db");

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
    return;
  }
  console.log('Połączono z bazą danych');
});

const TokenValidityMiddleware = (req, res, next) => {
  const user_id = req.params.id;
  const token = req.headers.authorization;

  connection.execute(
    'SELECT * FROM login WHERE user_id = ? AND token = ?',
    [user_id, token],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length === 0) {
        res.status(401).json({ error: 'Token jest nieważny lub nieprawidłowy' });
        return;
      }

      const validity = rows[0].validity;
      const currentTime = Math.floor(Date.now() / 1000);
      if (validity < currentTime) {
        connection.execute(
          'DELETE FROM login WHERE user_id = ? AND token = ?',
          [user_id, token],
          (deleteErr, deleteResult) => {
            if (deleteErr) console.error('Error deleting expired token:', deleteErr);
            else console.log('Expired token deleted:', token);
          }
        );
        res.status(401).json({ error: 'Token wygasł' });
        return;
      }

      // Token jest ważny, możemy kontynuować żądanie
      next();
    }
  );
};

module.exports = TokenValidityMiddleware;