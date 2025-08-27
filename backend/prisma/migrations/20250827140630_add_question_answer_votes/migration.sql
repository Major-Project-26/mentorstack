-- CreateTable
CREATE TABLE "public"."QuestionVote" (
    "id" SERIAL NOT NULL,
    "userRole" "public"."Role" NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "voteType" "public"."VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnswerVote" (
    "id" SERIAL NOT NULL,
    "userRole" "public"."Role" NOT NULL,
    "userId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,
    "voteType" "public"."VoteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnswerVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionVote_userId_questionId_userRole_key" ON "public"."QuestionVote"("userId", "questionId", "userRole");

-- CreateIndex
CREATE UNIQUE INDEX "AnswerVote_userId_answerId_userRole_key" ON "public"."AnswerVote"("userId", "answerId", "userRole");

-- AddForeignKey
ALTER TABLE "public"."QuestionVote" ADD CONSTRAINT "QuestionVote_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AnswerVote" ADD CONSTRAINT "AnswerVote_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "public"."Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
