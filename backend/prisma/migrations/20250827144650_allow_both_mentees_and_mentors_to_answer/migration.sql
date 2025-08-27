/*
  Warnings:

  - You are about to drop the column `mentorId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Answer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userRole` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns with temporary default values
ALTER TABLE "public"."Answer" 
ADD COLUMN "userId" INTEGER DEFAULT 0 NOT NULL,
ADD COLUMN "userRole" "public"."Role" DEFAULT 'mentor' NOT NULL;

-- Step 2: Copy mentorId to userId and set userRole to 'mentor' for existing records
UPDATE "public"."Answer" SET "userId" = "mentorId", "userRole" = 'mentor' WHERE "mentorId" IS NOT NULL;

-- Step 3: Remove default values (make columns properly required)
ALTER TABLE "public"."Answer" ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE "public"."Answer" ALTER COLUMN "userRole" DROP DEFAULT;

-- Step 4: Drop the foreign key constraint and mentorId column
ALTER TABLE "public"."Answer" DROP CONSTRAINT "Answer_mentorId_fkey";
ALTER TABLE "public"."Answer" DROP COLUMN "mentorId";
