const nodemailer = require("nodemailer");
const https = require("https");

const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    port : parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    auth:{
        user: process.env.SMTP_USER,
        pass:  process.env.SMTP_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendMailViaBrevo = (apiKey, mailOptions) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: {
        name: "SMS TEAM",
        email: process.env.SMTP_USER || "yadavrohit04570@gmail.com"
      },
      to: [
        {
          email: mailOptions.to
        }
      ],
      subject: mailOptions.subject,
      htmlContent: mailOptions.html
    });

    const options = {
      hostname: 'api.brevo.com',
      port: 443,
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
        'content-length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(responseBody));
        } else {
          reject(new Error(`Brevo API responded with status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

module.exports = {
  sendMail: (mailOptions) => {
    if (process.env.BREVO_API_KEY) {
      console.log("Using Brevo HTTP API to send email...");
      return sendMailViaBrevo(process.env.BREVO_API_KEY, mailOptions);
    } else {
      console.log("Using SMTP transporter to send email...");
      return transporter.sendMail(mailOptions);
    }
  }
};