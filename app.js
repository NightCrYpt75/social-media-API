require('dotenv').config();
require('express-async-errors');
const connectdb=require('./db/connect')
const express = require('express');
const app = express();

const mainRouter=require('./routes/main')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const req = require('express/lib/request');

// middleware
//app.use(express.static('./public'));
app.use(express.json());


app.use('/api',mainRouter)

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectdb(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
