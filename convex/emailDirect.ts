"use node";

import { v } from "convex/values";
import formData from "form-data";
import Mailgun from "mailgun.js";

import { action } from "./_generated/server";

// Initialize Mailgun client
const getMailgunClient = () => {
  const mailgun = new Mailgun(formData);
  return mailgun.client({
    username: "api",
    key: process.env.MAILGUN_API_KEY!,
  });
};

// Email verification template
const createEmailVerificationTemplate = (
  email: string,
  verificationCode: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
) => {
  const verificationUrl = `${baseUrl}/verify-email?code=${verificationCode}`;
  
  return {
    subject: "Verify Your Email Address - CS Guild",
    text: `Welcome to CS Guild! Please verify your email address by entering the code: ${verificationCode} or visit: ${verificationUrl}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Verify Your Email - CS Guild</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #667eea;">Welcome to CS Guild!</h1>
  <p>Please verify your email address by entering this code:</p>
  <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0;">
    <h2 style="color: #667eea; font-family: monospace; letter-spacing: 3px;">${verificationCode}</h2>
  </div>
  <p>Or <a href="${verificationUrl}" style="color: #667eea;">click here to verify automatically</a></p>
  <p><small>This code expires in 24 hours.</small></p>
</body>
</html>
    `
  };
};

// Password reset template
const createPasswordResetTemplate = (
  email: string,
  resetToken: string,
  baseUrl: string = process.env.SITE_URL || "http://localhost:3000"
) => {
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
  
  return {
    subject: "Reset Your Password - CS Guild",
    text: `Reset your CS Guild password by visiting: ${resetUrl} (expires in 15 minutes)`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password - CS Guild</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #f093fb;">Password Reset</h1>
  <p>Click the button below to reset your password:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
  </div>
  <p><small>This link expires in 15 minutes for security.</small></p>
  <p><small>If you didn't request this, ignore this email.</small></p>
</body>
</html>
    `
  };
};

// Direct email verification action
export const sendEmailVerificationDirect = action({
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
        to: args.email,
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

// Direct password reset action
export const sendPasswordResetDirect = action({
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
        to: args.email,
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