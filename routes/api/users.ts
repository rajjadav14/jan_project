import express from 'express';
import {check,validationResult} from 'express-validator/check';
import {usertable} from '../../models/users'
const router = express.Router();

router.post('/',[
    check('name','name is required').not().isEmpty(),
    check('email','should be a valid email').isEmail(),
    check('password','minimum length should be 5 characters.').isLength({min:5})
],async(req:any,res:any)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    console.log(req.body);
    const {name,email,password} = req.body;
    try {
        //check if user exists
        let user = usertable.findOne({email})
    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error');
    }

    res.send("user router")
});

export = router;