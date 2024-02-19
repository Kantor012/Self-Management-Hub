/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');

/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();

router.use(express.json());

router.post('/v1/addRequestHR', async (req, res) => {
  try {
    const requestData = req.body; // Cały obiekt żądania, w którym klucze odpowiadają nazwom kolumn w tabeli requests_hr

    const columns = Object.keys(requestData);
    const values = Object.values(requestData);

    // Budowanie zapytania SQL dynamicznie na podstawie dostępnych kolumn i wartości
    const insertQuery = `INSERT INTO requests_hr (id, ${columns.join(', ')}) VALUES (GetNextId('requests_hr'), ${columns.map(() => '?').join(', ')});`;
    connection.execute(insertQuery, values)
    res.status(200).json({ message: 'Wniosek do HR został pomyślnie utworzony'});
  } catch (error) {
    console.error('Błąd podczas tworzenia wniosku do HR:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia wniosku do HR' });
  }
});

router.get('/v1/viewRequests', (req, res) => {
  try {
    // Zapytanie SQL do pobrania wszystkich wniosków
    const sqlQuery = `
        SELECT 'hr' AS type, r.id, r.user_id, r.supervisor_id, r.category_id, r.from_date, r.to_date, r.additional_info, r.accepted, r.acceptedByBoss, u.name, u.surname
        FROM requests_hr r 
                 LEFT JOIN users u ON r.user_id = u.id
        where accepted is null;
    `;

    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Błąd podczas pobierania wniosków: ', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania wniosków' });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Błąd podczas wyświetlania listy wniosków: ', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy wniosków' });
  }
});
router.get('/v1/viewArchive', (req, res) => {
  try {
    // Zapytanie SQL do pobrania wszystkich wniosków
    const sqlQuery = `
        SELECT 'hr' AS type, r.id, r.user_id, r.supervisor_id, r.category_id, r.from_date, r.to_date, r.additional_info, r.accepted, r.acceptedByBoss, u.name, u.surname
        FROM requests_hr r 
                 LEFT JOIN users u ON r.user_id = u.id
        where accepted is not null;
    `;

    connection.query(sqlQuery, (error, results) => {
      if (error) {
        console.error('Błąd podczas pobierania wniosków: ', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania wniosków' });
      } else {
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Błąd podczas wyświetlania listy wniosków: ', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy wniosków' });
  }
});
router.put('/v1/editRequests/idBoss/:id', (req, res) => {
  try {
    const id = req.params.id;
    connection.query(`UPDATE requests_hr SET acceptedByBoss = 1 WHERE id = ? `, [id])
  } catch (e) {
    console.error('Błąd podczas zatwierdzania wniosku: ', e);
    res.status(500).json({ error: 'Wystąpił błąd podczas zatwierdzania wniosku' });
  }
})
router.get('/v1/viewRequests/user/:id', (req, res) => {
  try {
    // Zapytanie SQL do pobrania wszystkich wniosków
    const id = req.params.id;
    connection.query(`
                SELECT * FROM (SELECT 'hr' AS type, r.id, r.user_id, r.supervisor_id, r.category_id, r.from_date, r.to_date,
                                      r.additional_info, r.accepted, r.acceptedByBoss, u.name, u.surname
                               FROM requests_hr r
                                        LEFT JOIN users u ON r.user_id = u.id
                               WHERE r.user_id = ?) x order by x.id desc;
    `,[id],
      (error, results) => {
      if (error) {
        console.error('Błąd podczas pobierania wniosków: ', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas pobierania wniosków' });
      } else {
        // console.log(results[0].gpt_answer);
        res.json(results);
      }
    });
  } catch (error) {
    console.error('Błąd podczas wyświetlania listy wniosków: ', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy wniosków' });
  }
});
router.post('/v1/acceptRequest/hr/delegation/:id', (req, res) => {
  try {
    const requestData = req.body;
    if (requestData.id && requestData.user_id) {
      const updateQuery = `
          UPDATE requests_hr
          SET accepted = true
          WHERE id = ?;`;
      connection.execute(updateQuery, [requestData.id], (error) => {
        if (error) {
          console.error('Błąd podczas aktualizacji wniosku do HR:', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji wniosku do HR' });
        }
      })
    }
  } catch (error) {
    console.error('Błąd podczas akceptowania wniosku do HR:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas akceptowania wniosku do HR' });
  }
})
router.post('/v1/acceptRequest/hr/holidays/:id', (req, res) => {
  try {
    const requestData = req.body;
    if (requestData.id && requestData.user_id && requestData.category_id && requestData.from_date && requestData.to_date) {
      const updateQuery = `
          UPDATE requests_hr
          SET accepted = true
          WHERE id = ?;`;

      connection.execute(updateQuery, [requestData.id], (error) => {
        if (error) {
          console.error('Błąd podczas aktualizacji wniosku do HR:', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji wniosku do HR' });
        } else {
          // Oblicz wcześniejszą i późniejszą datę
          const from_date = requestData.from_date < requestData.to_date ? requestData.from_date : requestData.to_date;
          const to_date = requestData.from_date < requestData.to_date ? requestData.to_date : requestData.from_date;
          if(from_date===to_date){
            this.from_date = requestData.from_date;
            this.to_date = requestData.to_date;
          }
          const fdate = new Date(from_date);
          const ffrom_date = fdate.toISOString().slice(0, 19).replace('T', ' ');
          const tdate = new Date(to_date);
          const fto_date = tdate.toISOString().slice(0, 19).replace('T', ' ');

          // Wstaw nowy wiersz do tabeli availability
          const insertAvailabilityQuery = `
            INSERT INTO availability
            (user_id, availability_id, from_date, to_date)
            VALUES (?, ?, ?, ?);`;

          connection.execute(
            insertAvailabilityQuery,
            [requestData.user_id, requestData.category_id, ffrom_date, fto_date],
            (insertError) => {
              if (insertError) {
                console.error('Błąd podczas dodawania dostępności:', insertError);
                res.status(500).json({ error: 'Wystąpił błąd podczas dodawania dostępności' });
              } else {
                res.status(200).json({ message: 'Wniosek do HR został pomyślnie zaakceptowany, a dostępność została dodana' });

              }
            }
          );
        }
      });
    } else {
      res.status(400).json({ error: 'Brak wymaganych pól w żądaniu' });
    }
  } catch (error) {
    console.error('Błąd podczas akceptowania wniosku do HR i dodawania dostępności:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas akceptowania wniosku do HR i dodawania dostępności' });
  }
});
router.put('/v1/rejectRequests/hr/:id', (req, res) => {
  try {
    const id = req.params.id;
    connection.query(`UPDATE requests_hr SET accepted = 0 WHERE id = ? `, [id])
  } catch (e) {
    console.error('Błąd podczas zatwierdzania wniosku: ', e);
    res.status(500).json({ error: 'Wystąpił błąd podczas zatwierdzania wniosku' });
  }
})
router.put('/v1/rejectRequests/idBoss/:id', (req, res) => {
  try {
    const id = req.params.id;
    console.log(req.params)
    connection.query(`UPDATE requests_hr SET acceptedByBoss = 0, accepted = 0 WHERE id = ? `, [id])
  } catch (e) {
    console.error('Błąd podczas zatwierdzania wniosku: ', e);
    res.status(500).json({ error: 'Wystąpił błąd podczas zatwierdzania wniosku' });
  }
})

router.post('/v1/createOrder/:id', (req, res) => {
  try {
    const requestData = req.body;

    // Sprawdź, czy wszystkie wymagane pola są obecne w żądaniu
    if (!requestData.id || !requestData.req_item || !requestData.req_quantity) {
      return res.status(400).json({ error: 'Brak wymaganych pól w żądaniu' });
    }

    // Zaktualizuj wiersz w tabeli requests_it, ustawiając accepted na true
    const updateQuery = `
      UPDATE requests_it
      SET accepted = true
      WHERE id = ?;`;

    connection.execute(updateQuery, [requestData.id], (error) => {
      if (error) {
        console.error('Błąd podczas aktualizacji wniosku do IT:', error);
        return res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji wniosku do IT' });
      }

      // Wstaw nowy wiersz do tabeli orders
      const insertOrderQuery = `
        INSERT INTO orders
        (request_id, req_item, req_quantity)
        VALUES (?, ?, ?);`;

      connection.execute(
        insertOrderQuery,
        [requestData.id, requestData.req_item, requestData.req_quantity],
        (insertError) => {
          if (insertError) {
            console.error('Błąd podczas dodawania zamówienia:', insertError);
            return res.status(500).json({ error: 'Wystąpił błąd podczas dodawania zamówienia' });
          }

          return res.status(200).json({ message: 'Wniosek do IT został pomyślnie zaakceptowany, a zamówienie zostało dodane' });
        }
      );
    });
  } catch (error) {
    console.error('Błąd podczas akceptowania wniosku do IT i dodawania zamówienia:', error);
    return res.status(500).json({ error: 'Wystąpił błąd podczas akceptowania wniosku do IT i dodawania zamówienia' });
  }
});

module.exports = router;