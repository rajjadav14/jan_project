import express, { response } from 'express';
import { auth } from '../../middleware/auth';
import { body, check, validationResult } from 'express-validator';
import { postModel } from '../../models/Post';
import { profileModel } from '../../models/Profile';
import { userModel } from '../../models/users';
const router = express.Router();

// @route  POST api/post
// @desc   Create a post
// @access Private
router.post('/', [auth,
    check('text', 'Text is required.').not().isEmpty()],
    async (req: any, res: any) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const user = await userModel.findById(req.user.id).select('-password');
            const newPost = new postModel({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                usesr: req.user.id
            });

            const post = await newPost.save();
            res.json(post)
        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error")
        }
    });

// @route  GET api/post
// @desc   Get all post
// @access Private
router.get('/',auth,async(req,res)=>{
    try {
        const posts = await postModel.find().sort({date:-1});
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

// @route  GET api/post/:id
// @desc   Get post by ID
// @access Private
router.get('/:id',auth,async(req,res)=>{
    try {
        const post=await postModel.findById(req.params.id);
        if(!post) return res.status(404).json({msg:'Post not found.'})
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(404).json({msg:'Post not Found.'})
        res.status(500).send("server error");
    }
});


// @route  DELETE api/post/:id
// @desc   Delete a post by ID
// @access Private
router.delete('/:id',auth,async(req:any,res)=>{
    try {
        const post = await postModel.findById(req.params.id);

        if(!post) return res.status(404).json({msg:'Post not found'});
        console.log(post);
       
        console.log(req.user.id);
        console.log(post.user.toString());
        // Check user
        if(post.user !== req.user.id){
            return res.status(404).json({msg:'User not Authorized'});
        }

        await post.remove();

        res.json({msg:'Post removed'});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') return res.status(404).json({msg:'Post not Found.'})
        res.status(500).send("server error");
    }
});






export = router;