import express from 'express';
import {auth} from '../../middleware/auth';
import {profileModel} from '../../models/Profile';
import {userModel} from '../../models/users';
const router = express.Router();


// @route  GET api/profile/me
// @desc   get current user profile
// @access Private
router.get('/me',auth,async(req:any,res:any)=>{
 try {
      
     const profile = await profileModel.findOne({user:req.user.id}).populate('user',['name','avatar']);

     if(!profile){
         return res.status(400).json({msg:"There is no profile for this user."});
     }
     res.send(profile);
    } catch (err) {
     console.error(err.message);
     res.status(500).send("server error")
 }
});

export = router;