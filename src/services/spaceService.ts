import mongoose from 'mongoose';
import { ObjectId } from 'mongoose';
import SpaceModel from '../models/space';
import BlockModel from '../models/block';
import User from '../models/user';
/**
 * @desc Create a new space
 * @param spaceID Unique identifier for the space
 * @returns The created space
 */
export const createSpace = async (userID: ObjectId) => {
    const space = await SpaceModel.create({
        blocks: [],
    });

    // Add Space ID to user's `spaces`
    await User.findByIdAndUpdate(userID, { $push: { spaces: space._id } });

    return space;
};


/**
 * @desc Get all spaces owned by a user
 * @param userId - The ID of the user
 * @returns An array of spaces with their details
 */
export const getSpaceDetails = async (userId: ObjectId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const spaces = await SpaceModel.find({ _id: { $in: user.spaces } }).populate('blocks');

    return spaces;
};

/**
 * @desc Delete a space by its ID and associated blocks
 * @param userId - The ID of the user requesting deletion
 * @param spaceId - The ID of the space to delete
 * @throws Will throw an error if the space is not found or the user does not own it
 */
export const deleteSpace = async (userId: ObjectId, spaceId: string): Promise<void> => {
    // find user
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // ensure user has this space
    const spaceObjectId = user.spaces.find((id) => id.toString() === spaceId);
    console.log(spaceObjectId)
    if (!spaceObjectId) {
        throw new Error('Space not found or unauthorized');
    }

    // remove space from user
    await User.findByIdAndUpdate(userId, { $pull: { spaces: spaceObjectId } });

    // delete related blocks with this space
    await BlockModel.deleteMany({ spaceId: spaceObjectId });
    await SpaceModel.findByIdAndDelete(spaceObjectId);
};
