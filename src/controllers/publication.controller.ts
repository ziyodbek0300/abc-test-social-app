import { Request, Response } from 'express';
import { PublicationService } from '../services';
import { AuthenticatedRequest } from '../types';

const publicationService = new PublicationService();

export const createPublication = async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const { userId } = (req as AuthenticatedRequest).user;

    try {
        const publication = await publicationService.createPublication(userId, title, content);
        res.status(201).json(publication);
    } catch {
        res.status(500).json({ message: 'Failed to create publication' });
    }
};

export const getPaginatedPublications = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 20;

        const result = await publicationService.getPaginatedPublications(page, pageSize);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching paginated publications:', error);
        res.status(500).json({ message: 'Failed to retrieve publications' });
    }
};

export const getPublications = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const result = await publicationService.getPublications();
        res.status(200).json(result);
    } catch {
        res.status(500).json({ message: 'Failed to retrieve publications' });
    }
};

export const getPublicationById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const publication = await publicationService.getPublicationById(id);

        if (!publication) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        res.status(200).json(publication);
    } catch {
        res.status(500).json({ message: 'Failed to retrieve publication' });
    }
};

export const updatePublication = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const { userId } = (req as AuthenticatedRequest).user;

    try {
        const updatedPublication = await publicationService.updatePublication(id, userId, title, content);
        res.status(200).json(updatedPublication);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            res.status(403).json({ message: 'Unauthorized' });
        } else {
            res.status(500).json({ message: 'Failed to update publication' });
        }
    }
};

export const deletePublication = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = (req as AuthenticatedRequest).user;

    try {
        await publicationService.deletePublication(id, userId);
        res.status(200).json({ message: 'Publication deleted successfully' });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'Unauthorized') {
            res.status(403).json({ message: 'Unauthorized' });
        } else {
            res.status(500).json({ message: 'Failed to delete publication' });
        }
    }
};