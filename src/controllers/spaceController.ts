import { ObjectId } from 'mongoose';
import { Request, Response } from 'express';
import * as spaceService from '../services/spaceService';
import { IRequestWithUser } from '../interfaces/globalInterface';

// Controller to create a new space
export const createSpace = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const space = await spaceService.createSpace(user._id as ObjectId); // Create a new space
        res.status(201).json(space); // Respond with the created space
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating space' });
    }
};

// Controller to fetch all spaces for a user
export const getAllSpaces = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const spaces = await spaceService.getAllSpaces(user._id as ObjectId); // Fetch all spaces
        res.status(200).json(spaces); // Respond with the list of spaces
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching spaces' });
    }
};

// Controller to fetch a specific space by its ID
export const getSpaceById = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { spaceId } = req.params; // Extract spaceId from route params
        const space = await spaceService.getSpaceById(user._id as ObjectId, spaceId); // Fetch the specific space
        res.status(200).json(space); // Respond with the space details
    } catch (error: any) {
        console.error(error);
        if (error.message === 'User not found' || error.message === 'Space not found or unauthorized') {
            res.status(404).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Error fetching space' });
    }
};

// Controller to delete a specific space
export const deleteSpace = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { spaceId } = req.params; // Extract spaceId from route params
        await spaceService.deleteSpace(user._id as ObjectId, spaceId); // Delete the specific space
        res.status(200).json({ message: 'Space deleted successfully' }); // Respond with success message
    } catch (error: any) {
        console.error(error);
        if (error.message === 'User not found' || error.message === 'Space not found or unauthorized') {
            res.status(404).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Error deleting space' });
    }
};
