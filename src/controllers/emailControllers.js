const nodemailer = require('nodemailer');


const mailList = process.env.MAIL_DESTINATIONS.split(',')


exports.sendEmail = async(req, res, next) => {
  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const { name, email, message } = req.body

  if (!name || !email) {
    res
      .status(500)
      .json({
        error: "You must provide name, email and message"
      })
  }

  let mailDetails = {
    from: email,
    to: mailList,
    subject: 'PGroup Backend',
    text: `
      email: ${email}
      name: ${name}
      message: ${message}
    `
  };

  mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
      console.log('Error Occurs');
    } else {
      console.log('Email sent successfully');
    }
  });
  next();
}