const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const validateProfileInput = require('../../validation/profile');

// @route   GET api/profiles/test
// @desc    test end point to see if this profiles route is working
// @access  public
router.get('/test', (req,res) => res.json({msg:'profiles works'}));


// @route   GET api/profiles
// @desc    get current users profile
// @access  Private with jwt authentication
router.get(
    '/', 
    passport.authenticate('jwt', {session:false}), (req, res) => {
        const errors = {};
        Profile.findOne({user: req.user.id})
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
        })
        .catch(err => res.status(404).json(err));
    }
);


// @route   POST api/profiles
// @desc    create or update a user's profile
// @access  Private with jwt authentication
router.post(
    '/', 
    passport.authenticate('jwt', {session:false}), (req, res) => {
        //Check if everything is valid?
        const {errors, isValid} = validateProfileInput(req.body);
        if(!isValid){
            res.status(400).json(errors);
        }

        //Get all the data that is sent from the client
        const profileFields = {};
        profileFields.user = req.user.id;
        if(req.body.handle) profileFields.handle = req.body.handle;
        if(req.body.company) profileFields.company = req.body.company;
        if(req.body.website) profileFields.website = req.body.website;
        if(req.body.location) profileFields.location = req.body.location;
        if(req.body.bio) profileFields.bio = req.body.bio;
        if(req.body.status) profileFields.status = req.body.status;
        if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
        //skills split array
        if(req.body.skills !== 'undefined'){
            profileFields.skills = req.body.skills.split(',');
        }
        //social
        profileFields.social = {};
        if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
        if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
        if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
        if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
        if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
        
        Profile.findOne({user: req.user.id}).then(profile => {
            if(profile){
                //Todo: fix an issue where an update profile accidentally uses someone else's handle
                //Update existing profile
                Profile.findOneAndUpdate(
                    {user: req.user.id}, 
                    {$set:profileFields}, 
                    {new:true})
                .then(profile => res.json(profile));
            }else{
                //Create a new profile
                Profile.findOne({handle:profileFields.handle})
                .then(profile => {
                    if(profile){
                        errors.handle = 'Handle in use, please use another handle';
                        res.status(404).json(errors);
                    }
                    else{
                        //save profile
                        new Profile(profileFields).save()
                        .then(profile => {
                            res.json(profile);
                        })
                    }
                });
            }
        });
        

    }
);

// @route   /api/profiles/handle/:handle
// @desc    get a profile by a handle
// @access  public
router.get('/handle/:handle', (req,res) => {
    const errors = {};
    Profile.findOne({handle: req.params.handle})
    .populate('user', ['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = "There is no profile for this handle";
            res.status(404).json(errors);
        }else{
            return res.json(profile);
        }
    })
});

// @route   /api/profiles/user/:user_id
// @desc    get a profile from its user id
// @access  public
router.get('/user/:user_id', (req,res) => {
    const errors = {};
    Profile.findOne({user: req.params.user_id})
    .populate('user', ['name','avatar'])
    .then(profile => {
        if(!profile){
            errors.noprofile = "There is no profile for this user_id";
            res.status(404).json(errors);
        }else{
            return res.json(profile);
        }
    })
});

// @route   /api/profiles/all
// @desc    get all profiles in the database
// @access  public
router.get('/all', (req,res) => {
    const errors = {};
    Profile.find()
    .populate('user', ['name','avatar'])
    .then( profiles => {
        if(!profiles){
            errors.noprofile = "there are no profiles in the database";
        }else{
            res.json(profiles);
        }
    })
    .catch( err => {
        errors.error = "error in getting all profiles";
        res.status(404).json(errors);    
    });

});


module.exports = router;