const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the website files
app.use(express.static(__dirname));

// ==========================================
// CONFIGURATION (Using Gmail as the Sender)
// ==========================================
// 1. Enter your PERSONAL Gmail address
// 2. Enter your 16-character Gmail APP PASSWORD
const SENDER_EMAIL = 'rohaansmart7@gmail.com';
const SENDER_PASS = 'laok aeeo tzmn rfwf';

// This is where you want to RECEIVE the emails
const RECEIVER_EMAIL = 'info@geezsquad.in';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_EMAIL,
    pass: SENDER_PASS
  }
});

app.post('/send', (req, res) => {
  const { name, email, phone, program, message } = req.body;

  const mailOptions = {
    from: email,
    to: RECEIVER_EMAIL, // Send the mail to your business inbox
    subject: `Geez Squad: New Lead from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
        <h2 style="color: #000;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Program:</strong> ${program}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #000;">
          ${message}
        </div>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ status: 'error', message: error.message });
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).json({ status: 'success', message: 'Message sent successfully!' });
    }
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`
=========================================
  Mail Server Running on port ${PORT}
  Endpoint: http://localhost:${PORT}/send
=========================================
  `);
});
