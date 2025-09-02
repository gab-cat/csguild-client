import { mutation } from "./_generated/server";

/**
 * Migration to initialize common project roles for the CS Guild platform
 * This creates predefined roles that can be used across all projects
 */
export const initializeProjectRoles = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting project roles initialization...");

    const now = Date.now();

    // Define comprehensive project roles
    const projectRoles = [
      // Core Leadership Roles
      {
        name: "Project Lead",
        slug: "project-lead",
        description: "Overall project leader responsible for vision, direction, and final decisions"
      },
      {
        name: "Technical Lead",
        slug: "technical-lead",
        description: "Senior technical role overseeing architecture and technical decisions"
      },
      {
        name: "Project Manager",
        slug: "project-manager",
        description: "Manages project timeline, resources, and coordinates team activities"
      },

      // Development Roles
      {
        name: "Frontend Developer",
        slug: "frontend-developer",
        description: "Specializes in user interface and frontend technologies"
      },
      {
        name: "Backend Developer",
        slug: "backend-developer",
        description: "Handles server-side logic, databases, and API development"
      },
      {
        name: "Full Stack Developer",
        slug: "full-stack-developer",
        description: "Works on both frontend and backend components"
      },
      {
        name: "Mobile Developer",
        slug: "mobile-developer",
        description: "Develops mobile applications for iOS and/or Android"
      },
      {
        name: "DevOps Engineer",
        slug: "devops-engineer",
        description: "Manages deployment, infrastructure, and CI/CD pipelines"
      },

      // Design & UX Roles
      {
        name: "UI/UX Designer",
        slug: "ui-ux-designer",
        description: "Creates user interfaces and ensures optimal user experience"
      },
      {
        name: "Graphic Designer",
        slug: "graphic-designer",
        description: "Handles visual design, branding, and graphics"
      },
      {
        name: "Product Designer",
        slug: "product-designer",
        description: "Focuses on product design and user-centered design principles"
      },

      // Specialized Technical Roles
      {
        name: "Data Scientist",
        slug: "data-scientist",
        description: "Analyzes data, builds models, and derives insights"
      },
      {
        name: "Machine Learning Engineer",
        slug: "ml-engineer",
        description: "Implements and deploys machine learning models"
      },
      {
        name: "Security Engineer",
        slug: "security-engineer",
        description: "Ensures application security and implements security measures"
      },
      {
        name: "Database Administrator",
        slug: "database-admin",
        description: "Manages database design, optimization, and maintenance"
      },
      {
        name: "QA Engineer",
        slug: "qa-engineer",
        description: "Tests software, writes test cases, and ensures quality"
      },
      {
        name: "Quality Assurance",
        slug: "quality-assurance",
        description: "Ensures product quality through testing and validation"
      },

      // Business & Analysis Roles
      {
        name: "Business Analyst",
        slug: "business-analyst",
        description: "Analyzes business requirements and translates them to technical specifications"
      },
      {
        name: "Product Manager",
        slug: "product-manager",
        description: "Defines product vision, prioritizes features, and manages roadmap"
      },
      {
        name: "Marketing Specialist",
        slug: "marketing-specialist",
        description: "Handles marketing, promotion, and community engagement"
      },

      // Support & Documentation Roles
      {
        name: "Technical Writer",
        slug: "technical-writer",
        description: "Creates documentation, guides, and technical content"
      },
      {
        name: "Community Manager",
        slug: "community-manager",
        description: "Manages community engagement and user support"
      },
      {
        name: "Mentor",
        slug: "mentor",
        description: "Provides guidance and mentorship to team members"
      },
      {
        name: "Researcher",
        slug: "researcher",
        description: "Conducts research, explores new technologies, and provides insights"
      },
      {
        name: "Intern",
        slug: "intern",
        description: "Entry-level position for learning and contributing to projects"
      },

      // Additional Specialized Roles
      {
        name: "Blockchain Developer",
        slug: "blockchain-developer",
        description: "Develops blockchain-based applications and smart contracts"
      },
      {
        name: "Game Developer",
        slug: "game-developer",
        description: "Creates video games and interactive experiences"
      },
      {
        name: "AI Engineer",
        slug: "ai-engineer",
        description: "Works on artificial intelligence and cognitive computing solutions"
      },
      {
        name: "Cloud Architect",
        slug: "cloud-architect",
        description: "Designs and manages cloud infrastructure and architecture"
      },
      {
        name: "Systems Analyst",
        slug: "systems-analyst",
        description: "Analyzes and improves system processes and workflows"
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    // Create each role, checking for duplicates
    for (const roleData of projectRoles) {
      try {
        // Check if role already exists
        const existingRole = await ctx.db
          .query("userRoles")
          .withIndex("by_slug", (q) => q.eq("slug", roleData.slug))
          .first();

        if (existingRole) {
          console.log(`Role '${roleData.name}' already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create the role
        await ctx.db.insert("userRoles", {
          name: roleData.name,
          slug: roleData.slug,
          description: roleData.description,
          createdAt: now,
          updatedAt: now,
        });

        console.log(`Created role: ${roleData.name}`);
        createdCount++;

      } catch (error) {
        console.error(`Failed to create role '${roleData.name}':`, error);
      }
    }

    console.log(`Project roles initialization completed:`);
    console.log(`- Created: ${createdCount} roles`);
    console.log(`- Skipped: ${skippedCount} roles (already existed)`);

    return {
      success: true,
      message: `Project roles initialization completed. Created: ${createdCount}, Skipped: ${skippedCount}`,
      created: createdCount,
      skipped: skippedCount,
      total: projectRoles.length
    };
  },
});

/**
 * Helper mutation to list all available project roles
 */
export const listProjectRoles = mutation({
  args: {},
  handler: async (ctx) => {
    const roles = await ctx.db.query("userRoles").collect();

    return {
      success: true,
      roles: roles.map((role) => ({
        id: role._id,
        name: role.name,
        slug: role.slug,
        description: role.description,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt,
      })),
      count: roles.length
    };
  },
});

/**
 * Helper mutation to delete all project roles (for testing/reset purposes)
 */
export const clearProjectRoles = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing all project roles...");

    const roles = await ctx.db.query("userRoles").collect();
    let deletedCount = 0;

    for (const role of roles) {
      await ctx.db.delete(role._id);
      deletedCount++;
    }

    console.log(`Deleted ${deletedCount} project roles`);

    return {
      success: true,
      message: `Cleared ${deletedCount} project roles`,
      deleted: deletedCount
    };
  },
});
