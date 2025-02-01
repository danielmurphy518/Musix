const nodemailer = require("nodemailer");
require("dotenv").config(); // Load environment variables

// Log environment variables to verify they are loaded
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

// Create a transporter object
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service (e.g., Gmail, Outlook)
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
    },
    debug: true, // Enable debugging
    logger: true, // Log to console
  });
  console.log("Transporter created successfully:", transporter);
} catch (error) {
  console.error("Error creating transporter:", error);
}

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body
 * @param {string} html - HTML body (optional)
 * @returns {Promise} - Resolves if email is sent successfully, rejects otherwise
 */
const sendEmail = (to, subject, text, html = "") => {
  // Input validation
  if (!to || !subject || !text) {
    throw new Error("Missing required fields: to, subject, or text");
  }

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Recipient address
    subject, // Subject line
    text, // Plain text body
    html: html || text, // Use HTML if provided, otherwise fallback to text
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };