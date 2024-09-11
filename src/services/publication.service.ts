import { PrismaClient, Publication } from '@prisma/client';  // Import the relevant Prisma types
import { PaginationService } from './pagination.service';

export class PublicationService {
    private prisma: PrismaClient;
    private paginationService: PaginationService;

    constructor() {
        this.prisma = new PrismaClient();
        this.paginationService = new PaginationService(this.prisma);
    }

    async getPaginatedPublications(page: number = 1, pageSize: number = 10) {
        const skip = (page - 1) * pageSize;

        const totalItems = await this.prisma.publication.count();

        const publications = await this.prisma.publication.findMany({
            include: {
                author: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
            skip,
            take: pageSize,
        });

        const totalPages = Math.ceil(totalItems / pageSize);

        const result = publications.reduce((acc: { username: string; articles }[], publication) => {
            const authorName = publication.author.full_name;
            const likeIds = publication.likes.map((like) => like.userId);

            const article = {
                uuid: publication.id,
                Title: publication.title,
                Content: publication.content,
                Likes: likeIds,
            };

            const authorEntry = acc.find((entry) => entry.username === authorName);
            if (authorEntry) {
                authorEntry.articles.push(article);
            } else {
                acc.push({
                    username: authorName,
                    articles: [article],
                });
            }

            return acc;
        }, []);

        return {
            data: result,
            metadata: {
                totalItems,
                totalPages,
                currentPage: page,
                pageSize,
            },
        };
    }

    async createPublication(userId: string, title: string, content: string): Promise<Publication> {
        return await this.prisma.publication.create({
            data: {
                title,
                content,
                authorId: userId,
            },
        });
    }

    async getPublications(): Promise<{ username: string; articles: { uuid: string; Title: string; Content: string; Likes: string[] }[] }[]> {
        const publications = await this.prisma.publication.findMany({
            include: {
                author: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
        });

        const result = publications.reduce((acc: { username: string; articles }[], publication) => {
            const author = publication.author.full_name;
            const likeIds = publication.likes.map((like) => like.userId);

            const article = {
                uuid: publication.id,
                Title: publication.title,
                Content: publication.content,
                Likes: likeIds,
            };

            const authorEntry = acc.find((entry) => entry.username === author);
            if (authorEntry) {
                authorEntry.articles.push(article);
            } else {
                acc.push({
                    username: author,
                    articles: [article],
                });
            }

            return acc;
        }, []);

        return result;
    }

    async getPublicationById(id: string): Promise<Publication | null> {
        return await this.prisma.publication.findUnique({
            where: { id },
            include: {
                author: true,
                likes: true,
                comments: true,
            },
        });
    }

    async updatePublication(id: string, userId: string, title?: string, content?: string): Promise<Publication> {
        const publication = await this.prisma.publication.findUnique({
            where: { id },
        });

        if (!publication || publication.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        return await this.prisma.publication.update({
            where: { id },
            data: {
                title,
                content,
            },
        });
    }

    async deletePublication(id: string, userId: string): Promise<void> {
        const publication = await this.prisma.publication.findUnique({
            where: { id },
        });

        if (!publication || publication.authorId !== userId) {
            throw new Error('Unauthorized');
        }

        await this.prisma.publication.delete({
            where: { id },
        });
    }
}
