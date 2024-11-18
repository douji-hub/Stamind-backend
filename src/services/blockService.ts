import crypto from 'crypto';
import mongoose, { ObjectId } from 'mongoose';
import BlockModel, { IBlock } from '../models/block';
import SpaceModel from '../models/space';
import User from "../models/user"

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
    // 確認 Space 是否存在且屬於該用戶
    const space = await SpaceModel.findById(spaceId);
    if (!space) {
        throw new Error('Space not found');
    }

    // 創建新的 Block
    const block = await BlockModel.create({
        ...blockData,
        spaceId,
    });

    // 將 Block ID 添加到 Space 的 blocks 列表中
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
 * @desc Get all blocks under a space
 * @param spaceId - The ID of the space
 * @returns An array of blocks
 */
export const getBlocksBySpaceId = async (spaceId: string): Promise<IBlock[]> => {
    const blocks = await BlockModel.find({ spaceId });
    return blocks;
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

    // 生成 6 位數的 PIN 碼
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

    // 將用戶添加到 block 的 coworkers 中
    if (!block.coworkers.includes(userId)) {
        block.coworkers.push(userId);
        await block.save();
    }

    // 將 Block 添加到用戶的 coBlocks 列表中
    const user = await User.findById(userId);
    if (user && !user.coBlocks.includes(block._id as mongoose.Types.ObjectId)) {
        user.coBlocks.push(block._id as mongoose.Types.ObjectId);
        await user.save();
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
