const nodemailer = require('nodemailer');


async function sendResetPasswordEmail(to, resetAttemptId){
  try {
    var id = resetAttemptId;

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
      subject: `${process.env.APP_NAME} Password Reset Request`,
      html: `<h2>Hey, ${process.env.APP_NAME} user!</h2><p>Someone requested a password change on your account.  If this was not you, please ignore this email.</p><a href="${process.env.APP_URL}/password-reset/${id}">Click here to reset your password</a>`
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

module.exports = sendResetPasswordEmail;
