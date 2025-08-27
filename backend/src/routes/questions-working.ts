import express from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Get all questions
router.get('/', async (req: any, res: any) => {
  try {
    const questions = await prisma.question.findMany({
      include: {
        mentee: {
          select: {
            name: true
          }
        },
        answers: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedQuestions = questions.map((question: any) => ({
      id: question.id,
      title: question.title,
      description: question.body,
      tags: [], // Simplified for now
      createdAt: question.createdAt,
      authorName: question.mentee.name,
      answerCount: question.answers.length,
      voteScore: 0 // We'll implement voting later
    }));

    res.json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get question by ID
router.get('/:id', async (req: any, res: any) => {
  try {
    const questionId = parseInt(req.params.id);
    
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        mentee: {
          select: {
            name: true
          }
        },
        answers: true
      }
    });

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Get author names for answers
    const mentorIds = question.answers.filter((a: any) => a.userRole === 'mentor').map((a: any) => a.userId);
    const menteeIds = question.answers.filter((a: any) => a.userRole === 'mentee').map((a: any) => a.userId);

    const mentors = mentorIds.length > 0 ? await prisma.mentor.findMany({
      where: { id: { in: mentorIds } },
      select: { id: true, name: true }
    }) : [];

    const mentees = menteeIds.length > 0 ? await prisma.mentee.findMany({
      where: { id: { in: menteeIds } },
      select: { id: true, name: true }
    }) : [];

    const mentorLookup = new Map(mentors.map((m: any) => [m.id, m.name]));
    const menteeLookup = new Map(mentees.map((m: any) => [m.id, m.name]));

    const formattedQuestion = {
      id: question.id,
      title: question.title,
      description: question.body,
      tags: [], // Simplified for now
      createdAt: question.createdAt,
      authorName: question.mentee.name,
      voteScore: 0, // We'll implement voting later
      answers: question.answers.map((answer: any) => {
        let authorName = 'Unknown';
        if (answer.userRole === 'mentor') {
          authorName = mentorLookup.get(answer.userId) || 'Unknown';
        } else if (answer.userRole === 'mentee') {
          authorName = menteeLookup.get(answer.userId) || 'Unknown';
        }

        return {
          id: answer.id,
          content: answer.body,
          createdAt: answer.createdAt,
          authorName: authorName,
          voteScore: 0
        };
      })
    };

    res.json(formattedQuestion);
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create answer for a question
router.post('/:questionId/answers', authenticateToken, async (req: any, res: any) => {
  try {
    const questionId = parseInt(req.params.questionId);
    const { content } = req.body;
    const { id: userId, role } = req.user;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Answer content is required' });
    }

    if (content.trim().length < 20) {
      return res.status(400).json({ error: 'Answer must be at least 20 characters long' });
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Create the answer using raw SQL for now to bypass Prisma type issues
    const result = await prisma.$executeRaw`
      INSERT INTO "Answer" (body, "questionId", "userId", "userRole", "createdAt", "updatedAt")
      VALUES (${content.trim()}, ${questionId}, ${userId}, ${role}::"Role", NOW(), NOW())
      RETURNING id
    `;

    console.log('Answer created via raw SQL:', result);

    // Get author name based on role
    let authorName = 'Unknown';
    if (role === 'mentor') {
      const mentor = await prisma.mentor.findUnique({
        where: { id: userId },
        select: { name: true }
      });
      authorName = mentor?.name || 'Unknown';
    } else if (role === 'mentee') {
      const mentee = await prisma.mentee.findUnique({
        where: { id: userId },
        select: { name: true }
      });
      authorName = mentee?.name || 'Unknown';
    }

    const responseAnswer = {
      id: 'created', // We'll get the real ID from a follow-up query if needed
      content: content.trim(),
      authorName: authorName,
      createdAt: new Date(),
      voteScore: 0
    };

    res.status(201).json({ 
      message: 'Answer created successfully',
      answer: responseAnswer
    });
  } catch (error: any) {
    console.error('Error creating answer:', error);
    res.status(500).json({ error: 'Failed to create answer', details: error.message });
  }
});

export { router as questionsRouter };
