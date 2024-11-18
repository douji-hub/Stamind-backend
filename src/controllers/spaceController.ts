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

        // Call the service to create a space for the user
        const space = await spaceService.createSpace(user._id as ObjectId);

        res.status(201).json(space); // Respond with the created space
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating space' });
    }
};

// Controller to fetch all spaces for a user
export const getSpaceDetails = async (req: IRequestWithUser, res: Response) => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        // Call the service to fetch space details for the user
        const spaceDetails = await spaceService.getSpaceDetails(user._id as ObjectId);
        res.status(200).json(spaceDetails); // Respond with the space details
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching space details' });
    }
};

// Controller to delete a space
export const deleteSpace = async (req: IRequestWithUser, res: Response): Promise<void> => {
    try {
        const user = req.user; // Ensure the user is authenticated
        if (!user) {
            res.status(401).json({ message: 'User not authorized' });
            return;
        }

        const { spaceId } = req.body; // Extract the space ID from the request body

        // Call the service to delete the space
        await spaceService.deleteSpace(user._id as ObjectId, spaceId);

        res.status(200).json({ message: 'Space deleted successfully' }); // Respond with success message
    } catch (error: any) {
        console.error(error);
        // Handle specific errors for user or space not found
        if (error.message === 'User not found' || error.message === 'Space not found or unauthorized') {
            res.status(404).json({ message: error.message });
            return;
        }
        res.status(500).json({ message: 'Error deleting space' });
    }
};
