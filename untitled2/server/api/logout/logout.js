/* Imports */
/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');
/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

router.post('/v1/logout', (req, res) => {
  console.log("1");
  const { userToken } = req.body; // Pobierz identyfikator użytkownika z ciała żądania
  // console.log("token: "+ userToken);

  if (!userToken) {
    res.status(400).json({ error: 'Brak identyfikatora użytkownika w ciele żądania' });
    return;
  }

  connection.execute(
    'DELETE FROM login WHERE token = ?',
    [userToken],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (result.length === 0) {
        res.status(401).json({ error: 'Nie znaleziono pasującego tokenu' });
        return;
      }

      res.status(200).json({ message: 'Wylogowano pomyślnie' });
    }
  );
});

module.exports = router;