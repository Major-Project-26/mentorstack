/*
  Warnings:

  - You are about to drop the column `userId` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the column `userRole` on the `Answer` table. All the data in the column will be lost.
  - You are about to drop the `AnswerVote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Bookmark` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionVote` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mentorId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AnswerVote" DROP CONSTRAINT "AnswerVote_answerId_fkey";

-- DropForeignKey
ALTER TABLE "Bookmark" DROP CONSTRAINT "Bookmark_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionVote" DROP CONSTRAINT "QuestionVote_questionId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "userId",
DROP COLUMN "userRole",
ADD COLUMN     "mentorId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "AnswerVote";

-- DropTable
DROP TABLE "Bookmark";

-- DropTable
DROP TABLE "QuestionVote";

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
