import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export const sendVerificationEmail = async (appName: string, targetEmail: string, code: string) => {
  const mailOptions = {
    from: `${appName.toString()} <${process.env.SMTP_USER}>`,
    to: targetEmail,
    subject: "Verify your email",
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      </div>
    `
  }

  return await transporter.sendMail(mailOptions)
}
