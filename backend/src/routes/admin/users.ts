import express from 'express';
import { prisma } from '../../../lib/prisma';
import { Role } from '@prisma/client';
import { requireAdmin } from '../../middleware/adminAuth';

const router = express.Router();

// Apply admin authentication to all routes
router.use(requireAdmin);

// Get all users with pagination and search
router.get('/', async (req: any, res: any) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      role = '', 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

  const skip = (Number.parseInt(page) - 1) * Number.parseInt(limit);
  const take = Number.parseInt(limit);

    // Build where clause
    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { jobTitle: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role && role !== 'all') {
      whereClause.role = role;
    }

    // Get users with counts
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          reputation: true,
          avatarUrl: true,
          jobTitle: true,
          department: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              questions: true,
              answers: true,
              articles: true,
              mentorConnections: true,
              menteeConnections: true,
              communityPosts: true,
              communityMemberships: true
            }
          }
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    // Calculate additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [recentQuestions, recentArticles, badges] = await Promise.all([
          prisma.question.count({
            where: {
              authorId: user.id,
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          }),
          prisma.article.count({
            where: {
              authorId: user.id,
              createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            }
          }),
          prisma.userBadge.count({ where: { userId: user.id } })
        ]);
        return {
          ...user,
          stats: {
            ...user._count,
            recentQuestions,
            recentArticles,
            badges,
            totalActivity: user._count.questions + user._count.answers + user._count.articles + user._count.communityPosts
          }
        };
      })
    );

    res.json({
      users: usersWithStats,
      pagination: {
        page: Number.parseInt(page),
        limit: Number.parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / Number.parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
  where: { id: Number.parseInt(id) },
      include: {
        questions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            _count: { select: { answers: true } }
          }
        },
        articles: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            createdAt: true,
            upvotes: true,
            downvotes: true
          }
        },
        mentorConnections: {
          take: 5,
          select: {
            id: true,
            mentee: { select: { id: true, name: true, email: true } },
            acceptedAt: true
          }
        },
        menteeConnections: {
          take: 5,
          select: {
            id: true,
            mentor: { select: { id: true, name: true, email: true } },
            acceptedAt: true
          }
        },
        userBadges: {
          include: {
            badge: true
          }
        },
        _count: {
          select: {
            questions: true,
            answers: true,
            articles: true,
            mentorConnections: true,
            menteeConnections: true,
            communityPosts: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user role
router.patch('/:id/role', async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await prisma.user.update({
  where: { id: Number.parseInt(id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Suspend/Unsuspend user - omitted (no suspension fields in schema)

// Delete user (soft delete)
router.delete('/:id', async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(id) },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting other admins
  if (user.role === Role.admin && req.user.userId !== Number.parseInt(id)) {
      return res.status(403).json({ error: 'Cannot delete other admin users' });
    }

    // Soft delete by updating email and marking as deleted
    // Soft delete pattern: scramble email & name (fields that exist in schema)
    await prisma.user.update({
      where: { id: Number.parseInt(id) },
      data: {
        email: `deleted_${Date.now()}_${user.email}`,
        name: `[Deleted] ${user.name}`
      }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get user statistics
router.get('/stats/overview', async (req: any, res: any) => {
  try {
    const [totalUsers, mentors, mentees, admins, newUsersThisMonth, newUsersLastMonth] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: Role.mentor } }),
      prisma.user.count({ where: { role: Role.mentee } }),
      prisma.user.count({ where: { role: Role.admin } }),
      prisma.user.count({
        where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ]);
    // Active = users with any recent question/answer/article in last 30 days
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          { questions: { some: { createdAt: { gte: new Date(Date.now() - 30*24*60*60*1000) } } } },
          { answers: { some: { createdAt: { gte: new Date(Date.now() - 30*24*60*60*1000) } } } },
          { articles: { some: { createdAt: { gte: new Date(Date.now() - 30*24*60*60*1000) } } } }
        ]
      }
    });
    const growthRate = newUsersLastMonth > 0 ? ((newUsersThisMonth - newUsersLastMonth)/newUsersLastMonth*100) : 0;
    res.json({
      totalUsers,
      activeUsers,
      mentors,
      mentees,
      admins,
      newUsersThisMonth,
      newUsersLastMonth,
      growthRate: Math.round(growthRate*100)/100,
      activityRate: totalUsers > 0 ? Math.round((activeUsers/totalUsers)*100*100)/100 : 0
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

export default router;
