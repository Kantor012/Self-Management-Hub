/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

/* Main */
router
  .post('/v1/availability', (req, res) => {
    try {
      const { user_id, availability_id, from_date, to_date } = req.body;

      // Wstawienie danych do tabeli "availability"
      connection.query(
        `INSERT INTO availability (user_id, availability_id, from_date, to_date) VALUES (?, ?, ?, ?)`,
        [user_id, availability_id, from_date, to_date],
        (err, result) => {
        if (err) {
          console.error('Błąd podczas dodawania danych:', err);
          res.status(500).json({ error: 'Wystąpił błąd' });
        } else {
          res.status(201).json({ message: 'Dane zostały dodane', data: result });
        }
      });
    } catch (error) {
      console.error('Błąd podczas obsługi żądania:', error);
      res.status(500).json({ error: 'Wystąpił błąd' });
    }
  })
  .get('/v1/availability', (req, res) => {
    try {
      // Pobierz dane z tabeli "availability"
      connection.query('SELECT availability_id, user_id, from_date, to_date FROM availability', (err, results) => {
        if (err) {
          console.error('Błąd podczas pobierania danych:', err);
          res.status(500).json({ error: 'Wystąpił błąd' });
        } else {
          res.status(200).json({ data: results });
        }
      });
    } catch (error) {
      console.error('Błąd podczas obsługi żądania:', error);
      res.status(500).json({ error: 'Wystąpił błąd' });
    }
  });
module.exports = router;
