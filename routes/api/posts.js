const express = require('express');
const passport = require('passport');
const router = express.Router();
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const ValidatePostInput = require('../../validation/post');

// @route   /api/posts/test
// @desc    test route to see if this route file is even invoked?
// @access  public
router.get('/test', (req,res) => res.json({msg:'posts works'}));

// @route   /api/posts
// @desc    get all the posts
// @access  public
router.get('/', (req,res) => {
    Post.find()
        .sort({date: -1})
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({noPostsFound: "no posts found"}));
});

// @route   /api/posts/:id
// @desc    get post of a given id
// @access  public
router.get('/:id', (req,res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({noPostFound: "no post found with this id"}));
});

// @route   /api/posts/:id
// @desc    delete post of a given id
// @access  private with jwt auth
router.delete('/:id', passport.authenticate('jwt', {session:false}),  (req,res) => {
    Profile.findOne({user:req.user.id})
        .then(profile => {
            Post.findById(req.params.id)
            .then(post => {
                if(post.user.toString() !== req.user.id){
                    return res.status(401).json({notauthorized:"not authorized, current logged in user does not own the post"});
                }else{
                    post.remove().then( () => res.json({success:true}));
                }
            }).catch(err => res.status(404).json({error:"Error deleting or post not found"}));
        }).catch(err => res.status(404).json({profileNotFound: "Error finding profile, or profile not found"}));
});

// @route   /api/posts
// @desc    route to create a new post
// @access  private with jwt auth
router.post('/', passport.authenticate('jwt', {session:false}), (req,res) => {
    const {errors, isValid} = ValidatePostInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));

});

module.exports = router;