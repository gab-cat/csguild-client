
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { GenericMutationCtx, AnyDataModel } from "convex/server";

import { ResendOTP } from "../ResendOTP";
import { ResendOTPPasswordReset } from "../ResendOTPPasswordReset";
import { Id, Doc } from "../_generated/dataModel";


// Helper function to parse name into first and last name
function parseGoogleName(fullName?: string): { firstName: string; lastName: string } {
  if (!fullName) return { firstName: "", lastName: "" };
  
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(' ') || "";
  
  return { firstName, lastName };
}

// Helper function to generate username from email
function generateUsername(email?: string): string {
  if (!email) return "";
  
  const emailPrefix = email.split('@')[0];
  // Remove dots and special characters, keep only alphanumeric
  return emailPrefix.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

// Helper function to safely merge user data without overwriting existing values
function safelyMergeUserData(
  existingUser: Doc<"users">, 
  newData: Partial<Doc<"users">>
): Partial<Doc<"users">> {
  const updateData: Partial<Doc<"users">> = {};
  
  for (const [key, newValue] of Object.entries(newData)) {
    const existingValue = existingUser[key as keyof Doc<"users">];
    
    // Only update if the existing value is null, undefined, or empty string
    // and the new value is not null, undefined, or empty string
    if (
      (existingValue === null || existingValue === undefined || existingValue === "") &&
      (newValue !== null && newValue !== undefined && newValue !== "")
    ) {
      (updateData as Record<string, unknown>)[key] = newValue;
    }
    // Special handling for arrays (like roles) - only update if existing array is empty
    else if (
      Array.isArray(existingValue) && 
      Array.isArray(newValue) && 
      existingValue.length === 0 && 
      newValue.length > 0
    ) {
      (updateData as Record<string, unknown>)[key] = newValue;
    }
    // Special case: always update updatedAt timestamp
    else if (key === 'updatedAt') {
      (updateData as Record<string, unknown>)[key] = newValue;
    }
    // Special case: always update emailVerified if Google OAuth (since Google emails are verified)
    else if (key === 'emailVerified' && newValue === true) {
      (updateData as Record<string, unknown>)[key] = newValue;
    }
    // Special case: always update provider info for OAuth
    else if (key === 'provider' || key === 'providerAccountId') {
      (updateData as Record<string, unknown>)[key] = newValue;
    }
  }
  
  return updateData;
}

// Configure Password provider to handle additional profile fields and password reset
const CustomPassword = Password({
  profile(params) {
    // Check if this is a signup flow - only include additional fields for signup
    const isSignUp = params.flow === 'signUp';

    const baseProfile = {
      email: params.email as string,
      password: params.password as string,
    };

    if (isSignUp) {
      return {
        ...baseProfile,
        firstName: (params.firstName as string) || '',
        lastName: (params.lastName as string) || '',
        username: (params.username as string) || '',
        birthdate: (params.birthdate as string) || '',
        course: (params.course as string) || '',
        rfidId: (params.rfidId as string) || '',
      };
    } else {
      // For signin, only return email and password
      return baseProfile;
    }
  },
  // Configure password reset using Resend
  reset: ResendOTPPasswordReset,
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    CustomPassword,
    ResendOTP,
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          // Additional fields for Convex Auth
          given_name: googleProfile.given_name,
          family_name: googleProfile.family_name,
          picture: googleProfile.picture,
          email_verified: googleProfile.email_verified,
          sub: googleProfile.sub,
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(
      ctx: GenericMutationCtx<AnyDataModel>,
      args: {
        existingUserId: Id<"users"> | null;
        type: "credentials" | "email" | "oauth" | "phone" | "verification";
        provider: unknown;
        profile: Record<string, unknown>;
        shouldLink?: boolean;
      }
    ) {
      const now = Date.now();

      if (args.type === "oauth") {
        // OAuth (Google) user creation/update
        const profile = args.profile as {
          email?: string;
          name?: string;
          given_name?: string;
          family_name?: string;
          picture?: string;
          image?: string;
          email_verified?: boolean;
          sub?: string;
        };

        // Parse names - use given_name/family_name if available, otherwise parse full name
        let firstName = profile.given_name || "";
        let lastName = profile.family_name || "";
        
        if (!firstName && !lastName && profile.name) {
          const parsed = parseGoogleName(profile.name);
          firstName = parsed.firstName;
          lastName = parsed.lastName;
        }

        // Don't auto-generate username for new Google users - let them choose in profile completion
        const username = generateUsername(profile.email);

        // Get profile image - try both 'image' and 'picture' fields
        const profileImage = profile.image || profile.picture || "";

        // For OAuth, always check if user exists by email first to prevent duplicates
        const existingUser = await ctx.db
          .query("users")
          // @ts-expect-error - by_email index is defined in the schema
          .withIndex("by_email", (q) => q.eq("email", profile.email || ""))
          .first();

        if (existingUser) {
          // Prepare new data from Google OAuth profile
          const newGoogleData: Partial<Doc<"users">> = {
            name: profile.name,
            username: username,
            firstName: firstName,
            lastName: lastName,
            image: profileImage,
            imageUrl: profileImage,
            emailVerified: true, // Google emails are always verified
            provider: "google",
            providerAccountId: profile.sub,
            signupMethod: "GOOGLE",
            updatedAt: now,
          };

          // Use safe merge to only update empty fields
          const updateData = safelyMergeUserData(existingUser, newGoogleData);
          
          // Only patch if there are actual changes to make
          if (Object.keys(updateData).length > 0) {
            await ctx.db.patch(existingUser._id, updateData);
          }
          
          return existingUser._id;
        }

        // Handle existing user passed by Convex Auth (should not create duplicate)
        if (args.existingUserId) {
          const user = await ctx.db.get(args.existingUserId);
          if (user) {
            // Prepare new data from Google OAuth profile
            const newGoogleData: Partial<Doc<"users">> = {
              name: profile.name,
              username: username,
              firstName: firstName,
              lastName: lastName,
              image: profileImage,
              imageUrl: profileImage,
              emailVerified: true,
              provider: "google",
              providerAccountId: profile.sub,
              updatedAt: now,
            };

            // Use safe merge to only update empty fields
            const updateData = safelyMergeUserData(user, newGoogleData);
            
            // Only patch if there are actual changes to make
            if (Object.keys(updateData).length > 0) {
              await ctx.db.patch(args.existingUserId, updateData);
            }
            
            return args.existingUserId;
          }
        }

        // Create new Google OAuth user (without username - to be set in profile completion)
        const newUserId = await ctx.db.insert("users", {
          email: profile.email || "",
          name: profile.name || "",
          username: username,
          firstName: firstName,
          lastName: lastName,
          // username: undefined, // Will be set during profile completion
          image: profileImage,
          imageUrl: profileImage,
          emailVerified: true, // Google emails are always verified
          provider: "google",
          providerAccountId: profile.sub || "",
          signupMethod: "GOOGLE",
          roles: ["USER"],
          createdAt: now,
          updatedAt: now,
        });
        return newUserId;
      } 
      
      if (args.type === "credentials" || args.type === "email") {
        // Email/password user creation - handle existing user case
        const profile = args.profile as {
          email?: string;
          password?: string;
          firstName?: string;
          lastName?: string;
          username?: string;
          birthdate?: string;
          course?: string;
          rfidId?: string;
        };

        // Check if this is a password reset attempt (no profile fields provided)
        // or a signin attempt (only email and password provided)
        const isPasswordResetOrSignin = !profile.firstName && !profile.lastName && !profile.username && !profile.birthdate && !profile.course && !profile.rfidId;

        if (isPasswordResetOrSignin) {
          // This is either a password reset attempt or a signin attempt
          if (profile.email) {
            const existingUser = await ctx.db
              .query("users")
              // @ts-expect-error - by_email index is defined in the schema
              .withIndex("by_email", (q) => q.eq("email", profile.email))
              .first();

            if (existingUser) {
              // User exists, allow signin
              return existingUser._id;
            } else {
              // User doesn't exist for signin - throw error
              throw new Error("User not found. Please sign up first.");
            }
          }

          // No email provided for signin - throw error
          throw new Error("Email is required for signin.");
        }

        // Debug logging to understand what data we're receiving
        console.log("🔍 Registration Debug - Profile data received:", {
          email: profile.email,
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          birthdate: profile.birthdate,
          course: profile.course,
          rfidId: profile.rfidId,
          passwordProvided: !!profile.password,
          isPasswordResetOrSignin,
          fullProfile: profile
        });

        // Check for existing user by email to prevent duplicates
        if (profile.email) {
          const existingUser = await ctx.db
            .query("users")
            // @ts-expect-error - by_email index is defined in the schema
            .withIndex("by_email", (q) => q.eq("email", profile.email))
            .first();
          
          if (existingUser) {
            throw new Error(`An account with email ${profile.email} already exists. Please sign in instead.`);
          }
        }

        // For signup, we should not have an existing user ID
        // If we do have one, it means something went wrong in the flow
        if (args.existingUserId) {
          console.log("🔍 Registration Debug - Unexpected existingUserId during signup:", args.existingUserId);
          // Don't return early - continue with new user creation
        }

        // Generate 6-digit numeric verification code for new users
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Convert birthdate string to timestamp if provided
        let birthdateTimestamp: number | undefined;
        if (profile.birthdate) {
          birthdateTimestamp = new Date(profile.birthdate).getTime();
        }
        
        const userRecord = {
          email: profile.email || "",
          name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
          firstName: profile.firstName,
          lastName: profile.lastName,
          username: profile.username,
          course: profile.course,
          birthdate: birthdateTimestamp,
          rfidId: profile.rfidId,
          emailVerified: false, // Email users need to verify
          emailVerificationCode: verificationCode,
          signupMethod: "EMAIL",
          provider: "password", // Set provider for Password auth
          roles: ["USER"],
          createdAt: now,
          updatedAt: now,
        };

        console.log("💾 Registration Debug - Data being saved to database:", userRecord);

        try {
          const userId = await ctx.db.insert("users", userRecord);
          console.log("✅ Registration Debug - User created successfully with ID:", userId);

          // Note: Email verification will be sent when user first tries to access protected features
          // or when they request a resend verification email

          return userId;
        } catch (error) {
          console.error("❌ Registration Debug - Failed to create user:", error);
          throw new Error("Failed to create user account. Please try again.");
        }
      }

      if (args.type === "verification") {
        // Handle both email verification and password reset verification
        const profile = args.profile as {
          email?: string;
          code?: string;
          newPassword?: string;
          flow?: string;
        };

        // Debug logging to understand verification flow
        console.log("🔍 Verification Debug - Type:", args.type);
        console.log("🔍 Verification Debug - Profile:", profile);
        console.log("🔍 Verification Debug - Provider:", args.provider);

        if (profile.email) {
          const existingUser = await ctx.db
            .query("users")
            // @ts-expect-error - by_email index is defined in the schema
            .withIndex("by_email", (q) => q.eq("email", profile.email))
            .first();

          if (existingUser) {
            console.log("🔍 Verification Debug - Found existing user:", existingUser._id);

            // Check if this is email verification from ResendOTP provider
            console.log("🔍 Verification Debug - Checking conditions:");
            console.log("🔍 Verification Debug - profile.newPassword:", profile.newPassword);
            console.log("🔍 Verification Debug - profile.flow:", profile.flow);
            console.log("🔍 Verification Debug - args.provider:", args.provider);

            if (!profile.newPassword && (profile.flow === "email-verification" || (args.provider && typeof args.provider === 'object' && 'id' in args.provider && args.provider.id === "resend-otp"))) {
              console.log("🔍 Verification Debug - Email verification flow detected");

              // Update emailVerified status for successful email verification
              await ctx.db.patch(existingUser._id, {
                emailVerified: true,
                emailVerificationCode: undefined, // Clear the code after successful verification
                updatedAt: Date.now(),
              });

              console.log("🔍 Verification Debug - Email verified successfully for user:", existingUser._id);
            } else {
              console.log("🔍 Verification Debug - Email verification conditions not met");
            }

            // For password reset verification, return the existing user
            // Convex Auth will handle password credential management automatically
            // This allows both password users to reset and Google users to add password login
            return existingUser._id;
          } else {
            console.log("🔍 Verification Debug - User not found for email:", profile.email);
            // For security, don't reveal if email exists during password reset verification
            // Return a dummy ID to prevent email enumeration
            return "dummy-user-id-for-password-reset-verification";
          }
        }

        console.log("🔍 Verification Debug - No email provided in profile");
        throw new Error("Email is required for verification");
      }

      throw new Error("Unsupported authentication type");
    },
  },
});
