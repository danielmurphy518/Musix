const { sendEmail } = require('./send_email'); // Correct path
// Sample data to replace placeholders in the template
const templateData = {
  name: "John Doe", // Replace with the user's name
  verificationLink: "http://localhost:4000/verify?token=abc123", // Replace with the actual verification link
};

const to = "daniel.murphyx@gmail.com"; // Replace with the recipient's email address
const subject = "Welcome to MUSIC APP - Complete Your Registration";
const templateName = "welcome"; // Name of the template file without the .html extension

sendEmail(to, subject, templateName, templateData)
  .then(info => {
    console.log("Email sent successfully:", info.response);
  })
  .catch(error => {
    console.error("Error sending email:", error);
  });