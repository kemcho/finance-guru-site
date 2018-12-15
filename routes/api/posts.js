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

// @route   /api/posts/like/:id
// @desc    like a post
// @access  private
router.post('/like/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length >0){
                return res.status(400).json({alreadyLiked: "User already liked this post"});
            }

            //add user id to the likes array
            post.likes.unshift({user: req.user.id});
            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json({postNotFound: "error with liking, post not found"}));

});


// @route   /api/posts/unlike/:id
// @desc    unlike a post
// @access  private
router.post('/unlike/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{
    Post.findById(req.params.id)
        .then(post => {
            if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
                res.status(400).json({notliked: "user has not liked the post yet"});
            }

            const likeIndex = post.likes.map(like => like.user.toString())
                                        .indexOf(req.user.id);
            
            post.likes.splice(likeIndex,1);
            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json({postNotFound: "error with unliking, post not found"}));

});

// @route   /api/posts/comment/:id
// @desc    add a comment to a post
// @access  private
router.post('/comment/:id', passport.authenticate('jwt', {session:false}), (req, res)=>{

    Post.findById(req.params.id)
        .then(post => {
            
            //use the same validation for comment as that of the post
            //todo: use custom comment validator, to not have confusing error messages, here we will see same error message for post and comment
            const {errors,isValid} = ValidatePostInput(req.body);
            if(!isValid){
                return res.status(400).json(errors);
            }

            const newComment = {
                user: req.user.id,
                text: req.body.text,
                name: req.body.name,
                avatar:req.body.avatar
            };

            post.comments.unshift(newComment);
            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json(err.toString()));

});

// @route   /api/posts/comment/:post_id/:comment_id
// @desc    remove a comment from a post
// @access  private
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {session:false}), (req, res)=>{

    Post.findById(req.params.post_id)
        .then(post => {
        
            //check if it valid comment id that belongs to the user if so remove it
            if(post.comments
                .filter(comment => 
                        comment._id.toString() === req.params.comment_id &&
                        comment.user.toString() === req.user.id.toString()).length === 0){
                    return res.status(404).json({commentDoesNotExists: "comment does not exist for this user"});
                }
            //get the index of the comment the user owns and remove it
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id.toString());
            post.comments.splice(removeIndex,1);
            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json(err.toString()));

});




module.exports = router;