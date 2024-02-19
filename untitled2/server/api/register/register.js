/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');
const bcrypt = require('bcrypt');
/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

router.post('/v1/register', (req, res) => {
  const registerData = req.body;

  connection.execute(
    'SELECT * FROM users WHERE username = ?',
    [registerData.username],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length !== 0) {
        res.status(401).json({ error: 'Użytkownik o podanym loginie już istnieje' });
        return;
      }
      connection.execute(
        'SELECT * FROM users WHERE email = ?',
        [registerData.email],
        (err, rows) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
          }

          if (rows.length !== 0) {
            res.status(401).json({ error: 'Użytkownik o podanym adresie email już istnieje' });
            return;
          }
          const salt = 10;
          const userData = {
            username: registerData.username,
            password: bcrypt.hashSync(registerData.password, salt),
            name: registerData.name,
            surname: registerData.surname,
            email: registerData.email,
            phone: registerData.phone,
            role_id: registerData.role_id
          };
          connection.execute(
            'INSERT INTO users(username, password, name, surname, email, phone, role_id) VALUES(?, ?, ?, ?, ?, ?, ?)',
            [userData.username, userData.password, userData.name, userData.surname, userData.email, userData.phone, userData.role_id],
            (insertErr, insertResult) => {
              if (insertErr) {
                res.status(500).send({ error: insertErr });
              } else {
                res.status(200).json({ user: userData});
              }
            }
          );
        }
      );
    }
  );
});
module.exports = router;