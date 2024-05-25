import express from "express";
import { UserModel } from "../models/User";
import { CommunityModel } from "../models/Community";
import mongoose from 'mongoose';


const userRouter = express.Router();
const { Types } = mongoose;
/**
 * @route GET /user/:id
 * @param {string} id - User ID
 * @returns {User} - User object with experiencePoints field
 */
userRouter.get("/:id", async (req, res) => {
	const user = await UserModel.findById(req.params.id).select('+experiencePoints');
	if (!user) {
		return res.status(404).send({ message: "User not found" });
	}
	res.send(user);
});

/**
 * @route GET /user
 * @returns {Array} - Array of User objects
 * @note Adds the virtual field of totalExperience to the user.
 * @hint You might want to use a similar aggregate in your leaderboard code.
 */
userRouter.get("/", async (_, res) => {
	const users = await UserModel.aggregate([
		{
			$unwind: "$experiencePoints"
		},
		{
			$group: {
				_id: "$_id",
				email: { $first: "$email" },
				profilePicture: { $first: "$profilePicture" },
				totalExperience: { $sum: "$experiencePoints.points" }
			}
		}
	]);
	res.send(users);
});

/**
 * @route POST /user/:userId/join/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description Joins a community
 */
userRouter.post("/:userId/join/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;
	try {
		const user = await UserModel.findById(userId).exec();
		const community = await CommunityModel.findById(communityId).exec();

		if (!user || !community) {
			return res.status(404).json({ message: 'User or Community not found' });
		}

		if (user.community) {
			return res.status(400).json({ message: 'User is already a member of another community' });
		}

		user.community = community.id;
		await user.save();

		community.members = community.members ? [...community.members, user._id] : [user._id];
		await community.save();

		res.status(200).json({ message: 'Joined community successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

/**
 * @route DELETE /user/:userId/leave/:communityId
 * @param {string} userId - User ID
 * @param {string} communityId - Community ID
 * @description leaves a community
 */
userRouter.delete("/:userId/leave/:communityId", async (req, res) => {
	const { userId, communityId } = req.params;
	try {
		// const userObjectId = new Types.ObjectId(userId);
		// const communityObjectId = new Types.ObjectId(communityId);

		const user = await UserModel.findById(userId).exec();
		const community = await CommunityModel.findById(communityId).exec();

		if (!user || !community) {
			return res.status(404).json({ message: 'User or Community not found' });
		}

		if (!user.community || user.community.toString() !== communityId) {
			return res.status(400).json({ message: 'User is not a member of this community' });
		}

		user.community = undefined;
		await user.save();

		community.members = community.members?.filter(memberId => memberId.toString() !== userId);
		await community.save();

		res.status(200).json({ message: 'Left community successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Internal server error' });
	}
});

export {
	userRouter
}
