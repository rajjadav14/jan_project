import express from 'express';
import { auth } from '../../middleware/auth';
import router from './users';
import {userModel} from '../../models/users'
import { Iuser } from '../../interface/interfaces';

router.get('/', auth, async (req:any, res) => {
    try {
        const user:Iuser = await userModel.findById(req.user.id).select('-password');
        console.log(user);
        res.json(user)
        res.send('AUth success ');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
    
});

export = router;