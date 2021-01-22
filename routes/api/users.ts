import express from 'express';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import { check, validationResult } from 'express-validator';
import { userModel } from '../../models/users'
const router = express.Router();

router.post('/', [
    check('name', 'name is required').not().isEmpty(),
    check('email', 'should be a valid email').isEmail(),
    check('password', 'minimum length should be 5 characters.').isLength({ min: 5 })
], async (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    console.log(req.body);
    const { name, email, password } = req.body;
    try {
        //check if user exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists.' }] })
        }

        // get avatar
        const avatar: string = gravatar.url(email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        })

        // creating object of new user
        user = new userModel({
            name,
            email,
            password,
            avatar,
        });

        // encrypting the password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

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