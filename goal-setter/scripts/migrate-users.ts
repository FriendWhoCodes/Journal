/**
 * Migration script to link existing GoalSetterUsers to AuthUsers
 *
 * Run with: npx tsx scripts/migrate-users.ts
 *
 * This script:
 * 1. Finds all GoalSetterUsers without an authUserId
 * 2. Creates or finds corresponding AuthUser by email
 * 3. Links them together
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateUsers() {
  console.log('Starting user migration...\n');

  // Find all goal setter users without auth link
  const unlinkedUsers = await prisma.goalSetterUser.findMany({
    where: {
      authUserId: null,
    },
  });

  console.log(`Found ${unlinkedUsers.length} unlinked users\n`);

  let created = 0;
  let linked = 0;
  let errors = 0;

  for (const gsUser of unlinkedUsers) {
    try {
      // Check if auth user exists with this email
      let authUser = await (prisma as any).authUser.findUnique({
        where: { email: gsUser.email.toLowerCase() },
      });

      if (!authUser) {
        // Create new auth user
        authUser = await (prisma as any).authUser.create({
          data: {
            email: gsUser.email.toLowerCase(),
            name: gsUser.name,
            emailVerified: new Date(), // Consider verified since they already used the app
          },
        });
        created++;
        console.log(`Created AuthUser for: ${gsUser.email}`);
      }

      // Link goal setter user to auth user
      await prisma.goalSetterUser.update({
        where: { id: gsUser.id },
        data: { authUserId: authUser.id },
      });

      linked++;
      console.log(`Linked GoalSetterUser ${gsUser.id} to AuthUser ${authUser.id}`);
    } catch (error) {
      errors++;
      console.error(`Error processing user ${gsUser.email}:`, error);
    }
  }

  console.log('\n--- Migration Complete ---');
  console.log(`Created: ${created} new AuthUsers`);
  console.log(`Linked: ${linked} GoalSetterUsers`);
  console.log(`Errors: ${errors}`);
}

migrateUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
