require('dotenv').config();
const mailjet = require ('node-mailjet').connect(`${process.env.MAILJET_KEY1}`, `${process.env.MAILJET_KEY2}`);


const sendConfirmationEmail = async function (to, userId){
  try {

    let htmlString = `<h2>Thank you for signing up for ${process.env.APP_NAME}!</h2><p>Please click the link below to confirm your account creation.</p><a href="${process.env.APP_URL}/confirm-email/${userId}">Click here to finish account registration.</a>`

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
        "Subject": `Vue Authentication Email Confirmation`,
        "TextPart": "",
        "HTMLPart": `${htmlString}`,
        "CustomID": "AppGettingStartedTest"
      }
    ]};

    let request = await mailjet.post("send", {'version': 'v3.1'}).request(requestObject);
    if(request){
      console.log(`Succesfully sent a confirmation email to ${to}`)
      return true;
    }else {
      return false;
    }
  } catch (error) {
    console.log(error)
  }
  
}

module.exports = sendConfirmationEmail;


