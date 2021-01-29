import express from 'express';
import { auth } from '../../middleware/auth';
import { check, validationResult } from 'express-validator';
import { profileModel } from '../../models/Profile';
import { userModel } from '../../models/users';
import { IProfile } from '../../interface/interfaces'
const router = express.Router();


// @route  GET api/profile/me
// @desc   get current user profile
// @access Private
router.get('/me', auth, async (req: any, res: any) => {
    try {

        const profile = await profileModel.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user." });
        }
        res.send(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error")
    }
});

// @route  POSt api/profile
// @desc   create or update a user profile
// @access Private
router.post('/', [auth,
    check('status', 'status is required').not().isEmpty(),
    check('skills', 'skills are required').not().isEmpty()],
    async (req: any, res: any) => {
        console.log("started profile");
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        console.log("no error");
        let {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Build profile object
        const profileFields: any = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = company;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) profileFields.skills = skills;

        // build social
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        console.log("profile fields" + profileFields);
        // create update profile
        try {
            // find a profile
            let profile = await profileModel.findOne({ user: req.user.id });

            // check if it exists
            if (profile) {
                //Update
                profile = await profileModel.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile)
            };

            // create

            profile = new profileModel(profileFields);
            await profile.save();
            res.json(profile);

        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error")
        };
    });

// @route  GET api/profile
// @desc   get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profile = await profileModel.find().populate('user', ['name', 'avatar']);
        res.json(profile);

    } catch (err) {
        console.error(err.message)
        res.status(500).send("server errror");
    }
});

// @route  GET api/profile/user/:user_id
// @desc   get profile by user_id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await profileModel.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if (!profile) return res.status(400).json({ msg: 'Profile not found.' });
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found.' })
        }
        res.status(500).send("server errror");
    }
});

// @route  DELETE api/profile
// @desc   delete profile,user and posts
// @access Private
router.delete('/', auth,async (req:any, res) => {
    try {
        //@todo remove posts

        // remove profile
        await profileModel.findOneAndRemove({user:req.user.id});
       
        // remove user
        await userModel.findOneAndRemove({_id:req.user.id})
        
        res.json({msg:'User deleted.'});

    } catch (err) {
        console.error(err.message)
        res.status(500).send("server errror");
    }
});

// @route  PUT api/profile/experience
// @desc   Add profile experience
// @access Private
router.put('/experience',[auth,
check('title','Title is required.').not().isEmpty(),
check('company','Company is required.').not().isEmpty(),
check('from','From date is required.').not().isEmpty(),
],async(req:any,res:any)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    };

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp ={
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await profileModel.findOne({user:req.user.id});
        profile.experience.unshift(newExp);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error.")
    }
});

// @route  DELETE api/profile/experience/:exp_id
// @desc   delete experience from profile
// @access Private
router.delete('/experience/:exp_id',auth,async(req:any,res)=>{
    try {
        const profile = await profileModel.findOne({user:req.user.id});
        
        //get remove index
        const removeIndex = profile.experience.map((x:any)=>x.id).indexOf(req.params.exp_id);
        profile.experience.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

// @route  PUT api/profile/education
// @desc   Add profile education
// @access Private
router.put('/education',[auth,
check('school','school is required.').not().isEmpty(),
check('degree','degree is required.').not().isEmpty(),
check('fieldofstudy','fieldofstudy is required.').not().isEmpty(),
check('from','From date is required.').not().isEmpty(),
],async(req:any,res:any)=>{

    console.log(req.body);

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    };

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu ={
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    };

    try {
        const profile = await profileModel.findOne({user:req.user.id});
        profile.education.unshift(newEdu);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error.")
    }
});

// @route  DELETE api/profile/education/:edu_id
// @desc   delete education from profile
// @access Private
router.delete('/education/:edu_id',auth,async(req:any,res)=>{
    try {

        const profile = await profileModel.findOne({user:req.user.id});
        
        //get remove index
        const removeIndex = profile.education.map((x:any)=>x.id).indexOf(req.params.exp_id);
        profile.education.splice(removeIndex,1);
        await profile.save();
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

export = router;