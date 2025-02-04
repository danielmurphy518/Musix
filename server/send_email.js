const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Read email template file and replace placeholders
const loadTemplate = (templateName, data) => {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  
  try {
    let template = fs.readFileSync(templatePath, 'utf8'); // Read the template file
    // Replace placeholders in the template with actual data
    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      template = template.replace(new RegExp(placeholder, 'g'), value);
    }
    return template;
  } catch (error) {
    console.error("Error loading template:", error);
    throw new Error('Template not found');
  }
};

// Create a transporter object
let transporter;
try {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true,
    logger: true,
  });
} catch (error) {
  console.error("Error creating transporter:", error);
}

// Send email function
const sendEmail = (to, subject, templateName, templateData) => {
  // Load the HTML template and replace placeholders with data
  const htmlContent = loadTemplate(templateName, templateData);
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent, // Use the HTML content
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
