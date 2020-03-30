const nodemailer = require('nodemailer');
require('dotenv').config();



async function sendConfirmationEmail(to, userId){
  try {

    let transporter = nodemailer.createTransport({
      service: 'Hotmail',
      auth: {
          user: `${process.env.EMAIL_USER}`,
          pass: `${process.env.EMAIL_PW}`
      }
  });

    var mailOptions = {
      from: `${process.env.EMAIL_USER}`,
      to: to,
      subject: `${process.env.APP_NAME} New User Confirmation `,
      html: `<h2>Thank you for signing up for ${process.env.APP_NAME}!</h2><p>Please click the link below to confirm your account creation.</p><a href="${process.env.APP_URL}/confirm-email/${userId}">Click here to finish account registration.</a>`
    };
    var mailOutput = await transporter.sendMail(mailOptions);
    console.log(mailOutput)
    if(mailOutput){
      return true;
    } else {
      return false;
    }
  } catch(err){
    console.log(err);
    return false;
  }

}

module.exports = sendConfirmationEmail;
