import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { Resend as ResendAPI } from "resend";

// Base email template with CS Guild branding
const createBaseEmailHTML = (title: string, content: string): string => {
  const baseUrl = process.env.SITE_URL || "https://csguild.tech";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark light">
  <title>${title} - CS Guild</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #ffffff;
      background: linear-gradient(135deg, #000000 0%, #0f0f0f 100%);
      min-height: 100vh;
    }

    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: #0a0a0a;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
      border: 1px solid #1a1a1a;
    }

    .header {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #a855f7 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.3;
    }

    .logo {
      font-family: 'Space Mono', monospace;
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
      letter-spacing: -0.5px;
      position: relative;
      z-index: 1;
    }

    .logo-accent {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .content {
      padding: 40px 30px;
      background: linear-gradient(180deg, #0a0a0a 0%, #000000 100%);
    }

    .title {
      font-size: 28px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 20px;
      text-align: center;
      line-height: 1.2;
    }

    .subtitle {
      font-size: 18px;
      font-weight: 500;
      color: #a855f7;
      margin-bottom: 30px;
      text-align: center;
    }

    .message {
      color: #e5e5e5;
      font-size: 16px;
      line-height: 1.7;
      margin-bottom: 30px;
    }

    .action-button {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      transition: all 0.3s ease;
      box-shadow: 0 8px 16px rgba(236, 72, 153, 0.3);
      margin: 30px 0;
    }

    .action-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(236, 72, 153, 0.4);
    }

    .secondary-button {
      display: inline-block;
      padding: 12px 24px;
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7 !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 500;
      font-size: 14px;
      text-align: center;
      border: 1px solid rgba(168, 85, 247, 0.3);
      transition: all 0.3s ease;
      margin: 20px 0;
    }

    .secondary-button:hover {
      background: rgba(168, 85, 247, 0.2);
      border-color: rgba(168, 85, 247, 0.5);
    }

    .code-box {
      background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
      border: 2px solid #a855f7;
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
      text-align: center;
      box-shadow: 0 4px 8px rgba(168, 85, 247, 0.1);
    }

    .code-text {
      font-family: 'Space Mono', monospace;
      font-size: 28px;
      font-weight: 700;
      color: #a855f7;
      letter-spacing: 3px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }

    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #374151 50%, transparent 100%);
      margin: 32px 0;
      border: none;
    }

    .footer {
      background: #050505;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #1a1a1a;
    }

    .footer-content {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.5;
    }

    .footer-links {
      margin: 20px 0;
    }

    .footer-links a {
      color: #a855f7;
      text-decoration: none;
      margin: 0 15px;
      font-weight: 500;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #ec4899;
    }

    .social-links {
      margin-top: 20px;
    }

    .social-links a {
      display: inline-block;
      margin: 0 8px;
      color: #6b7280;
      text-decoration: none;
      font-size: 18px;
      transition: color 0.3s ease;
    }

    .social-links a:hover {
      color: #a855f7;
    }

    @media (max-width: 600px) {
      .email-container {
        margin: 10px;
        border-radius: 12px;
      }

      .header {
        padding: 30px 20px;
      }

      .content {
        padding: 30px 20px;
      }

      .title {
        font-size: 24px;
      }

      .action-button {
        padding: 14px 28px;
        font-size: 15px;
      }

      .code-text {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">
        <span class="logo-accent">CS</span> Guild
      </div>
    </div>

    <div class="content">
      ${content}
    </div>

    <div class="footer">
      <div class="footer-content">
        <p>
          <strong>CS Guild</strong> - Connecting Computer Science Students with Real-World Projects
        </p>

        <div class="footer-links">
          <a href="${baseUrl}">Website</a>
          <a href="${baseUrl}/projects">Projects</a>
          <a href="${baseUrl}/about">About</a>
          <a href="mailto:contact@csguild.tech">Contact</a>
        </div>

        <p style="font-size: 12px; color: #6b7280; margin-top: 20px;">
          This email was sent to you because you have an account with CS Guild.<br>
          If you believe this was sent in error, please ignore this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

export const ResendOTPPasswordReset = Resend({
  id: "resend-otp-password-reset",
  apiKey: process.env.AUTH_RESEND_KEY!,
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes) {
        crypto.getRandomValues(bytes);
      },
    };

    const alphabet = "0123456789";
    const length = 8;
    return generateRandomString(random, alphabet, length);
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const baseUrl = process.env.SITE_URL || "https://csguild.tech";
    const loginUrl = `${baseUrl}/login`;
    const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`;

    const content = `
      <div class="subtitle">🔐 Secure Password Reset</div>

      <div class="message">
        <p>Hi there,</p>

        <p>We received a request to reset your password for your CS Guild account. Don't worry, we've got you covered!</p>

        <p>You can either click the button below to go directly to the password reset page, or use the verification code below to reset your password manually:</p>
      </div>

      <div class="code-box">
        <div class="code-text">${token}</div>
      </div>

      <div class="message">
        <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 14px; color: #ef4444; margin: 0; font-weight: 500;">
            <strong>⏰ Time Sensitive:</strong> This code will expire in 10 minutes for your security.
          </p>
        </div>

        <p>What happens after you reset your password?</p>
        <ul style="color: #e5e5e5; padding-left: 20px;">
          <li>Immediate access to your account</li>
          <li>Continue working on your projects</li>
          <li>Access all your saved applications</li>
          <li>Pick up right where you left off!</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${resetUrl}" class="action-button" style="margin-right: 10px;">Reset My Password</a>
        <a href="${loginUrl}" class="secondary-button">Go to Login</a>
      </div>

      <div class="message">
        <p style="font-size: 14px; color: #9ca3af; margin-bottom: 10px;">
          If the button doesn't work, copy and paste this link into your browser:
        </p>

        <p style="font-size: 14px; color: #9ca3af;">
          <a href="${resetUrl}" style="color: #a855f7; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
        </p>
      </div>

      <hr class="divider">

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 14px; color: #9ca3af;">
          Need help or have questions?<br>
          Contact us at <a href="mailto:contact@csguild.tech" style="color: #a855f7;">contact@csguild.tech</a> - we're here to help you get back into your account.
        </p>

        <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">
          If you didn't request a password reset, please ignore this email.<br>
          Your password will remain unchanged and your account is secure.<br>
          <strong>This email was sent to:</strong> ${email}
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "CS Guild <noreply@csguild.tech>",
      to: [email],
      subject: "🔐 Reset Your CS Guild Password",
      html: createBaseEmailHTML("Reset Your Password", content)
    });

    if (error) {
      // For security, don't throw errors for password reset emails
      // This prevents email enumeration attacks
      console.warn("Password reset email failed to send (this may be expected for non-existent users):", error);
      // Don't throw - let the flow continue with a success response
    }
  },
});
