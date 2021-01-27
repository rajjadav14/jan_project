import express from 'express';
const newROuter = express.Router();

newROuter.get('/test',(req,res)=> res.send("started testing"));

export = newROuter;