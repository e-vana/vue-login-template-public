require('dotenv').config();
const mailjet = require ('node-mailjet').connect(`${process.env.MAILJET_KEY1}`, `${process.env.MAILJET_KEY2}`);


const sendResetPasswordEmail = async function (to, resetAttemptId){
  try {

    let htmlString = `<h2>Hey, ${process.env.APP_NAME} user!</h2><p>Someone requested a password change on your account.  If this was not you, please ignore this email.</p><a href="${process.env.APP_URL}/password-reset/${resetAttemptId}">Click here to reset your password</a>`

    let requestObject = {"Messages":[
      {
        "From": {
          "Email": `${process.env.EMAIL}`,
          "Name": `${process.env.FIRST_NAME}`
        },
        "To": [
          {
            "Email": `${to}`,
            "Name": `${to}`
          }
        ],
        "Subject": `Vue Authentication Password Reset`,
        "TextPart": "",
        "HTMLPart": `${htmlString}`,
        "CustomID": "AppGettingStartedTest"
      }
    ]};

    let request = await mailjet.post("send", {'version': 'v3.1'}).request(requestObject);
    if(request){
      console.log(`Succesfully sent a reset password email to ${to}`)
      return true;
    }else {
      return false;
    }
  } catch (error) {
    console.log(error)
  }
  
}

module.exports = sendResetPasswordEmail;


