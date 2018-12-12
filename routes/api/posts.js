const express = require('express');
const passport = require('passport');
const router = express.Router();
const Post = require('../../models/Post');
const ValidatePostInput = require('../../validation/post');

// @route   /api/posts/test
// @desc    test route to see if this route file is even invoked?
// @access  public
router.get('/test', (req,res) => res.json({msg:'posts works'}));

// @route   /api/posts/test
// @desc    test route to see if this route file is even invoked?
// @access  public
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