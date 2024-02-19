/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

router
  .get('/v1/roles/:id', (req, res) => {
    const id = req.params.id;

    res.set({ 'content-type': 'application/json; charset=utf-8' });

    connection.query(
      'SELECT role_name FROM roles WHERE id = ?',
      [id],
      (err, rows) => {
        if (err) res.status(500).send({ error: err });
        else if (rows.length === 0) res.status(404).send(`Role with id ${id} not found.`);
        else {
          res.status(200).json(rows[0]);
        }
      }
    );
  });
module.exports = router;