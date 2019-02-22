'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const router = require('./bookmark-router');
const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use((req,res,next)=>{
  const apitoken = process.env.API_TOKEN;
  const apiAuthToken = req.get('Authorization');
  if(!apiAuthToken || apiAuthToken.split(' ')[1] !== apitoken ){
    res.status(401).json({error: 'unauthorized'});
  }
  next();
});

app.use(router);
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});
const { PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});