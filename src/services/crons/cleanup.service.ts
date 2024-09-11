import cron from 'node-cron';
import prisma from '../../prisma/client';

const cronTask = cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    try {
        await prisma.user.deleteMany({
            where: {
                is_verified: false,
                created_at: {
                    lt: thresholdDate,
                },
            },
        });

        console.log('Unverified users cleanup completed');
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
});

export default cronTask