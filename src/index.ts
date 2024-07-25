import express, { Express } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import projectRouter from './routes/projectRoutes';
import reportRouter from './routes/reportRoutes';
import authMiddleware from './middleware/auth';
import { swaggerSpec } from '../swaggerConfig';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/projects', authMiddleware, projectRouter);
app.use('/api/v1/reports', authMiddleware, reportRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/', (_, res) => {
	res.send('Api Healthy');
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
