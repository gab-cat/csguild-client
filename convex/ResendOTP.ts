import Resend from "@auth/core/providers/resend";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";
import { Resend as ResendAPI } from "resend";

// Base email template with CS Guild branding
const createBaseEmailHTML = (
  title: string,
  content: string,
  actionButton?: {
    text: string;
    url: string;
  }
): string => {
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

export const ResendOTP = Resend({
  id: "resend-otp",
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
    const dashboardUrl = `${baseUrl}/dashboard`;
    const projectsUrl = `${baseUrl}/projects`;

    const content = `
      <div class="subtitle">🚀 Welcome to CS Guild!</div>

      <div class="message">
        <p>Hi there,</p>

        <p>Thank you for joining CS Guild! We're excited to have you as part of our community of computer science students and developers.</p>

        <p>To complete your registration and start exploring projects, please verify your email address by entering the verification code below:</p>
      </div>

      <div class="code-box">
        <div class="code-text">${token}</div>
      </div>

      <div class="message">
        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="font-size: 14px; color: #10b981; margin: 0; font-weight: 500;">
            <strong>⏰ Time Sensitive:</strong> This code will expire in 10 minutes for your security.
          </p>
        </div>

        <p>What happens after verification?</p>
        <ul style="color: #e5e5e5; padding-left: 20px;">
          <li>Complete access to all platform features</li>
          <li>Browse and apply to exciting projects</li>
          <li>Connect with fellow CS students</li>
          <li>Start your journey in collaborative development!</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="${projectsUrl}" class="action-button" style="margin-right: 10px;">Explore Projects</a>
        <a href="${dashboardUrl}" class="secondary-button">Go to Dashboard</a>
      </div>

      <hr class="divider">

      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 14px; color: #9ca3af;">
          Having trouble verifying your email?<br>
          Contact us at <a href="mailto:contact@csguild.tech" style="color: #a855f7;">contact@csguild.tech</a> - we're here to help!
        </p>

        <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">
          If you didn't create an account with CS Guild, please ignore this email.<br>
          <strong>This email was sent to:</strong> ${email}
        </p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: "CS Guild <noreply@csguild.tech>",
      to: [email],
      subject: "🚀 Welcome to CS Guild - Verify Your Email",
      html: createBaseEmailHTML("Verify Your Email", content, {
        text: "Explore Projects",
        url: projectsUrl
      })
    });

    if (error) {
      throw new Error("Could not send verification email");
    }
  },
});