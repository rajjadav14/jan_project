import express from 'express';
import { auth } from '../../middleware/auth';
import router from './users';
import { userModel } from '../../models/users'
import { Iuser } from '../../interface/interfaces';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';

//@route  get api/auth
//@desc   test route
//@access Public 
router.get('/', auth, async (req: any, res) => {
    try {
        const user: Iuser = await userModel.findById(req.user.id).select('-password');
        console.log(user);
        return res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

});

//@route  post api/auth
//@desc   authenticate user $ get token
//@access Public 
router.post('/login', [
    check('email', 'should be a valid email').isEmail(),
    check('password', 'password is required').exists()
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    console.log(req.body);
    const { email, password } = req.body;
    try {
        //check if user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid user Credentials' }] });
        }

        // match password
        const isMatch: boolean = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ errors: [{ msg: 'Invalid user Credentials' }] });
        }
        //jwt token
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload,
            config.get("jwtSecret"),
            { expiresIn: '5 days' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }
});


export = router;