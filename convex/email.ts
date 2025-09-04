"use node";

import { v } from "convex/values";
import formData from "form-data";
import Mailgun from "mailgun.js";

import { internalAction } from "./_generated/server";

// Email template types
export interface EmailTemplate {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

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

    .footer-text {
      color: #9ca3af;
      font-size: 14px;
      line-height: 1.5;
    }

    .footer-link {
      color: #a855f7;
      text-decoration: none;
      font-weight: 500;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    .social-links {
      margin: 20px 0;
    }

    .social-links a {
      color: #a855f7;
      text-decoration: none;
      margin: 0 10px;
      font-weight: 500;
    }

    .social-links a:hover {
      text-decoration: underline;
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

      .code-text {
        font-size: 24px;
        letter-spacing: 2px;
      }

      .action-button {
        padding: 14px 28px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <span class="logo-accent">&lt;/&gt;</span> CS <span class="logo-accent">Guild</span>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <h1 class="title">${title}</h1>
      ${content}
      ${actionButton ? `
        <div style="text-align: center;">
          <a href="${actionButton.url}" class="action-button">${actionButton.text}</a>
        </div>
      ` : ''}
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <p><strong>CS Guild</strong> - Computer Studies Guild for United Innovation, Learning and Development</p>
        <div class="social-links">
          <a href="${baseUrl}">Visit Our Platform</a> |
          <a href="mailto:contact@csguild.tech">Contact Us</a>
        </div>
        <p style="margin-top: 15px; font-size: 12px; color: #6b7280;">
          This email was sent to you because you are a member of our community.<br>
          If you have any questions, please don't hesitate to reach out to us.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
};

// Initialize Mailgun client
const getMailgunClient = () => {
  const mailgun = new Mailgun(formData);
  return mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
};

// Email verification template
export const createEmailVerificationTemplate = (
  email: string,
  verificationCode: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
): EmailTemplate => {
  const verificationUrl = `${baseUrl}/verify-email?code=${verificationCode}`;
  const dashboardUrl = `${baseUrl}/dashboard`;
  const projectsUrl = `${baseUrl}/projects`;

  const content = `
    <div class="subtitle">🎉 Welcome to CS Guild! Let's Get You Started!</div>

    <div class="message">
      <p>Thank you for joining <strong>CS Guild</strong>! We're thrilled to have you as part of our community of Computer Science students passionate about building and learning together.</p>

      <p>Your account has been created successfully! To complete your setup and unlock full access to our platform, please verify your email address.</p>
    </div>

    <div class="code-box">
      <p style="margin: 0 0 15px 0; font-size: 14px; color: #a855f7;">Your verification code:</p>
      <div class="code-text">${verificationCode}</div>
    </div>

    <div class="message">
      <p>What happens after verification?</p>
      <ul style="color: #e5e5e5; padding-left: 20px;">
        <li>Complete access to all platform features</li>
        <li>Browse and apply to exciting projects</li>
        <li>Connect with fellow CS students</li>
        <li>Start your journey in collaborative development!</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${verificationUrl}" class="action-button" style="margin-right: 10px;">Verify My Email</a>
      <a href="${dashboardUrl}" class="secondary-button">Go to Dashboard</a>
    </div>

    <div class="message">
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="font-size: 14px; color: #ef4444; margin: 0; font-weight: 500;">
          <strong>⏰ Time Sensitive:</strong> This verification code will expire in 24 hours for your security.
        </p>
      </div>

      <p style="font-size: 14px; color: #9ca3af; margin-bottom: 10px;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>

      <p style="font-size: 14px; color: #9ca3af;">
        <a href="${verificationUrl}" style="color: #a855f7; word-break: break-all; text-decoration: underline;">${verificationUrl}</a>
      </p>
    </div>

    <hr class="divider">

    <div style="text-align: center; margin-top: 30px;">
      <p style="font-size: 14px; color: #9ca3af;">
        Questions about getting started?<br>
        Reach out to us at <a href="mailto:contact@csguild.tech" style="color: #a855f7;">contact@csguild.tech</a> or explore our <a href="${projectsUrl}" style="color: #a855f7;">projects</a> while you wait.
      </p>

      <p style="font-size: 12px; color: #6b7280; margin-top: 15px;">
        If you didn't create an account with CS Guild, please ignore this email.<br>
        Your email address (${email}) will remain secure.
      </p>
    </div>
  `;

  return {
    to: email,
    subject: "🚀 Welcome to CS Guild - Verify Your Email",
    text: `
Welcome to CS Guild!

Thank you for joining our community! Your account has been created successfully.

Your verification code: ${verificationCode}

Or click this link to verify automatically:
${verificationUrl}

What happens after verification?
- Complete access to all platform features
- Browse and apply to exciting projects
- Connect with fellow CS students
- Start your journey in collaborative development!

This code will expire in 24 hours.

Questions? Contact us at contact@csguild.tech

If you didn't create an account with CS Guild, please ignore this email.

Best regards,
The CS Guild Team
    `.trim(),
    html: createBaseEmailHTML("Welcome to CS Guild!", content, {
      text: "Verify My Email",
      url: verificationUrl
    })
  };
};

// Password reset template
export const createPasswordResetTemplate = (
  email: string,
  resetToken: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
): EmailTemplate => {
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;
  const loginUrl = `${baseUrl}/login`;

  const content = `
    <div class="subtitle">🔐 Secure Password Reset - We're Here to Help!</div>

    <div class="message">
      <p>Hi there!</p>

      <p>We received a request to reset your password for your <strong>CS Guild</strong> account. Don't worry, we've got you covered with our secure password reset process!</p>

      <p>You can either click the button below to go directly to the password reset page, or use the verification code below to reset your password manually.</p>

      <p>For your security, this password reset link will expire in <strong>15 minutes</strong>. Please reset your password as soon as possible to regain access to your account.</p>
    </div>

    <div class="message">
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
      <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="font-size: 14px; color: #ef4444; margin: 0; font-weight: 500;">
          <strong>⏰ Time Sensitive:</strong> This link will expire in 15 minutes for your security.
        </p>
      </div>

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

  return {
    to: email,
    subject: "🔐 Reset Your CS Guild Password",
    text: `
Password Reset Request - CS Guild

Hi there!

We received a request to reset your password for your CS Guild account. Don't worry, we've got you covered!

You can either click the button below to go directly to the password reset page, or use the verification code to reset your password manually:

${resetUrl}

What happens after you reset your password?
- Immediate access to your account
- Continue working on your projects
- Access all your saved applications
- Pick up right where you left off!

IMPORTANT: This link will expire in 15 minutes for security reasons.

Need help? Contact us at contact@csguild.tech

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The CS Guild Team
    `.trim(),
    html: createBaseEmailHTML("Reset Your Password", content, {
      text: "Reset My Password",
      url: resetUrl
    })
  };
};

// Application acceptance template
export const createApplicationAcceptanceTemplate = (
  email: string,
  applicantName: string,
  projectTitle: string,
  roleName: string,
  reviewerName: string,
  reviewMessage?: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
): EmailTemplate => {
  const projectUrl = `${baseUrl}/projects`;
  const dashboardUrl = `${baseUrl}/dashboard`;

  const content = `
    <div class="subtitle">🎉 Congratulations! You've Been Accepted!</div>

    <div class="message">
      <p>Hi <strong>${applicantName}</strong>,</p>

      <p>Great news! Your application for the project <strong>"${projectTitle}"</strong> has been <span style="color: #10b981; font-weight: 600;">ACCEPTED</span>! 🎊</p>

      <p>You've been approved to join as a <strong>${roleName}</strong>. Welcome to the team!</p>
    </div>

    ${reviewMessage ? `
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="font-size: 16px; color: #10b981; margin: 0; font-weight: 500;">
        <strong>💬 Message from ${reviewerName}:</strong>
      </p>
      <p style="margin: 10px 0 0 0; color: #e5e5e5; font-style: italic;">"${reviewMessage}"</p>
    </div>
    ` : ''}

    <div class="message">
      <p>What happens next?</p>
      <ul style="color: #e5e5e5; padding-left: 20px;">
        <li>You are now an active member of the project team</li>
        <li>You can access the project dashboard and start collaborating</li>
        <li>Connect with your team members and project owner</li>
        <li>Begin contributing to the project's success!</li>
      </ul>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${projectUrl}" class="action-button" style="margin-right: 10px;">View Project</a>
      <a href="${dashboardUrl}" class="secondary-button">Go to Dashboard</a>
    </div>

    <hr class="divider">

    <div style="text-align: center; margin-top: 30px;">
      <p style="font-size: 14px; color: #9ca3af;">
        Questions about your acceptance or next steps?<br>
        Reach out to the project owner or contact us at <a href="mailto:contact@csguild.tech" style="color: #a855f7;">contact@csguild.tech</a>
      </p>
    </div>
  `;

  return {
    to: email,
    subject: `🎉 Congratulations! You've Been Accepted to "${projectTitle}"`,
    text: `
Congratulations ${applicantName}!

Great news! Your application for the project "${projectTitle}" has been ACCEPTED!

You've been approved to join as a ${roleName}. Welcome to the team!

${reviewMessage ? `Message from ${reviewerName}: "${reviewMessage}"` : ''}

What happens next?
- You are now an active member of the project team
- You can access the project dashboard and start collaborating
- Connect with your team members and project owner
- Begin contributing to the project's success!

View your project: ${projectUrl}
Go to dashboard: ${dashboardUrl}

Questions? Contact us at contact@csguild.tech

Best regards,
The CS Guild Team
    `.trim(),
    html: createBaseEmailHTML("Application Accepted!", content, {
      text: "View Project",
      url: projectUrl
    })
  };
};

// Application rejection template
export const createApplicationRejectionTemplate = (
  email: string,
  applicantName: string,
  projectTitle: string,
  roleName: string,
  reviewerName: string,
  reviewMessage?: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
): EmailTemplate => {
  const projectsUrl = `${baseUrl}/projects`;
  const profileUrl = `${baseUrl}/profile`;

  const content = `
    <div class="subtitle">Application Update</div>

    <div class="message">
      <p>Hi <strong>${applicantName}</strong>,</p>

      <p>Thank you for your interest in the project <strong>"${projectTitle}"</strong> and for applying to be a <strong>${roleName}</strong>.</p>

      <p>After careful consideration, we regret to inform you that your application has not been selected at this time.</p>
    </div>

    ${reviewMessage ? `
    <div style="background: rgba(168, 85, 247, 0.1); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
      <p style="font-size: 16px; color: #a855f7; margin: 0; font-weight: 500;">
        <strong>💬 Feedback from ${reviewerName}:</strong>
      </p>
      <p style="margin: 10px 0 0 0; color: #e5e5e5; font-style: italic;">"${reviewMessage}"</p>
    </div>
    ` : ''}

    <div class="message">
      <p>Don't be discouraged! Here are some suggestions for next steps:</p>
      <ul style="color: #e5e5e5; padding-left: 20px;">
        <li>Review your application and consider what you could improve</li>
        <li>Look for other projects that match your skills and interests</li>
        <li>Continue building your portfolio and gaining experience</li>
        <li>Consider reaching out to the project owner for specific feedback</li>
      </ul>

      <p>CS Guild has many exciting projects and opportunities. Keep exploring and applying!</p>
    </div>

    <div style="text-align: center; margin: 40px 0;">
      <a href="${projectsUrl}" class="action-button" style="margin-right: 10px;">Explore More Projects</a>
      <a href="${profileUrl}" class="secondary-button">Update My Profile</a>
    </div>

    <hr class="divider">

    <div style="text-align: center; margin-top: 30px;">
      <p style="font-size: 14px; color: #9ca3af;">
        Want to improve your chances next time?<br>
        Contact us at <a href="mailto:contact@csguild.tech" style="color: #a855f7;">contact@csguild.tech</a> for guidance and tips.
      </p>
    </div>
  `;

  return {
    to: email,
    subject: `Application Update for "${projectTitle}"`,
    text: `
Hi ${applicantName},

Thank you for your interest in the project "${projectTitle}" and for applying to be a ${roleName}.

After careful consideration, we regret to inform you that your application has not been selected at this time.

${reviewMessage ? `Feedback from ${reviewerName}: "${reviewMessage}"` : ''}

Don't be discouraged! CS Guild has many exciting projects and opportunities. Keep exploring and applying!

Explore more projects: ${projectsUrl}
Update your profile: ${profileUrl}

Questions? Contact us at contact@csguild.tech

Best regards,
The CS Guild Team
    `.trim(),
    html: createBaseEmailHTML("Application Update", content, {
      text: "Explore More Projects",
      url: projectsUrl
    })
  };
};

// Send email verification
export const sendEmailVerification = internalAction({
  args: {
    email: v.string(),
    verificationCode: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const mg = getMailgunClient();
      const domain = process.env.MAILGUN_DOMAIN!;
      
      const template = createEmailVerificationTemplate(args.email, args.verificationCode);
      
      const result = await mg.messages.create(domain, {
        from: `CS Guild <no-reply@${domain}>`,
        to: template.to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
      
      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Failed to send email verification:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Send password reset email
export const sendPasswordReset = internalAction({
  args: {
    email: v.string(),
    resetToken: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const mg = getMailgunClient();
      const domain = process.env.MAILGUN_DOMAIN!;
      
      const template = createPasswordResetTemplate(args.email, args.resetToken);
      
      const result = await mg.messages.create(domain, {
        from: `CS Guild <no-reply@${domain}>`,
        to: template.to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });
      
      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Send application acceptance email
export const sendApplicationAcceptance = internalAction({
  args: {
    email: v.string(),
    applicantName: v.string(),
    projectTitle: v.string(),
    roleName: v.string(),
    reviewerName: v.string(),
    reviewMessage: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const mg = getMailgunClient();
      const domain = process.env.MAILGUN_DOMAIN!;

      const template = createApplicationAcceptanceTemplate(
        args.email,
        args.applicantName,
        args.projectTitle,
        args.roleName,
        args.reviewerName,
        args.reviewMessage
      );

      const result = await mg.messages.create(domain, {
        from: `CS Guild <no-reply@${domain}>`,
        to: template.to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Failed to send application acceptance email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Send application rejection email
export const sendApplicationRejection = internalAction({
  args: {
    email: v.string(),
    applicantName: v.string(),
    projectTitle: v.string(),
    roleName: v.string(),
    reviewerName: v.string(),
    reviewMessage: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const mg = getMailgunClient();
      const domain = process.env.MAILGUN_DOMAIN!;

      const template = createApplicationRejectionTemplate(
        args.email,
        args.applicantName,
        args.projectTitle,
        args.roleName,
        args.reviewerName,
        args.reviewMessage
      );

      const result = await mg.messages.create(domain, {
        from: `CS Guild <no-reply@${domain}>`,
        to: template.to,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Failed to send application rejection email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Generic email sender for future use
export const sendEmail = internalAction({
  args: {
    to: v.string(),
    subject: v.string(),
    text: v.string(),
    html: v.optional(v.string()),
    from: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const mg = getMailgunClient();
      const domain = process.env.MAILGUN_DOMAIN!;
      
      const result = await mg.messages.create(domain, {
        from: args.from || `CS Guild <no-reply@${domain}>`,
        to: args.to,
        subject: args.subject,
        text: args.text,
        html: args.html,
      });
      
      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Failed to send email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});

// Send event feedback invitation email with public link
export const sendEventFeedbackInvite = internalAction({
  args: {
    to: v.string(),
    eventTitle: v.string(),
    eventSlug: v.string(),
    token: v.string(),
    userId: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    messageId: v.optional(v.string()),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    try {
      const mg = getMailgunClient();
      const domain = process.env.MAILGUN_DOMAIN!;
      const baseUrl = process.env.SITE_URL || "http://localhost:3000";

      const feedbackUrl = `${baseUrl}/events/${encodeURIComponent(args.eventSlug)}/feedback/public?token=${encodeURIComponent(args.token)}&userId=${encodeURIComponent(args.userId)}`;

      const html = createBaseEmailHTML(
        "We'd love your feedback",
        `
        <div class="subtitle">Help us improve future events</div>
        <div class="message">
          <p>Thanks for attending <strong>${args.eventTitle}</strong>! We'd love to hear your thoughts.</p>
          <p>Please take a minute to complete our short feedback form.</p>
        </div>
        <div class="message" style="font-size: 14px; color: #9ca3af;">
          If the button doesn't work, copy and paste this link:<br/>
          <a href="${feedbackUrl}" style="color: #a855f7; word-break: break-all;">${feedbackUrl}</a>
        </div>
        `,
        { text: "Give Feedback", url: feedbackUrl }
      );

      const result = await mg.messages.create(domain, {
        from: `CS Guild <no-reply@${domain}>`,
        to: args.to,
        subject: `Share feedback for ${args.eventTitle}`,
        text: `We'd love your feedback for ${args.eventTitle}. Visit: ${feedbackUrl}`,
        html,
      });

      return { success: true, messageId: result.id };
    } catch (error) {
      console.error("Failed to send event feedback invite:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
