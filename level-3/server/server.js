import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { initStockCronJob } from './jobs/stockMonitor.js';

import authRoutes from './routes/authRoutes.js';
import pizzaRoutes from './routes/pizzaRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminMenuRoutes from './routes/adminMenuRoutes.js';

dotenv.config();

connectDB();

const app = express();
const server = http.createServer(app);

// Dynamic CORS configuration supporting Localhost, Vercel, and Netlify
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
  /\.vercel\.app$/,
  /\.netlify\.app$/
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  socket.on('joinOrderRoom', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined tracking room for Order: ${orderId}`);
  });

  socket.on('disconnect', () => {
    // Clean disconnect
  });
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pizzas', pizzaRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/menu', adminMenuRoutes);

// Root & Health Check Routes (Must be defined BEFORE server.listen)
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🍕 Pizza Craft Backend API is live and running successfully!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Pizza Delivery API is active and healthy.'
  });
});

initStockCronJob();

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running in production mode on port ${PORT}`);
});