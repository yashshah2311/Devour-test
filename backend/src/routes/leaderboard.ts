import express from 'express';
import { CommunityModel } from '../models/Community';

const leaderboardRouter = express.Router();

/**
 * @route GET /leaderboard
 * @description Fetches the leaderboard of communities based on collective points
 */
leaderboardRouter.get("/", async (req, res) => {
    try {
        const communities = await CommunityModel.find().populate({
            path: 'members',
            populate: { path: 'experiencePoints' }
          }).exec();
      const leaderboard = await Promise.all(communities.map(async community => {
        const totalPoints = community.members?.reduce((sum, member) => {
          const user = member as any;
          return sum + (user.experiencePoints?.reduce((userSum: any, xp: any) => userSum + xp.points, 0) || 0);
        }, 0) || 0;
  
        return {
          logo: community.logo,
          name: community.name,
          totalPoints,
          userCount: community.members?.length || 0
        };
      }));
  
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
  
      res.json(leaderboard);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  export {leaderboardRouter} ;