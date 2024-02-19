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

function monitorExpiredTokens() {
  const expiredTokensQuery = 'SELECT token FROM login WHERE validity < UNIX_TIMESTAMP()';
  connection.query(expiredTokensQuery, (err, rows) => {
    if (err) {
      console.error('Błąd przy sprawdzaniu wygaśnięcia tokenów:', err);
      return;
    }

    if (rows.length > 0) {
      connection.execute("DELETE FROM login WHERE validity < NOW()",
        (err, deleteResult) => {
          if (err) {
            console.error("Błąd podczas usuwania wygasłych tokenów:", err);
          } else {
            connection.execute(
              "SELECT ROW_COUNT() AS affectedRows",
              (selectErr, selectResult) => {
                if (selectErr) {
                  console.error("Błąd podczas pobierania liczby usuniętych wierszy:", selectErr);
                } else {
                  const affectedRows = selectResult[0].affectedRows || 0;
                  //console.log("Wygasłe tokeny zostały usunięte:", affectedRows);
                }
              }
            );
          }
        }
      );
    }
  });
}


// -----------------------------------------

const start = () => {
  // Uruchomienie monitorowania tokenów
  setInterval(() => {
    monitorExpiredTokens();
  }, 30 * 1000); // Sprawdzaj co 30s

};

module.exports = { start };
