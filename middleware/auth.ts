import { userModel } from './../models/users';
import jwt from 'jsonwebtoken';
import config from 'config';
import {Iuser,Ijwtdecoded} from '../interface/interfaces';

export const auth = (req:any,res:any,next:any):any=>{
    console.log("auth middleware")

    // get token from header
    const token = req.header('x-auth-token');

    //no token
    if(!token) return res.status(401).json({msg:'no token, authorizaton failed'});

    try {
     // verify token
    const decode = jwt.verify(token,config.get('jwtSecret')) as Ijwtdecoded;
    req.user = decode.user;   
    console.log(decode);
    next(); 
    } catch (err) {
        res.status(401).json({msg:"Token is  not valid."})       
    }
}