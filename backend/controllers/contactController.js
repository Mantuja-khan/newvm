import nodemailer from "nodemailer";
import Contact from "../models/Contact.js";

export const submitContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const submission = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    name: name.trim(),
    email: email.trim(),
    phone: phone ? phone.trim() : "",
    subject: subject ? subject.trim() : "New Contact Inquiry",
    message: message.trim(),
    date: new Date().toISOString(),
  };

  try {
    await Contact.create(submission);
  } catch (err) {
    console.error("Error saving contact submission to MongoDB:", err);
  }

  const recipientEmail = process.env.ADMIN_EMAIL || "vishalvmsolutiions@gmail.com";
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  // Immediately respond to client to prevent hanging requests
  res.json({
    success: true,
    message: `Thank you! Your message has been received and recorded. We will contact you shortly.`,
  });

  // Handle email notification asynchronously in background with connection timeouts
  if (gmailPass) {
    (async () => {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: recipientEmail,
            pass: gmailPass,
          },
          connectionTimeout: 4000,
          socketTimeout: 4000,
          greetingTimeout: 4000,
        });

        const mailOptions = {
          from: `"${submission.name}" <${recipientEmail}>`,
          replyTo: submission.email,
          to: recipientEmail,
          subject: `[Website Contact Form] ${submission.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
              <h2 style="color: #0284c7; border-bottom: 2px solid #0284c7; padding-bottom: 10px;">New Contact Message Received</h2>
              <p><strong>Full Name:</strong> ${submission.name}</p>
              <p><strong>Email Address:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
              <p><strong>Phone Number:</strong> ${submission.phone || "Not provided"}</p>
              <p><strong>Subject:</strong> ${submission.subject}</p>
              <div style="background-color: #f9fafb; padding: 15px; border-left: 4px solid #0284c7; margin-top: 15px;">
                <strong>Message:</strong>
                <p style="white-space: pre-wrap; margin-top: 5px;">${submission.message}</p>
              </div>
              <p style="font-size: 11px; color: #6b7280; margin-top: 25px;">Sent to Admin (${recipientEmail}) via VM Solutiions Contact Form</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${recipientEmail}`);
      } catch (mailErr) {
        console.error("Background email notice failed (submission recorded in DB):", mailErr.message);
      }
    })();
  } else {
    console.log(`Saved contact form submission for ${recipientEmail} into MongoDB:`, submission);
  }
};
