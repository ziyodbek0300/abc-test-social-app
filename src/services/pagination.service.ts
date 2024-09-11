import { PrismaClient, Prisma } from '@prisma/client';

export class PaginationService {
    constructor(private prisma: PrismaClient) { }

    async paginate<T>(
        model: Prisma.ModelName,
        args,
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ data: T[]; total: number; page: number; pageSize: number }> {
        const skip = (page - 1) * pageSize;

        const [data, total] = await this.prisma.$transaction([
            this.prisma[model].findMany({
                ...args,
                skip,
                take: pageSize,
            }),
            this.prisma[model].count({
                where: args.where,
            }),
        ]);

        return {
            data,
            total,
            page,
            pageSize,
        };
    }
}