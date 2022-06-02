import express from 'express';

import createError from 'http-errors';
import cookieParser from 'cookie-parser';

import router from './routes/index';

import errorHandler from './middleware/errorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', router);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound);
});

// pass any unhandled errors to the error handler
app.use(errorHandler);

export default app;
