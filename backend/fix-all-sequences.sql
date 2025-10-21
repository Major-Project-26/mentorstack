-- Reset all table ID sequences to fix unique constraint errors
SELECT setval(pg_get_serial_sequence('"User"', 'id'), COALESCE(MAX(id), 1)) FROM "User";
SELECT setval(pg_get_serial_sequence('"Question"', 'id'), COALESCE(MAX(id), 1)) FROM "Question";
SELECT setval(pg_get_serial_sequence('"Answer"', 'id'), COALESCE(MAX(id), 1)) FROM "Answer";
SELECT setval(pg_get_serial_sequence('"Article"', 'id'), COALESCE(MAX(id), 1)) FROM "Article";
SELECT setval(pg_get_serial_sequence('"Community"', 'id'), COALESCE(MAX(id), 1)) FROM "Community";
SELECT setval(pg_get_serial_sequence('"Tag"', 'id'), COALESCE(MAX(id), 1)) FROM "Tag";
SELECT setval(pg_get_serial_sequence('"QuestionTag"', 'id'), COALESCE(MAX(id), 1)) FROM "QuestionTag";
SELECT setval(pg_get_serial_sequence('"ArticleTag"', 'id'), COALESCE(MAX(id), 1)) FROM "ArticleTag";
SELECT setval(pg_get_serial_sequence('"CommunityPost"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityPost";
SELECT setval(pg_get_serial_sequence('"CommunityPostTag"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityPostTag";
SELECT setval(pg_get_serial_sequence('"CommunityMember"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityMember";
SELECT setval(pg_get_serial_sequence('"ArticleVote"', 'id'), COALESCE(MAX(id), 1)) FROM "ArticleVote";
SELECT setval(pg_get_serial_sequence('"AnswerVote"', 'id'), COALESCE(MAX(id), 1)) FROM "AnswerVote";
SELECT setval(pg_get_serial_sequence('"CommunityPostVote"', 'id'), COALESCE(MAX(id), 1)) FROM "CommunityPostVote";
