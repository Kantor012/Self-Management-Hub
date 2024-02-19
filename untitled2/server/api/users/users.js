/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');
const multer = require("multer");
const fs = require("fs").promises;
const path = require('path');

/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();
const upload = multer();

router.use(express.json({limit: '10mb'}));

/* Main */
router
    .get('/v1/users', (req, res) => {
        connection.query('SELECT * FROM users', (err, rows) => {
            if (err) res.status(500).send({ error: err });
            else res.status(200).json(rows);
        });
    })
    .post('/v1/users', (req, res) => {
        const { username, password, name, surname, email, phone } = req.body;

        res.set({ 'content-type': 'application/json; charset=utf-8' });

        connection.execute(
            'INSERT INTO users(username, password, name, surname, email, phone) VALUES(?, ?, ?, ?, ?, ?)',
            [username, password, name, surname, email, phone],
            (err, rows) => {
                if (err) res.status(500).send({ error: err });
                else res.status(200).send(`User ${username} successfully added.`);
            }
        );
    })
router
    .get('/v1/users/:id', (req, res) => {
        const id = parseInt(req.params.id);

        res.set({ 'content-type': 'application/json; charset=utf-8' });

        connection.query(
            'SELECT * FROM users WHERE id = ?',
            [id],
            (err, rows) => {
                if (err) res.status(500).send({ error: err });
                else if (rows.length === 0) res.status(404).send(`User with id ${id} not found.`);
                else res.status(200).json(rows[0]);
            }
        );
    })
    .put('/v1/users/:id', (req, res) => {
        const { id } = req.params;
        const { name, surname, role_id, password, email, phone } = req.body;

        res.set({ 'content-type': 'application/json; charset=utf-8' });

        connection.execute(
            'UPDATE users SET name = ?, surname = ?, role_id = ?, password = ?, email = ?, phone = ? WHERE id = ?',
            [name, surname, role_id, password, email, phone, id],
            (err, rows) => {
                if (err) res.status(500).send({ error: err });
                else if (rows.length === 0) res.status(404).send(`User with id ${id} not found.`);
                else res.status(200).send(`User id: ${id} successfully edited.`);
            }
        );
    });
router
    .delete('/v1/usersdel/:username/:id', (req, res) => {
        const { username, id } = req.params;

        res.set({ 'content-type': 'application/json; charset=utf-8' });

        connection.execute(
            'DELETE FROM users WHERE username = ? AND id = ?',
            [username, id],
            (err, rows) => {
                if (err) res.status(500).send({ error: err });
                else if (rows.length === 0) res.status(404).send(`User with username ${username} and id ${id} not found.`);
                else res.status(200).send(`User with username ${username} and id ${id} successfully deleted.`);
            }
        );
    });
router
  .post('/v1/user/photo/:id', (req, res) => {
    const { id } = req.params;
    const imageUrl = req.body.link;
    try {
      connection.execute(
        'UPDATE users set photo_link = ? WHERE id = ?',
        [imageUrl, id],
        (err, rows) => {
          if (err) res.status(500).send({ error: err });
          else if (rows.length === 0) res.status(404).send(`User with id ${id} not found.`);
          else res.status(200).send(`User id: ${id} successfully edited.`);
        }
      )
    } catch(e) {
      console.log(e);
      res.status(500).send({error: e});
    }
  })
  .get('/v1/user/photo/:id', (req, res) => {
    const id = parseInt(req.params.id);
    res.set({ 'content-type': 'application/json; charset=utf-8' });

    connection.query(
      'SELECT photo_link FROM users WHERE id = ?',
      [id],
      (err, rows) => {
        if (err) res.status(500).send({ error: err });
        else if (rows.length === 0) res.status(404).send(`User with id ${id} not found.`);
        else res.status(200).json(rows[0].photo_link);
      }
    );
  })
module.exports = router;
