import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a notification email. Never throws — failures are logged
 * so they don't break the calling action (approve/reject).
 *
 * @param {Object} opts
 * @param {string} opts.to     - Recipient email
 * @param {string} opts.subject - Email subject
 * @param {string} opts.html   - HTML body
 */
export async function sendNotificationEmail({ to, subject, html }) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set — skipping email to", to);
      return;
    }
    await resend.emails.send({
      from: "RecruitX <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("Email send failed:", err.message || err);
    // Intentionally swallowed — email failure must never break the action
  }
}

/**
 * Sends an approval email to a student.
 */
export async function sendApprovalEmail({ studentEmail, studentName, departmentName, societyName }) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #111;">Congratulations! 🎉</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>You applied in the <strong>${departmentName}</strong> department and you have been selected.</p>
      <p>Welcome to <strong>${societyName}</strong>!</p>
      <br/>
      <p style="color: #666; font-size: 13px;">— The RecruitX Team</p>
    </div>
  `;
  await sendNotificationEmail({
    to: studentEmail,
    subject: `You've been selected — ${societyName}`,
    html,
  });
}

/**
 * Sends a rejection email to a student.
 */
export async function sendRejectionEmail({ studentEmail, studentName, departmentName, societyName }) {
  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #111;">Application Update</h2>
      <p>Hello <strong>${studentName}</strong>,</p>
      <p>Thank you for your interest in the <strong>${departmentName}</strong> department at <strong>${societyName}</strong>.</p>
      <p>After careful review, we regret to inform you that your application was not selected at this time.</p>
      <p>We encourage you to keep exploring other opportunities on RecruitX. Wishing you the very best!</p>
      <br/>
      <p style="color: #666; font-size: 13px;">— The RecruitX Team</p>
    </div>
  `;
  await sendNotificationEmail({
    to: studentEmail,
    subject: `Application update — ${societyName}`,
    html,
  });
}
