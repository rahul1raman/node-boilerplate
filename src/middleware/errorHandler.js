const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (err, req, res, next) => {
  console.error(err.stack);

  switch (true) {
    case err instanceof BadRequestError:
      res.status(400).json({ message: err.message });
      break;
    case err instanceof UnauthorizedError:
      res.status(401).json({ message: err.message });
      break;
    case err instanceof NotFoundError:
      res.status(404).json({ message: err.message });
      break;
    default:
      res.status(500).json({
        message: 'Something went wrong',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
      });
  }
};
