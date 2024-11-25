import { ObjectId } from 'mongoose';
import SpaceModel from '../models/space';
import BlockModel from '../models/block';
import User from '../models/user';

/**
 * @desc Create a new space
 * @param userID - The ID of the user creating the space
 * @returns The created space
 */
export const createSpace = async (userID: ObjectId) => {
    const space = await SpaceModel.create({ blocks: [] });

    // Add the space ID to the user's `spaces` list
    await User.findByIdAndUpdate(userID, { $push: { spaces: space._id } });

    return space;
};

/**
 * @desc Get all spaces for a user
 * @param userId - The ID of the user
 * @returns An array of spaces belonging to the user
 */
export const getAllSpaces = async (userId: ObjectId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Fetch all spaces for the user
    return SpaceModel.find({ _id: { $in: user.spaces } }).populate('blocks');
};

/**
 * @desc Get a specific space by its ID
 * @param userId - The ID of the user
 * @param spaceId - The ID of the space to retrieve
 * @returns The requested space along with its associated blocks
 */
export const getSpaceById = async (userId: ObjectId, spaceId: string) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const spaceObjectId = user.spaces.find((id) => id.toString() === spaceId);
    if (!spaceObjectId) {
        throw new Error('Space not found or unauthorized');
    }

    return SpaceModel.findById(spaceObjectId).populate('blocks');
};

/**
 * @desc Delete a specific space by its ID
 * @param userId - The ID of the user requesting deletion
 * @param spaceId - The ID of the space to delete
 * @returns void
 */
export const deleteSpace = async (userId: ObjectId, spaceId: string): Promise<void> => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const spaceObjectId = user.spaces.find((id) => id.toString() === spaceId);
    if (!spaceObjectId) {
        throw new Error('Space not found or unauthorized');
    }

    // Remove the space from the user's list
    await User.findByIdAndUpdate(userId, { $pull: { spaces: spaceObjectId } });

    // Delete all blocks associated with the space
    await BlockModel.deleteMany({ spaceId: spaceObjectId });

    // Delete the space itself
    await SpaceModel.findByIdAndDelete(spaceObjectId);
};
