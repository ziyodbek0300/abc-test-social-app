"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_cron_1 = tslib_1.__importDefault(require("node-cron"));
const client_1 = tslib_1.__importDefault(require("prisma/client"));
node_cron_1.default.schedule('0 0 * * *', async () => {
    const now = new Date();
    const thresholdDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    try {
        await client_1.default.user.deleteMany({
            where: {
                is_verified: false,
                created_at: {
                    lt: thresholdDate,
                },
            },
        });
        console.log('Unverified users cleanup completed');
    }
    catch (error) {
        console.error('Error during cleanup:', error);
    }
});
//# sourceMappingURL=cleanup.service.js.map