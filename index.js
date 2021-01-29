const nodemailer = require('nodemailer');

exports.sendEmail = async (event, context) => {
  const pubsubMessage = event.data;
  const message = pubsubMessage ? JSON.parse(Buffer.from(pubsubMessage, 'base64').toString()) : null;

  console.log(`Incoming message: ${JSON.stringify(message)}`);

  if (message === null) {
    console.log('Message cannot be empty');
    return;
  }

  const email = message.email;
  const data = message.data;
  const subject = message.subject;
  console.log(`email: ${email}`);

  let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: process.env.MAILTRAP_USER,
       pass: process.env.MAILTRAP_PASS
    }
  });

  const emailMessage = {
    from: 'noreply@tesla.com',
    to: email,
    subject: subject,
    text: data
  };
  return transport.sendMail(emailMessage, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
  });
}