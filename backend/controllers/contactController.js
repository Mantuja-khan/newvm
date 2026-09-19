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
          from: `"VM Solutiions" <${recipientEmail}>`,
          replyTo: `"${submission.name}" <${submission.email}>`,
          to: recipientEmail,
          subject: `[Inquiry] ${submission.subject} — ${submission.name}`,
          attachments,
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Website Inquiry - ${submission.name}</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #0f172a;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 36px 16px;">
                <tr>
                  <td align="center">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                      
                      <!-- Header -->
                      <tr>
                        <td style="padding: 20px 28px; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                              <td style="vertical-align: middle;">
                                <div style="font-size: 17px; font-weight: 700; color: #0f172a; letter-spacing: -0.2px;">VM Solutiions</div>
                                <div style="font-size: 11px; color: #64748b; margin-top: 1px;">IT Infrastructure & Software Solutions</div>
                              </td>
                              <td align="right" style="vertical-align: middle;">
                                <span style="display: inline-block; font-size: 11px; font-weight: 600; color: #0369a1; background-color: #f0f9ff; border: 1px solid #e0f2fe; padding: 3px 9px; border-radius: 4px;">
                                  Website Inquiry
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Main Body Content -->
                      <tr>
                        <td style="padding: 28px 28px 24px 28px;">
                          
                          <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 6px; line-height: 1.3;">
                            ${submission.subject}
                          </div>
                          <div style="font-size: 13px; color: #64748b; margin-bottom: 22px;">
                            Received via website contact form on ${formattedDate}
                          </div>

                          <!-- Contact Details Grid -->
                          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden;">
                            <tr style="background-color: #f8fafc;">
                              <td style="padding: 9px 14px; font-size: 13px; font-weight: 600; color: #475569; width: 28%; border-bottom: 1px solid #e2e8f0;">
                                Name
                              </td>
                              <td style="padding: 9px 14px; font-size: 13px; font-weight: 600; color: #0f172a; border-bottom: 1px solid #e2e8f0;">
                                ${submission.name}
                              </td>
                            </tr>
                            <tr>
                              <td style="padding: 9px 14px; font-size: 13px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0;">
                                Email
                              </td>
                              <td style="padding: 9px 14px; font-size: 13px; color: #0284c7; border-bottom: 1px solid #e2e8f0;">
                                <a href="mailto:${submission.email}" style="color: #0284c7; text-decoration: none;">${submission.email}</a>
                              </td>
                            </tr>
                            <tr style="background-color: #f8fafc;">
                              <td style="padding: 9px 14px; font-size: 13px; font-weight: 600; color: #475569;">
                                Phone
                              </td>
                              <td style="padding: 9px 14px; font-size: 13px; color: #0f172a;">
                                ${
                                  submission.phone
                                    ? `<a href="tel:${submission.phone}" style="color: #0f172a; text-decoration: none;">${submission.phone}</a>`
                                    : `<span style="color: #94a3b8;">Not provided</span>`
                                }
                              </td>
                            </tr>
                          </table>

                          <!-- Message Card -->
                          <div style="margin-bottom: 24px;">
                            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px;">
                              Message
                            </div>
                            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-left: 3px solid #0f172a; border-radius: 4px; padding: 14px 16px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap;">${submission.message}</div>
                          </div>

                          <!-- Reply Action Button -->
                          <div style="margin-top: 24px;">
                            <a href="mailto:${submission.email}?subject=${replySubject}" style="display: inline-block; background-color: #0f172a; color: #ffffff; font-size: 13px; font-weight: 600; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
                              Reply to ${submission.name}
                            </a>
                          </div>

                        </td>
                      </tr>

                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 28px; font-size: 11px; color: #64748b; line-height: 1.5;">
                          This notification was automatically sent to <span style="color: #334155; font-weight: 600;">${recipientEmail}</span> from the VM Solutiions website contact system.
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
