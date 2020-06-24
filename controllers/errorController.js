const sendErrorDev = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    payload: error.message,
    stack: error.stack
  });
};

const sendErrorProd = (error, res) => {
  if (error.isOperational) {
    res
      .status(error.statusCode)
      .json({
        status: error.status,
        payload: error.message,
      })
  } else {
    console.error('Error: ', err);
    res
      .status(500)
      .json({
        status: 'error',
        payload: 'Something went wrong with the server.'
      });
  };
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(error, res);
  }
};