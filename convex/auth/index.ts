
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { GenericMutationCtx, AnyDataModel } from "convex/server";

import { Id } from "../_generated/dataModel";

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

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password,
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
          // Update existing user with latest OAuth info
          await ctx.db.patch(existingUser._id, {
            name: profile.name || existingUser.name,
            username: username || existingUser.username,
            firstName: firstName || existingUser.firstName,
            lastName: lastName || existingUser.lastName,
            // Don't overwrite username for existing users
            image: profileImage || existingUser.image,
            imageUrl: profileImage || existingUser.imageUrl, // Also update imageUrl field
            emailVerified: true, // Google emails are always verified
            provider: "oauth",
            providerAccountId: profile.sub || existingUser.providerAccountId,
            signupMethod: existingUser.signupMethod || "GOOGLE",
            updatedAt: now,
          });
          return existingUser._id;
        }

        // Handle existing user passed by Convex Auth (should not create duplicate)
        if (args.existingUserId) {
          const user = await ctx.db.get(args.existingUserId);
          if (user) {
            await ctx.db.patch(args.existingUserId, {
              name: profile.name || user.name,
              username: username || user.username,
              firstName: firstName || user.firstName,
              lastName: lastName || user.lastName,
              // Don't overwrite username for existing users
              image: profileImage || user.image,
              imageUrl: profileImage || user.imageUrl,
              emailVerified: true,
              provider: "oauth",
              providerAccountId: profile.sub || user.providerAccountId,
              updatedAt: now,
            });
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
          provider: "oauth",
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
        };

        if (args.existingUserId) {
          const user = await ctx.db.get(args.existingUserId);
          if (user) {
            return args.existingUserId;
          }
        }

        return await ctx.db.insert("users", {
          email: profile.email || "",
          emailVerified: false, // Email users need to verify
          signupMethod: "EMAIL",
          roles: ["USER"],
          createdAt: now,
          updatedAt: now,
        });
      }

      throw new Error("Unsupported authentication type");
    },
  },
});
