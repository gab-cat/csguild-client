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
  
  return {
    to: email,
    subject: "Verify Your Email Address - CS Guild",
    text: `
Welcome to CS Guild!

Please verify your email address by entering the following code:

Verification Code: ${verificationCode}

Or click this link to verify automatically:
${verificationUrl}

This code will expire in 24 hours.

If you didn't create an account with CS Guild, please ignore this email.

Best regards,
The CS Guild Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - CS Guild</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to CS Guild!</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
    <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
    
    <p>Thank you for joining CS Guild! Please verify your email address to complete your account setup.</p>
    
    <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 14px; color: #666;">Your verification code:</p>
      <h3 style="margin: 10px 0; font-size: 32px; letter-spacing: 5px; color: #667eea; font-family: monospace;">${verificationCode}</h3>
    </div>
    
    <p>Or click the button below to verify automatically:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
    </div>
    
    <p style="font-size: 14px; color: #666;">
      <strong>Note:</strong> This verification code will expire in 24 hours.
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999;">
      If you didn't create an account with CS Guild, please ignore this email.<br>
      This email was sent to ${email}.
    </p>
  </div>
</body>
</html>
    `.trim()
  };
};

// Password reset template
export const createPasswordResetTemplate = (
  email: string,
  resetToken: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
): EmailTemplate => {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  
  return {
    to: email,
    subject: "Reset Your Password - CS Guild",
    text: `
Password Reset Request

We received a request to reset your password for your CS Guild account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 15 minutes for security reasons.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Best regards,
The CS Guild Team
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - CS Guild</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
    <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
    
    <p>We received a request to reset your password for your CS Guild account.</p>
    
    <p>Click the button below to reset your password:</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    
    <p style="font-size: 14px; color: #666;">
      <strong>Important:</strong> This link will expire in 15 minutes for security reasons.
    </p>
    
    <p style="font-size: 14px; color: #666;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
    </p>
    
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999;">
      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.<br>
      This email was sent to ${email}.
    </p>
  </div>
</body>
</html>
    `.trim()
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
