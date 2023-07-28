const authControllers = require('./authControllers');


exports.indexController = async(req, res) => {
  res
    .status(200)
    .render('admin/index')
}


exports.adminLoginGetController = async(req, res) => {
  res
    .status(200)
    .render('admin/login');
};


exports.adminLoginPostController = async(req, res) => {

  const user = await authControllers.login(req, res);

  if (user) {
    res
      .status(200)
      .redirect('/admin');
  }

}
