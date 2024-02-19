/* Imports */
/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const validate = require('../middleware/checkTokenValidity');
/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

router.post('/v1/login', (req, res) => {
  const { username, password } = req.body;

  connection.execute(
    'SELECT * FROM users WHERE username = ?',
    [username],
    (err, rows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      if (rows.length === 0) {
        res.status(400).json({ error: 'Użytkownik o podanym loginie nie istnieje' });
        return;
      }

      const user = rows[0];
      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (isPasswordValid) {
        // Dane logowania są prawidłowe

        const userData = {
          id: user.id,
          username: user.username,
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          role_id: user.role_id
        };

        const token = jwt.sign({ id: userData.id }, 'secretKey', { expiresIn: '2h' }); // Generowanie tokenu z ważnością 15 minut
        res.set('Authorization', token);
        const validity = Math.floor((Date.now() + 15 * 60 * 1000) / 1000); // Ważność tokena: 15 minut
        connection.execute(
          'INSERT INTO login(user_id, token, validity) VALUES(?, ?, ?)',
          [userData.id, token, validity],
          (insertErr, insertResult) => {
            if (insertErr) {
              res.status(500).send({ error: insertErr });
            } else {
              res.status(200).json({ user: userData, token });
            }
          }
        );
      } else {
        res.status(400).json({ error: 'Dane logowania są nieprawidłowe' });
      }
    }
  );
});
router.get('/v1/login/:id', validate, (req, res) => {
  // console.log('typeof: ', req.params.id);
  const id = req.params.id;
  // console.log('login id: ', id);

  res.set({ 'content-type': 'application/json; charset=utf-8' });
  connection.execute(
    'SELECT token, validity FROM login WHERE user_id = ?',
    [id],
    (err, rows) => {
      if (err) {
        res.status(500).send({ error: err });
        return;
      }

      if (rows.length === 0) {
        res.status(404).send({ message: 'Uzytkownik niezalogowany' });
        return;
      }

      const { token, validity} = rows[0];
      const currentTime = Math.floor(Date.now() / 1000);
      // console.log(validity);
      // console.log(currentTime);
      if (validity > currentTime) {
        res.status(200).send({ isLoggedIn: true, token });
      } else {
        res.status(200).send({ isLoggedIn: false });
      }
    }
  );
});
router.put('/v1/login/:id', (req, res) => {
  const { id } = req.params.id;

  res.set({ 'content-type': 'application/json; charset=utf-8' });

  connection.execute(
    'SELECT * FROM login WHERE user_id = ?',
    [id],
    (err, result) => {
      if (err) {
        res.status(500).send({ error: err });
      } else {
        if (result.length === 0) {
          res.status(404).send({ message: 'User not found or not logged in.' });
        } else {
          const newValidity = new Date(Date.now() + 15 * 60 * 1000);

          connection.execute(
            'UPDATE login SET validity = ? WHERE user_id = ?',
            [newValidity, id],
            (updateErr, updateResult) => {
              if (updateErr) {
                res.status(500).send({ error: updateErr });
              } else {
                res.status(200).send({ message: 'Token validity updated successfully.' });
              }
            }
          );
        }
      }
    }
  );
});
module.exports = router;