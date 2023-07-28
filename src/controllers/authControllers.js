const jwt = require('jsonwebtoken');
const User = require('../models/index').models.User;


const signToken = id => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  delete user.password;

  return token
}


exports.login = async(req, res) => {
  const { email, password } = req.body;


  if (!email || !password) {
    res
      .status(401)
      .send("Please provide email and password");
      return ;
  }

  const user = await User.findOne({ where: { email: email } });

  if (!user) {
    res
      .status(401)
      .send("Incorrect email or password");
    
    return ;
  }

  const correct = await user.comparePassword(password, user.password);

  if (!correct) {
    user.update({ failedAttempts: user.failedAttempts + 1, lastFailedLogin: new Date() });
    res
      .status(401)
      .render('admin/login', {
        error: 'Incorrect email or password'
      });
    
    return ;
  }

  await user.update({ failedAttempts: 0, lastFailedLogin: null })
  const token = createSendToken(user, 200, res);

  return user;
}

exports.logout = async(req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res
    .status(200)
    .redirect('/admin/login');
}
