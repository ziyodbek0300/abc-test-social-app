import { PrismaClient } from '@prisma/client';

export class LikeService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async likePublication(publicationId: string, userId: string) {
        const publication = await this.prisma.publication.findUnique({
            where: { id: publicationId },
            select: { authorId: true },
        });

        if (!publication) {
            throw new Error('Publication not found');
        }

        if (publication.authorId === userId) {
            throw new Error('You cannot like your own publication');
        }

        const existingLike = await this.prisma.like.findUnique({
            where: {
                publicationId_userId: { publicationId, userId },
            },
        });

        if (existingLike) {
            throw new Error('User already liked this publication');
        }

        return await this.prisma.like.create({
            data: {
                publicationId,
                userId,
            },
        });
    }

    async unlikePublication(publicationId: string, userId: string) {
        const like = await this.prisma.like.findUnique({
            where: {
                publicationId_userId: { publicationId, userId },
            },
        });

        if (!like) {
            throw new Error('Like not found');
        }

        return await this.prisma.like.delete({
            where: {
                publicationId_userId: { publicationId, userId },
            },
        });
    }
}