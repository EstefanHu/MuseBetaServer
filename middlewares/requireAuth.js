const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  // authorization === 'Bearer laksjdflaksdjasdfklj'

  if (!authorization)
    return res.status(401).json({
      status: 'failure',
      payload: 'You must be logged in.'
    });

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
    if (err)
      return res.status(401).json({
        status: 'failure',
        payload: 'You must be logged in.'
      });

    const { userId } = payload;
    req.userId = userId;
    next();
  });
};