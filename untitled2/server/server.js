/* Imports */
const dotenv               = require('dotenv').config();
const express = require('express');
const usersRouter = require('./api/users/users');
const loginRouter = require('./api/login/login');
const logoutRouter = require('./api/logout/logout');
const registerRouter = require('./api/register/register');
const availabilityRouter = require('./api/availability/availability');
const requestsRouter = require('./api/requests/requests');
const rolesRouter = require('./api/roles/roles');
const helpdeskRouter = require('./api/helpdesk/helpdesk');
const devicesRouter = require('./api/devices/devices')
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const axios = require('axios');
/* Config */
const app = express();
const tokenMonitor = require('./api/middleware/monitor');
const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [process.env.SERVER_IP, process.env.CLIENT_IP],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['content-type'],
    credentials: true,
  },
});
const actions = [];
io.on("connection", (socket) => {
  console.log("Nowy klient połączony");
  socket.on("message", (message) => {
    // console.log("Otrzymano wiadomość: ", message);
    io.emit("message", message);
  });
  socket.on("disconnect", () => {
    console.log("Klient rozłączony");
  });
  socket.on('new-ticket', (dataticket) => {
    actions.push({action: 'Data', data: dataticket, timestamp: new Date() });
    console.log(actions);
  });
});
// httpServer.listen(3002, () => {
//   console.log("Serwer Socket.io nasłuchuje na porcie 3002");
// });

app.use(cors());

tokenMonitor.start();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().array());
app.use(express.static('public'));
app.use(usersRouter);
app.use(loginRouter);
app.use(logoutRouter);
app.use(availabilityRouter);
app.use(requestsRouter);
app.use(rolesRouter);
app.use(registerRouter);
app.use(helpdeskRouter.router);
app.use(devicesRouter);

/* Main */
httpServer.listen(process.env.APP_PORT, () => {
  console.log(`Serwer nasłuchuje na porcie ${process.env.APP_PORT}`);
  // console.log({httpServer});
});