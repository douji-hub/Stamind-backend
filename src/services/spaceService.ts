import { ObjectId } from 'mongoose';
import SpaceModel from '../models/space';
import BlockModel from '../models/block';
import User from '../models/user';

// Service to create a new space
export const createSpace = async (userID: ObjectId) => {
    const space = await SpaceModel.create({ blocks: [] });

    // Add the space ID to the user's `spaces` list
    await User.findByIdAndUpdate(userID, { $push: { spaces: space._id } });

    return space;
};

// Service to get all spaces for a user
export const getAllSpaces = async (userId: ObjectId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    // Fetch all spaces for the user
    return SpaceModel.find({ _id: { $in: user.spaces } }).populate('blocks');
};

// Service to get a specific space by its ID
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

// Service to delete a specific space by its ID
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
