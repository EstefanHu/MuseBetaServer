const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: 'Estefan Hu <info@projectmuse.co>', // TODO: Update
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;

// const gmailEmail = options => {
//   const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//       user: process.env.GMAIL_USERNAME,
//       pass: process.env.GMAIL_PASSWORD
//     }
//   })
// }