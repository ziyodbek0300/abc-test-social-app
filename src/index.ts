import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// cron-imports
import "./services/crons/cleanup.service"

import {
    AuthRoutes,
    CommentRoutes,
    LikeRoutes,
    PublicationRoutes,
    UserReoutes
} from './routes';

export const app = express();
new PrismaClient();

app.use(express.json());
app.use(helmet());
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

app.use('/api/auth', AuthRoutes);
app.use('/api', PublicationRoutes);
app.use('/api', LikeRoutes);
app.use('/api', CommentRoutes);
app.use('/api', UserReoutes);

app.get('/', (req, res) => {
    res.send('Mini Social Network API');
});

if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
}