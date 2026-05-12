import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, from, subject, templateData } = req.body;

  if (!to || !from || !subject || !templateData) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Replace with your SMTP host (e.g., smtp.gmail.com for Gmail)
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  // Construct the email HTML
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Service Intake Confirmation</h2>
      <p>Dear ${templateData.customerName},</p>
      <p>Your ${templateData.brandName} ${templateData.model} has been received for service.</p>
      <ul>
        <li><strong>Reference:</strong> ${templateData.reference}</li>
        <li><strong>Serial Number:</strong> ${templateData.serialNumber}</li>
        <li><strong>Received Date:</strong> ${templateData.receivedDate}</li>
        <li><strong>Diagnosis:</strong> ${templateData.diagnosis}</li>
      </ul>
      <p>We will contact you shortly with updates.</p>
      <p>Best regards,<br>Operations Team<br>werecle.com</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}