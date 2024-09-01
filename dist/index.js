"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const express_rate_limit_1 = tslib_1.__importDefault(require("express-rate-limit"));
const client_1 = require("@prisma/client");
// cron-imports
require("services/crons/cleanup.service");
// route-imports
const routes_1 = require("routes");
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use(express_1.default.json());
app.use((0, helmet_1.default)());
app.use((0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100
}));
// Routes
app.use('/api/auth', routes_1.AuthRoutes);
app.get('/', (req, res) => {
    res.send('Mini Social Network API');
});
app.listen(3000, () => console.log('Server running on port 3000'));
//# sourceMappingURL=index.js.map