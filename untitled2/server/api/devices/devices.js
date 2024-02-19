/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

router.post('/v1/devices/add', async (req, res) => {
  try {
    const requestData = {
      brand: req.body.deviceBrand,
      model: req.body.deviceModel,
      type: req.body.deviceType,
      body_quantity: req.body.quantity
    };

    // Przygotowanie zapytania SQL do aktualizacji rekordu
    const updateDeviceQuery = `
      UPDATE devices
      SET quantity = quantity + ?
      WHERE brand = ? AND model = ?;
    `;

    const values = [requestData.body_quantity, requestData.brand, requestData.model];
    const values1 = [requestData.brand, requestData.model, requestData.type, requestData.body_quantity];
    connection.query(updateDeviceQuery, values, (error, results) => {
      if (error) {
        console.error('Błąd podczas aktualizacji urządzenia:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji urządzenia' });
      } else {
        if (results.affectedRows === 0) {
          const insertDeviceQuery = `
            INSERT INTO devices (brand, model, type, quantity)
            VALUES (?, ?, ?, ?);
          `;

          connection.query(insertDeviceQuery, values1, (insertError, insertResults) => {
            if (insertError) {
              console.error('Błąd podczas dodawania urządzenia:', insertError);
              res.status(500).json({ error: 'Wystąpił błąd podczas dodawania urządzenia' });
            } else {
              res.status(200).json({ message: 'Urządzenie zostało dodane lub zaktualizowane' });
            }
          });
        } else {
          res.status(200).json({ message: 'Urządzenie zostało zaktualizowane' });
        }
      }
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia wniosku do HR:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia wniosku do HR' });
  }
});
router.get('/v1/devices', async (req, res) => {
  connection.query('SELECT * FROM devices', (err, rows) => {
    if (err) res.status(500).send({ error: err });
    else res.status(200).json(rows);
  });
});
router.post('/v1/orders/add', async (req, res) => {
  try {
    const requestData = {
      brand: req.body.deviceBrand,
      model: req.body.deviceModel,
      type: req.body.deviceType,
      user_id: req.body.uid,
    };

    // Przygotowanie zapytania SQL do aktualizacji rekordu
    const createOrderQuery = `
      INSERT INTO orders (user_id, brand, model, type, completed)
      VALUES (?, ?, ?, ?, 0);
    `;

    const values = [requestData.user_id, requestData.brand, requestData.model, requestData.type];
    connection.query(createOrderQuery, values, (error, results) => {
      if (error) {
        console.error('Błąd podczas tworzenia zamówienia:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia zamówienia' });
      } else {
        res.status(200).json({message: 'Zamówienie zostało utworzone'});
      }
    });
  } catch (error) {
    console.error('Błąd podczas tworzenia zamówienia:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia zamówienia' });
  }
});
router.get('/v1/orders', async (req, res) => {
  connection.query('SELECT * FROM orders', (err, rows) => {
    if (err) res.status(500).send({ error: err });
    else res.status(200).json(rows);
  });
});
router.put('/v1/orders/upd/:id', async (req, res) => {
  const order_id = parseInt(req.params.id);

  // Sprawdzamy, czy istnieje zamówienie o podanym id
  const orderQuery = `
    SELECT * FROM orders
    WHERE id = ?;
  `;

  connection.query(orderQuery, [order_id], (orderError, orderResults) => {
    if (orderError) {
      console.error(orderError);
      res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania zamówienia.' });
    } else {
      if (orderResults.length === 0) {
        res.status(404).json({ error: 'Nie znaleziono zamówienia o podanym id.' });
      } else {
        const order = orderResults[0];
        const deviceQuery = `
          SELECT * FROM devices
          WHERE brand = ? AND model = ?;
        `;

        connection.query(deviceQuery, [order.brand, order.model], (deviceError, deviceResults) => {
          if (deviceError) {
            console.error(deviceError);
            res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania zamówienia.' });
          } else {
            if (deviceResults.length === 0) {
              res.status(404).json({ error: 'Przedmiot o podanej marce i modelu nie istnieje.' });
            } else {
              const device = deviceResults[0];
              if (device.quantity > 0) {
                const updateDeviceQuery = `
                  UPDATE devices
                  SET quantity = quantity - 1
                  WHERE brand = ? AND model = ?;
                `;

                connection.query(updateDeviceQuery, [device.brand, device.model], (updateError, updateResults) => {
                  if (updateError) {
                    console.error(updateError);
                    res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania zamówienia.' });
                  } else {
                    const updateOrderQuery = `
                      UPDATE orders
                      SET completed = 1
                      WHERE id = ?;
                    `;

                    connection.query(updateOrderQuery, [order_id], (updateOrderError, updateOrderResults) => {
                      if (updateOrderError) {
                        console.error(updateOrderError);
                        res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania zamówienia.' });
                      } else {
                        res.status(200).json({ message: `Zamówienie o id: ${order_id} zaktualizowane i ukończone.` });
                      }
                    });
                  }
                });
              } else {
                res.status(200).json({ message: 'Brak dostępnych przedmiotów w magazynie.' });
              }
            }
          }
        });
      }
    }
  });
});
router.delete('/v1/orders/del/:id', async (req, res) => {
  const order_id = parseInt(req.params.id);

  // Sprawdzamy, czy istnieje zamówienie o podanym id
  const orderQuery = `
    SELECT * FROM orders
    WHERE id = ?;
  `;

  connection.query(orderQuery, [order_id], (orderError, orderResults) => {
    if (orderError) {
      console.error(orderError);
      res.status(500).json({ error: 'Wystąpił błąd podczas usuwania zamówienia.' });
    } else {
      if (orderResults.length === 0) {
        res.status(404).json({ error: 'Nie znaleziono zamówienia o podanym id.' });
      } else {
        const deleteOrderQuery = `
          DELETE FROM orders
          WHERE id = ?;
        `;

        connection.query(deleteOrderQuery, [order_id], (deleteError, deleteResults) => {
          if (deleteError) {
            console.error(deleteError);
            res.status(500).json({ error: 'Wystąpił błąd podczas usuwania zamówienia.' });
          } else {
            res.status(200).json({ message: `Zamówienie o id: ${order_id} zostało usunięte.` });
          }
        });
      }
    }
  });
});
router.get('/v1/orders/:id', async (req, res) => {
  const user = parseInt(req.params.id);
  connection.query('SELECT * FROM orders WHERE user_id = ?', [user], (err, rows) => {
    if (err) res.status(500).send({ error: err });
    else res.status(200).json(rows);
  });
});
module.exports = router;