
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { GenericMutationCtx, AnyDataModel } from "convex/server";

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

// Configure Password provider to handle additional profile fields
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
});

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    CustomPassword,
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

        // For signin attempts, don't create new users - let the auth system handle it
        if (!profile.firstName && !profile.lastName && !profile.course) {
          // This looks like a signin attempt - just return null and let auth handle it
          throw new Error("User not found. Please sign up first.");
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

        if (args.existingUserId) {
          const user = await ctx.db.get(args.existingUserId);
          if (user) {
            return args.existingUserId;
          }
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

        const userId = await ctx.db.insert("users", userRecord);
        
        // Note: Email verification will be sent when user first tries to access protected features
        // or when they request a resend verification email
        
        return userId;
      }

      throw new Error("Unsupported authentication type");
    },
  },
});
