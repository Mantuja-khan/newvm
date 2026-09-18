import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Contact from "../models/Contact.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const recipientEmail = (process.env.ADMIN_EMAIL || "vishalvmsolutiions@gmail.com").trim();
  const rawAppPassword = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS || "";
  const gmailPass = rawAppPassword.replace(/\s+/g, "").trim();

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
          connectionTimeout: 6000,
          socketTimeout: 6000,
          greetingTimeout: 6000,
        });

        // Locate logo file for inline attachment (CID)
        const logoCandidates = [
          path.join(__dirname, "..", "..", "public", "logo.png"),
          path.join(__dirname, "..", "..", "dist", "logo.png"),
          path.join(__dirname, "..", "..", ".output", "public", "logo.png"),
        ];

        let logoPath = null;
        for (const cand of logoCandidates) {
          if (fs.existsSync(cand)) {
            logoPath = cand;
            break;
          }
        }

        const attachments = [];
        if (logoPath) {
          attachments.push({
            filename: "logo.png",
            path: logoPath,
            cid: "vmsolutionlogo",
          });
        }

        const formattedDate = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "full",
          timeStyle: "medium",
        });

        const replySubject = encodeURIComponent(`Re: ${submission.subject}`);

        const mailOptions = {
          from: `"VM Solutiions Inquiry" <${recipientEmail}>`,
          replyTo: `"${submission.name}" <${submission.email}>`,
          to: recipientEmail,
          subject: `🔔 [Website Inquiry] ${submission.subject} - ${submission.name}`,
          attachments,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>New Website Inquiry - VM Solutiions</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                      
                      <!-- Header Bar with Gradient & Logo -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0284c7 100%); padding: 28px 32px; text-align: center;">
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td align="center">
                                ${
                                  logoPath
                                    ? `<img src="cid:vmsolutionlogo" alt="VM Solutiions Logo" style="max-height: 52px; width: auto; height: auto; display: block; border: 0; margin-bottom: 12px;" />`
                                    : `<img src="https://vmsolutiions.com/logo.png" alt="VM Solutiions Logo" style="max-height: 52px; width: auto; height: auto; display: block; border: 0; margin-bottom: 12px;" />`
                                }
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; padding-top: 4px;">
                                New Website Inquiry
                              </td>
                            </tr>
                            <tr>
                              <td align="center" style="color: #93c5fd; font-size: 13px; font-weight: 500; padding-top: 4px;">
                                Received from VM Solutiions Contact Form
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Main Body Content -->
                      <tr>
                        <td style="padding: 32px 28px 24px 28px;">
                          
                          <!-- Quick Notification Banner -->
                          <div style="background-color: #f0f9ff; border-left: 4px solid #0284c7; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px;">
                            <span style="font-weight: 700; color: #0369a1; font-size: 14px;">Inquiry Notification</span>
                            <p style="margin: 4px 0 0 0; font-size: 13px; color: #0c4a6e;">You have received a new contact request from your website visitor.</p>
                          </div>

                          <!-- Contact Details Grid -->
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; padding: 16px 20px;">
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; width: 35%; font-size: 13px; font-weight: 600; color: #64748b;">
                                👤 Sender Name
                              </td>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 700; color: #0f172a;">
                                ${submission.name}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; color: #64748b;">
                                ✉️ Email Address
                              </td>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600;">
                                <a href="mailto:${submission.email}" style="color: #0284c7; text-decoration: none;">${submission.email}</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; color: #64748b;">
                                📞 Phone Number
                              </td>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px; font-weight: 600; color: #334155;">
                                ${
                                  submission.phone
                                    ? `<a href="tel:${submission.phone}" style="color: #0284c7; text-decoration: none;">${submission.phone}</a>`
                                    : `<span style="color: #94a3b8; font-style: italic;">Not provided</span>`
                                }
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 13px; font-weight: 600; color: #64748b;">
                                📌 Subject
                              </td>
                              <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9; font-size: 14px;">
                                <span style="background-color: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; display: inline-block;">
                                  ${submission.subject}
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 8px 0; font-size: 13px; font-weight: 600; color: #64748b;">
                                🕒 Date & Time
                              </td>
                              <td style="padding: 8px 0; font-size: 13px; color: #475569;">
                                ${formattedDate}
                              </td>
                            </tr>
                          </table>

                          <!-- Message Card -->
                          <div style="margin-bottom: 28px;">
                            <div style="font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px;">
                              💬 Message Content:
                            </div>
                            <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-left: 5px solid #0284c7; border-radius: 8px; padding: 18px 20px; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; font-family: inherit;">${submission.message}</div>
                          </div>

                          <!-- Reply Call to Action Button -->
                          <div style="text-align: center; margin: 30px 0 10px 0;">
                            <a href="mailto:${submission.email}?subject=${replySubject}" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #1e40af 100%); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 30px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);">
                              ✉️ Reply directly to ${submission.name}
                            </a>
                          </div>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 28px; text-align: center;">
                          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #64748b;">
                            VM Solutiions — IT Infrastructure & Software Solutions
                          </p>
                          <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                            This message was automatically delivered to <strong style="color: #475569;">${recipientEmail}</strong> via the VM Solutiions Website Contact API.
                          </p>
                        </td>
                      </tr>

                    </table>
                  </td>
                </tr>
              </table>
            </body>
            </html>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(
          `✉️ Email successfully sent to ${recipientEmail} for inquiry from ${submission.email}`,
        );
      } catch (mailErr) {
        console.error(
          "Background email notice failed (submission recorded in DB):",
          mailErr.message,
        );
      }
    })();
  } else {
    console.log(
      `Saved contact form submission for ${recipientEmail} into MongoDB (GMAIL_APP_PASSWORD not configured):`,
      submission,
    );
  }
};
