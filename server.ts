console.log("started");
import express from 'express';
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>console.log("server startes"));
app.get('/',(req,res)=>res.send('api running'));