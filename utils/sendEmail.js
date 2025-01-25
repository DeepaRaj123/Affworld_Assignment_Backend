const nodemailer = require('nodemailer');

/**
 * Utility function to send emails using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Subject of the email
 * @param {string} options.text - Plain text content of the email
 * @param {string} [options.html] - Optional HTML content for the email
 */
const sendEmail = async ({ to, subject, text, html }) => {
    try {
        // Create a transporter object using SMTP configuration
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL_USER, // Email address from environment variables
                pass: process.env.EMAIL_PASS, // Email password or app-specific password
            },
        });

        // Define email options
        const mailOptions = {
            from: `"Task Manager" <${process.env.EMAIL_USER}>`, // Sender address
            to, // Recipient email address
            subject, // Email subject
            text, // Plain text email content
            html, // Optional HTML content for the email
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`); // Log the success message
    } catch (error) {
        console.error('Error sending email:', error.message); // Log errors
        throw new Error('Failed to send email.'); // Throw an error to the calling function
    }
};

module.exports = sendEmail; // Export the utility function
