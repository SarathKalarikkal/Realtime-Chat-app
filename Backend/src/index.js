import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import { connectDB } from './libs/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { app,server } from './libs/socket.js';
import path from 'path';



dotenv.config();
// Middleware to parse JSON requests
const PORT = process.env.PORT || 5001;

const _dirname = path.resolve();


// Middleware
app.use(express.json({limit: '100mb'}));
app.use(express.urlencoded({limit: '100mb', extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],  
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

// Basic route


app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(_dirname, '../Frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(_dirname, "../Frontend", "build", "index.html"));
    });
}
// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB()
});