import authRoutes from '../routes/auth.Routes.js';
import messageRoutes from '../routes/message.Routes.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from '../libs/db.js';
import cors from 'cors';
import express from 'express';
import path from 'path';
import {app,server} from '../libs/socket.js'


dotenv.config()
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname,'../frontend/dist')))
    app.get('*',(req,res) => {
        res.sendFile(path.join(__dirname,'../frontend','dist','index.html'))
    })}
server.listen(PORT, () => {
    console.log('Server is running on port',PORT);
    connectDB();
    });
