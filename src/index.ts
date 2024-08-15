import express, { Response, Request, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import createHttpError from 'http-errors';
import connectDB from './config/db';
import chatRoutes from './routes/chatRoutes';
import { initSocket } from './utils/socket';
import { createServer } from 'http';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chats', chatRoutes);

// Error handling middleware
app.use((err: createHttpError.HttpError, req: Request, res: Response, next: NextFunction) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || 'Something went wrong!';
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});

// Start the server and initialize socket connection
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initSocket(server);
});