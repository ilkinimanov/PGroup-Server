const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const User = require('../models/index').models.User;


exports.isAuthenticated = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;

  }

  if (!token) {
    res
      .status(401)
      .redirect('/admin/login');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch (err) {
    res
      .status(401)
      .redirect('/admin/login');
  }
};

exports.redirectIfNotAuthenticated = async(req, res, next) => {
  let token
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    res
      .redirect('/admin')
  } catch (err) {
    next();
  }
}


exports.limitLoginAttempts = async (req, res, next) => {

  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });


  if (!user) {
    return res
      .status(401)
      .send('Incorrect email or password');
  }

  const currentTime = new Date();
  const lastFailedLogin = user.lastFailedLogin;

  const timeDiff = (currentTime - lastFailedLogin) / (1000 * 60);

  if (timeDiff < 15 && user.failedAttempts > 5) {
    return res
      .status(429)
      .render('admin/login', {
        error: 'Too many login attempts. Please try again later.'
      });
  }

  next();
};
