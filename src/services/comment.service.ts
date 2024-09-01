import { PrismaClient } from '@prisma/client';

export class CommentService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async addComment(publicationId: string, userId: string, content: string) {
        const publication = await this.prisma.publication.findUnique({
            where: { id: publicationId },
            select: { authorId: true },
        });

        if (!publication) {
            throw new Error('Publication not found');
        }

        if (publication.authorId === userId) {
            throw new Error('You cannot comment on your own publication');
        }

        return await this.prisma.comment.create({
            data: {
                publicationId,
                authorId: userId,
                content,
            },
        });
    }

    async getComments(publicationId: string) {
        return await this.prisma.comment.findMany({
            where: { publicationId },
            include: {
                author: true,
            },
        });
    }

    async deleteComment(commentId: string, userId: string) {
        const comment = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!comment || comment.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        return await this.prisma.comment.delete({
            where: { id: commentId },
        });
    }
}
