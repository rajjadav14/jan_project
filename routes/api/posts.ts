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
                user: req.user.id
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
router.get('/', auth, async (req, res) => {
    try {
        const posts = await postModel.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error");
    }
});

// @route  GET api/post/:id
// @desc   Get post by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found.' })
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not Found.' })
        res.status(500).send("server error");
    }
});


// @route  DELETE api/post/:id
// @desc   Delete a post by ID
// @access Private
router.delete('/:id', auth, async (req: any, res) => {
    try {
        const post = await postModel.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post not found' });

        // Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(404).json({ msg: 'User not Authorized' });
        }

        await post.remove();

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not Found.' })
        res.status(500).send("server error");
    }
});

// @route  PUT api/post/unlike/:id
// @desc   Like a post by ID
// @access Private
router.put('/unlike/:id', auth, async (req: any, res) => {
    try {
        // find post by id

        const post = await postModel.findById(req.params.id);

        console.log(post);


        //check if post is liked.
        if (post.likes.filter((likes: any) => likes.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'post has not been liked.' });
        };

        const removeIndex = post.likes.map((likes: any) => likes.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not Found.' })
        res.status(500).send("server error");
    }
});

// @route  PUT api/post/like/:id
// @desc   Like a post by ID
// @access Private
router.put('/like/:id', auth, async (req: any, res) => {
    try {
        // find post by id

        const post = await postModel.findById(req.params.id);

        console.log(post);


        //check if post is already liked.
        if (post.likes.filter((likes: any) => likes.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'post already liked' });
        };

        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'Post not Found.' })
        res.status(500).send("server error");
    }
});


// @route  POST api/post/comment/:id
// @desc   Comment on a post
// @access Private
router.post('/comment/:id', [auth,
    check('text', 'Text is required.').not().isEmpty()],
    async (req: any, res: any) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const user = await userModel.findById(req.user.id).select('-password');
            const post = await postModel.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            };

            post.comments.unshift(newComment);
            await post.save();
            // const post = await newPost.save();
            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error")
        }
    });

// @route  DELETE api/post/comment/:post_id/:comment_id
// @desc   Delete a comment
// @access Private
router.delete('/comment/:post_id/:comment_id',auth,async(req:any,res)=>{
    try {

        const post = await postModel.findById(req.params.post_id);

        // pull out comment
        const comment = post.comments.find((x:any)=>x.id===req.params.comment_id)

        //if no comment
        if(!comment) return res.status(404).json({msg:"comment not exists."});

        //check user
        if(comment.user.toString() !== req.user.id) return res.status(404).json({msg:"User not authorized."});
        
        const removeIndex = post.comments.map((x: any) => x.user.toString()).indexOf(req.user.id);
        post.comments.splice(removeIndex, 1);
        await post.save();
        res.json(post.comments);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("server error")
    }
})



export = router;