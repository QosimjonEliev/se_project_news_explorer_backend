const { SERVER_ERROR_MESSAGE } = require("../utils/constants");

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(
    `Error ${err.name} with the message "${err.message}" has occurred.`,
  );
  console.error(err);
  res.status(statusCode).send({
    message: statusCode === 500 ? SERVER_ERROR_MESSAGE : message,
  });
};

module.exports = { errorHandler };
