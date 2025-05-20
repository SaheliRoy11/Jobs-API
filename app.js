require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//parses json payloads 
app.use(express.json());


// routes
app.use('/', require('./routes'));

// error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {

  //connect to db, if only connection is successful then listen on port
  connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  })
  .catch((err) => {
    console.log(err);
  })
};

start();
