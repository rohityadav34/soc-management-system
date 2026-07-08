const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const connectDb = require('./config/db');

const authRoutes = require('./routers/authrouters');
const roleRoutes = require('./routers/role.routes');
const flatRoutes = require('./routers/flat.routes');
const UserRoutes = require('./routers/user.routes');
const visitorsRoutes = require('./routers/visitors.routes');
const complaintRoutes = require("./routers/complaint.routes")
const noticeRoutes = require("./routers/notice.routes");
const billRoutes = require("./routers/bill.routes");
const parkingRoutes = require("./routers/parking.routes");


const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const notificationService = require('./lib/notificationService');
const { initPrivacyWorker } = require('./lib/privacyCleanup');



const app = express();
const server = http.createServer(app);

// CORS configuration supporting localhost and Vercel subdomains/preview urls
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const checkOrigin = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, postman)
  if (!origin) return callback(null, true);
  
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  
  // Allow Vercel preview/deployment subdomains specifically for this project
  if (origin.endsWith('.vercel.app') && (origin.includes('soc-management-system') || origin.includes('rohit-yadavs-projects'))) {
    return callback(null, true);
  }
  
  callback(null, false);
};

// Socket.IO
const io = new Server(server, {
  cors: {
    origin: checkOrigin,
    credentials: true,
  },
});

// Database Connection
connectDb();

// Privacy Worker
initPrivacyWorker();

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: checkOrigin,
    credentials: true,
  })
);

app.use('/public', express.static(path.join(process.cwd(), 'public')));

// Make io available in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health Check
app.get('/health', (req, res) => {
  res.send('Health is ok.');
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', UserRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/flats', flatRoutes);
app.use('/api/v1', visitorsRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/bills', billRoutes);
app.use("/api/v1/parking", parkingRoutes);

// Socket Connection
io.on('connection', (socket) => {
  console.log('Client Connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client Disconnected:', socket.id);
  });
});

// Notification Service
notificationService.init(io);

// Port
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export
module.exports.userConnectionDetails =
  notificationService.userConnectionDetails;