module.exports = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
  });
};
