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
        if (skills) profileFields.skills  = skills ;

        // build social
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;

        console.log("profile fields"+ profileFields);
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

// @route  POSt api/profile
// @desc   createa or update a user profile
// @access Private
// router.post('/',[auth,[
//     check('Status','status is required').not().isEmpty(),
//     check('skills','skills are required').not().isEmpty()
// ]],async(req:any,res:any)=>{
// const errors = validationResult(req);
// });


export = router;