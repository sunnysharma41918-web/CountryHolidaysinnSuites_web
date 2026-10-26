import nodemailer from 'nodemailer'
import { config } from '../config/env.js'

let transporter = null

const getTransporter = () => {
  if (!transporter && config.smtp.host && config.smtp.user) {
    transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.port === 465,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    })
  }
  return transporter
}

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const mailTransporter = getTransporter()

  const subject = 'Password Reset Request - Country Holidays Inn & Suites Admin'
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0d1829; margin-bottom: 4px;">Country Holidays Inn & Suites</h2>
        <p style="color: #ff5938; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; font-size: 12px; margin: 0;">Property Management Portal</p>
      </div>
      <p style="color: #334155; font-size: 15px;">Hello <strong>${name}</strong>,</p>
      <p style="color: #334155; font-size: 15px; line-height: 1.6;">
        We received a request to reset your password for your administrative account. Please click the button below to choose a new password. This link is valid for <strong>1 hour</strong>.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #0d1829; color: #ffffff; padding: 12px 28px; border-radius: 9999px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
          Reset My Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
        Or copy and paste this link in your browser:<br />
        <a href="${resetUrl}" style="color: #ff5938; word-break: break-all;">${resetUrl}</a>
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
      <p style="color: #94a3b8; font-size: 12px; margin: 0;">
        If you did not request this password reset, please ignore this email or notify your system administrator immediately.
      </p>
    </div>
  `

  if (mailTransporter) {
    try {
      await mailTransporter.sendMail({
        from: config.smtp.from,
        to,
        subject,
        html,
      })
      console.log(`✉️ [EmailService] Password reset email sent to ${to}`)
      return { success: true, mode: 'smtp' }
    } catch (error) {
      console.error(`⚠️ [EmailService] Failed to send email via SMTP: ${error.message}`)
    }
  }

  // Development / fallback logger: Always print secure reset URL to console so local admin testing never breaks
  console.log('\n=============================================================')
  console.log('🔑 [LOCAL / DEV PASSWORD RESET LINK]')
  console.log(`   Recipient: ${to} (${name})`)
  console.log(`   Reset URL: ${resetUrl}`)
  console.log('=============================================================\n')

  return { success: true, mode: 'console', resetUrl }
}
