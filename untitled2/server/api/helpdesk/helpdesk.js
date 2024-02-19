/* Imports */
const express = require('express');
const { Router } = require('express');
const mysql = require('mysql2');
const dbConfig = require('../../config/db');
const axios = require("axios");
const moment = require('moment');
/* Config */
const connection = mysql.createConnection(dbConfig);
const router = Router();
router.use(express.json());
const ticketData = {
  type: 'IT Ticket',
  message: 'Nowe zgłoszenie zostało dodane.',
  senderId: null,
};
/* Main */
router
  .post('/v1/helpdesk/', (req, res) => {
    try {
      const { chatId, sender_id, sender, message, role_id, timestamp } = req.body;
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS chat_${chatId} (
          id       INT AUTO_INCREMENT PRIMARY KEY,
          user_id  INT,
          username VARCHAR(255),
          message  TEXT,
          role_id  INT,
          timestamp DATETIME
        );
      `;
      const addMessageQuery = `
        INSERT INTO chat_${chatId} (user_id, username, message, role_id, timestamp)
        VALUES (?, ?, ?, ?, ?);
      `;
      connection.query(createTableQuery, (createError) => {
        if (createError) {
          console.error('Błąd podczas tworzenia tabeli:\n', createError);
          res.status(500).json({error: 'Wystąpił błąd podczas tworzenia tabeli' });
        } else {
          connection.query(addMessageQuery, [sender_id, sender, message, role_id, timestamp], (addError) => {
            if (addError) {
              console.error('Błąd podczas dodawania wiadomości:\n', addError);
              res.status(500).json({error: 'Wystąpił błąd podczas dodawania wiadomości' });
            } else {
              const svQuery = `SELECT user_id FROM chat_${chatId} WHERE role_id = 2 LIMIT 1;`;
              connection.query(svQuery, (svError, results) => {
                if (svError) {
                  console.error('Błąd podczas przeszukiwania czatu:\n', svError);
                  res.status(500).json({ error: 'Wystąpił błąd podczas przeszukiwania czatu' });
                } else {
                  if (results.length > 0) {
                    const supervisorId = results[0].user_id;
                    const updateSvQuery = `UPDATE tickets SET supervisor_id = ${supervisorId} WHERE id = ${chatId};`;
                    connection.query(updateSvQuery, (updateError) => {
                      if (updateError) {
                        console.error('Błąd podczas aktualizacji supervisor_id:\n', updateError);
                        res.status(500).json({ error: 'Wystąpił błąd podczas aktualizacji supervisor_id' });
                      } else {
                        res.status(200).json({ message: 'Wiadomość została dodana' });
                      }
                    });
                  } else {
                    res.status(200).json({ message: 'Wiadomość została dodana' });
                  }
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.error('Błąd podczas obsługi żądania:', error);
      res.status(500).json({ error: 'Wystąpił błąd' });
    }
  })
  .get('/v1/helpdesk/:id/messages', (req, res) => {
    try {
      const chatId = parseInt(req.params.id);

      // Sprawdź istnienie tabeli chat_id
      const checkTableQuery = `SHOW TABLES LIKE 'chat_${chatId}'`;

      connection.query(checkTableQuery, (checkError, checkResults) => {
        if (checkError) {
          console.error('Błąd zapytania SQL:', checkError);
          res.status(500).json({ error: 'Wystąpił błąd serwera' });
        } else {
          if (checkResults.length > 0) {
            // Tabela istnieje, pobierz wszystkie wiadomości z tej tabeli
            const getMessagesQuery = `SELECT * FROM chat_${chatId}`;

            connection.query(getMessagesQuery, (getError, results) => {
              if (getError) {
                console.error('Błąd zapytania SQL:', getError);
                res.status(500).json({ error: 'Wystąpił błąd serwera' });
              } else {
                for (const result of results) {
                  result.timestamp = moment(result.timestamp).format('YYYY-MM-DD HH:mm:ss');
                }
                res.status(200).json({ messages: results });
              }
            });
          } else {
            // Tabela nie istnieje, zwróć odpowiednią odpowiedź
            res.status(404).json({ error: 'Tabela nie istnieje' });
          }
        }
      });
    } catch (error) {
      console.error('Błąd podczas obsługi żądania:', error);
      res.status(500).json({ error: 'Wystąpił błąd' });
    }
  })
  .post('/v1/helpdesk/addTicket', (req, res) => {
    try {
      let requestData = req.body;
      const columns = Object.keys(requestData);
      const values = Object.values(requestData);
      switch(values[2]) {
        case '1':
          values[2] = 'Komputer';
          switch(values[3]) {
            case '1':
              values[3] = 'Komputer nie działa';
              break;
            case '2':
              values[3] = 'Problem z aplikacją';
              break;
            case '3':
              values[3] = 'Brak internetu';
              break;
            case '4':
              values[3] = 'Inny problem';
              break;
            default:
              break;
          }
          break;
        case '2':
          values[2] = 'Drukarka';
          switch(values[3]) {
            case '1':
              values[3] = 'Problem z podłączeniem drukarki';
              break;
            case '2':
              values[3] = 'Brak tuszu/tonera';
              break;
            case '3':
              values[3] = 'Nie włącza się / Zawiesiła się';
              break;
            case '4':
              values[3] = 'Inny problem';
              break;
            default:
              break;
          }
          break;
        case '3':
          values[2] = 'Inne';
          switch(values[3]) {
            case '1':
              values[3] = 'Inny problem';
              console.log(values[3]);
              break;
            default:
              break;
          }
          break;
      }
      const insertQuery = `
      INSERT INTO tickets
      (${columns.join(', ')})
      VALUES (${columns.map(() => '?').join(', ')});`;

      connection.execute(insertQuery, values)
      ticketData.senderId = requestData.user_id;
      res.status(200).json({ message: 'Ticket został pomyślnie utworzony'});
    } catch (error) {
      console.error('Błąd podczas tworzenia ticketu:', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas tworzenia ticketu' });
    }
  })
  .get('/v1/helpdesk/viewTickets', (req,res) => {
    try {
      // Zapytanie SQL do pobrania wszystkich wniosków
      const sqlQuery = `
        SELECT id, category, problem, additional_info, user_id, supervisor_id, gpt_ans, closed
        FROM tickets;`;

      connection.query(sqlQuery, (error, results) => {
        if (error) {
          console.error('Błąd podczas pobierania ticketów: ', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas pobierania ticketów' });
        } else {
          res.status(200).json(results);
        }
      });
    } catch (error) {
      console.error('Błąd podczas wyświetlania listy ticketów: ', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy ticketów' });
    }
  })
  .get('/v1/helpdesk/viewTickets/category/:category', (req, res) => {
    try {
      let category = req.params.category;
      // Zapytanie SQL do pobrania wszystkich wniosków
      const sqlQuery = `
        SELECT id, category, problem, additional_info, user_id, supervisor_id, gpt_ans, closed
        FROM tickets WHERE category = ?`;

      connection.execute(sqlQuery, [category], (error, results) => {
        if (error) {
          console.error('Błąd podczas pobierania ticketów: ', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas pobierania ticketów' });
        } else {
          res.json(results);
        }
      });
    } catch (error) {
      console.error('Błąd podczas wyświetlania listy ticketów: ', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy ticketów' });
    }
  })
  .get('/v1/helpdesk/viewTickets/myTickets/:user_id', (req, res) => {
    try {
      const user_id = parseInt(req.params.user_id);
      // Zapytanie SQL do pobrania wszystkich wniosków
      const sqlQuery = `
        SELECT id, user_id, category, problem, additional_info, supervisor_id, gpt_ans, closed
        FROM tickets WHERE user_id = ?;`;

      connection.query(sqlQuery, [user_id], (error, results) => {
        if (error) {
          console.error('Błąd podczas pobierania ticketów: ', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas pobierania ticketów' });
        } else {
          res.json(results);
        }
      });
    } catch (error) {
      console.error('Błąd podczas wyświetlania listy ticketów: ', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy ticketów' });
    }
  })
  .get('/v1/helpdesk/viewTickets/id/:id', (req, res) => {
    const ticket_id = parseInt(req.params.id);
    try {
      // Zapytanie SQL do pobrania wszystkich wniosków
      const sqlQuery = `
        SELECT id, category, problem, additional_info, user_id, supervisor_id, gpt_ans, closed
        FROM tickets where id = ?;`;

      connection.query(sqlQuery, [ticket_id], (error, results) => {
        if (error) {
          console.error('Błąd podczas pobierania ticketów: ', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas pobierania ticketów' });
        } else {
          // console.log(results);
          res.json(results);
        }
      });
    } catch (error) {
      console.error('Błąd podczas wyświetlania listy ticketów: ', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania listy ticketów' });
    }
  })
  .put('/v1/helpdesk/editTicketSupervisor/id/:id/:user_id', (req, res) => {
    const ticket_id = req.params.id;
    const user = req.params.user_id;
    try {
      // Zapytanie SQL do pobrania wszystkich wniosków
      const sqlQuery = `
          UPDATE tickets
          SET supervisor_id = ?
          WHERE id = ?;`;
      connection.query(sqlQuery, [user, ticket_id], (error, results) => {
        if (error) {
          console.error('Błąd podczas pobierania danych ticketu: ', error);
          res.status(500).json({ error: 'Wystąpił błąd podczas pobierania danych ticketu' });
        } else {
          res.json(results);
        }
      });
    } catch (error) {
      console.error('Błąd podczas wyświetlania danych ticketu: ', error);
      res.status(500).json({ error: 'Wystąpił błąd podczas wyświetlania danych ticketu' });
    }
  })
  .post('/v1/helpdesk/gpt/:data', async (req, res) => {
  try {
    const requestData = req.params.data;
    await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: requestData }
      ],
      max_tokens: 3500,
      n: 1,
      stop: null,
      temperature: 0.8
    }, {
      headers: {
        Authorization: `Bearer ${process.env.TOKEN}`
      }
    })
      .then(response => {
        const gptResponse = response.data.choices[0].message.content.replace(/\n/g, "\n");
        return res.status(200).json({ res:gptResponse });
      })
      .catch(error => {
        if (error.response && error.response.data) {
          console.error('Błąd podczas komunikacji z GPT-3.5 Turbo:', error.response.data);
        } else {
          console.error('Błąd podczas komunikacji z GPT-3.5 Turbo:', error.message);
        }
        return res.status(500).json({ error: 'Wystąpił błąd podczas komunikacji z GPT-3.5 Turbo' });
      });

  } catch (error) {
    console.error('Błąd podczas obsługi żądania:', error);
    return res.status(500).json({ error: 'Wystąpił błąd podczas obsługi żądania' });
  }
});

module.exports = { router, ticketData };
