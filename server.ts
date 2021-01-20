import express from 'express';
import { connect } from 'mongoose';
import routes from './routes/api/users'
import connectDB from './config/db'; 
import router from './routes/api/users';
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log("server startes"));
app.get('/',(req,res)=>res.send('api running'));
connectDB();
app.use(express.json());
app.use('/api/user',router)