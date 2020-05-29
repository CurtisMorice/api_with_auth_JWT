const JWT = require('jsonwebtoken');

module.exports = (req, resp, next) => {
  const token = req.header('auth-token');
  if (!token) return resp.status(401).send('Access Denied');

  try {
    const verified = JWT.verify(token, process.env.TOKEN_SECRET);
    if (verified) req.user = verified;
    next();
  } catch (error) {
    res.status(400).send('Invalid Token');
  }
}
