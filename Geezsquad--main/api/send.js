const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // CORS headers for preflight requests (optional, but good for Vercel if needed)
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, program, message } = req.body;

  // Uses environment variables from Vercel (or falls back to previous hardcoded values)
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'rohaansmart7@gmail.com';
  const SENDER_PASS = process.env.SENDER_PASS || 'laok aeeo tzmn rfwf';
  const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL || 'info@geezsquad.in';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SENDER_EMAIL,
      pass: SENDER_PASS
    }
  });

  const mailOptions = {
    from: email,
    to: RECEIVER_EMAIL,
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

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({ status: 'success', message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
}
