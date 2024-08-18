import express, { Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import chatRoutes from './routes/chatRoutes';
import { initSocket } from './utils/socket';
import { createServer } from 'http';
import { AppError } from 'utils/errorClass';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/chats', chatRoutes);

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initSocket(server);
});