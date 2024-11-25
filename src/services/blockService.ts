import crypto from 'crypto';
import mongoose from 'mongoose';
import BlockModel, { IBlock } from '../models/block';
import SpaceModel from '../models/space';
import User from '../models/user';

/**
 * @desc Create a new block under a space
 * @param spaceId - The ID of the space to add the block to
 * @param blockData - The data for the new block
 * @returns The created block
 */
export const createBlock = async (
    spaceId: string,
    blockData: Partial<IBlock>
): Promise<IBlock> => {
    // Confirm that the space exists
    const space = await SpaceModel.findById(spaceId);
    if (!space) {
        throw new Error('Space not found');
    }

    // Create a new Block
    const block = await BlockModel.create({
        ...blockData,
        spaceId,
    });

    // Add Block ID to the Space's blocks list
    space.blocks.push(block._id as mongoose.Types.ObjectId);
    await space.save();

    return block;
};

/**
 * @desc Get block details by block ID
 * @param blockId - The ID of the block
 * @returns The block details
 */
export const getBlockById = async (blockId: string): Promise<IBlock> => {
    const block = await BlockModel.findById(blockId);
    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

/**
 * @desc Update a block's content or properties
 * @param blockId - The ID of the block to update
 * @param updates - The updates to apply
 * @returns The updated block
 */
export const updateBlock = async (
    blockId: string,
    updates: Partial<IBlock>
): Promise<IBlock> => {
    const block = await BlockModel.findByIdAndUpdate(
        blockId,
        { ...updates, updatedAt: new Date() },
        { new: true }
    );
    if (!block) {
        throw new Error('Block not found');
    }
    return block;
};

/**
 * @desc Delete a block
 * @param blockId - The ID of the block to delete
 * @returns void
 */
export const deleteBlock = async (blockId: string): Promise<void> => {
    const block = await BlockModel.findById(blockId);
    if (!block) {
        throw new Error('Block not found');
    }

    // Remove the block ID from its associated space's blocks array
    await SpaceModel.findByIdAndUpdate(block.spaceId, { $pull: { blocks: block._id } });

    // Remove the block ID from the coBlocks array of each coworker
    const coworkerIds = block.coworkers;

    // Iterate over each coworker and remove the block ID from their coBlocks array
    await Promise.all(coworkerIds.map(async (userId) => {
        await User.findByIdAndUpdate(userId, { $pull: { coBlocks: block._id } });
    }));

    // Delete the block
    await BlockModel.findByIdAndDelete(blockId);
};


/**
 * @desc Generate a PIN code to share a block
 * @param blockId - The ID of the block to share
 * @returns The updated block with coWorkId
 */
export const generateBlockPin = async (blockId: string): Promise<IBlock> => {
    const block = await BlockModel.findById(blockId);
    if (!block) {
        throw new Error('Block not found');
    }

    // Generate a 6-digit PIN code
    const pinCode = crypto.randomInt(100000, 999999).toString();

    block.isCoWork = true;
    block.coWorkId = pinCode;
    await block.save();

    return block;
};

/**
 * @desc Join a shared block using a PIN code
 * @param userId - The ID of the user joining the block
 * @param pinCode - The PIN code of the block
 * @returns The block details
 */
export const joinSharedBlock = async (
    userId: mongoose.Types.ObjectId,
    pinCode: string
): Promise<IBlock> => {
    const block = await BlockModel.findOne({ coWorkId: pinCode, isCoWork: true });
    if (!block) {
        throw new Error('Invalid PIN code or block is not shared');
    }

    // Add the user to the block's coworkers
    if (!block.coworkers.includes(userId)) {
        block.coworkers.push(userId);
        await block.save();
    }

    // Add the block to the user's coBlocks list
    const user = await User.findById(userId);
    if (user && !user.coBlocks.includes(block._id as mongoose.Types.ObjectId)) {
        user.coBlocks.push(block._id as mongoose.Types.ObjectId);
        await user.save();
    }

    return block;
};
