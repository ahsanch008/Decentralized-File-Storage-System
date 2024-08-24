const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const connect_db = require("./db_connection").connect_db;
const userRouter = require('./routes/UserRoutes');
const fileRouter = require('./routes/FileRoutes');

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cors())

connect_db();
app.use('/user', userRouter);
app.use('/file', fileRouter);

app.get('/', (req, res) => res.send('Hello from Decentralized world!'))
const port = process.env.PORT || 3000
const server = app.listen(port, () => console.log(`Listening on port ${port}!`))

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection occured! Shutting down....");

  server.close(() => {
    process.exit(1);
  });
});
