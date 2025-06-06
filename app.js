require('dotenv').config();
require('express-async-errors');

//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//parses json payloads 
app.use(express.json());

app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,//15 minutes
  max: 100 //limit each IP to 100 requests per windowMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());

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
