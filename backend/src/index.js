import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import { connection } from './utils/db.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './utils/swagger.js';

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:3001';
app.use(cors({ credentials: true, origin: allowedOrigin }));
app.use(express.json());
app.use(cookieParser());

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connection();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api/docs`);
  });
};

startServer(); 