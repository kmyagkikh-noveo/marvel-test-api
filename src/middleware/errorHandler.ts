import { ErrorRequestHandler } from 'express';
import createError from 'http-errors';

const errorHandler: ErrorRequestHandler = (err, req_ctx, res) => {
  console.error(err);
  // if the error is safe to expose to client
  if (err.expose === true) {
    res.status(err.status || 500).send(err);
  } else {
    res.status(500).send(createError.InternalServerError);
  }
};

export default errorHandler;
