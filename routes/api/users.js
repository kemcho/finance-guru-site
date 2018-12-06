const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secret = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// @route   GET api/users/test
// @desc    test route to see if everything is working fine
// @access  public
router.get('/test', (req,res) => res.json({msg:'Users works'}));

const User = require('../../models/User');

// @route   POST api/users/post
// @desc    register a new user or throw an error if user exists
// @access  public
router.post('/register', (req,res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({email: req.body.email})
        .then( user => {
            if(user) {
                errors.email = 'User with this email id already exists';
                return res.status(400).json(errors);
            } else {
                //get the avatar of the user
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                //create the new user
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });

                bcryptjs.genSalt(10,(err, salt) => {
                    bcryptjs.hash(newUser.password, salt, (err, hash) => {
                        //TODO: when there is no user name password, this error thowing crashes the app, lets catch this
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    });
                });

            };
        });
});


// @route   POST api/user/login
// @desc    checks if the user enters correct password and returns a JWT token
// @access  public
router.post("/login",(req,res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then( user => {
        if(!user) {
            errors.email = "User not found";
            return res.status(404).json(errors);
        }

        //check plain text password with hashed password
        bcryptjs.compare(password, user.password).then( isMatch => {
            if(isMatch){
                //send down the signed jason web token back to the client
                const payload = {id: user.id, name: user.name, avatar: user.gravatar};

                jwt.sign(payload, secret.mySecretKey, {expiresIn: 3600}, (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
                
            } else {
                errors.password = "invalid password"
                return res.status(400).json(errors);
            }

        });
    });
});

// @route   GET api/user/current
// @desc    returns current user info if it gets a valid token
// @access  private method protected by passport authentication
router.get('/current', 
    passport.authenticate('jwt', {session:false}), (req,res) => {
        res.json({ 
            "id": req.user.id,
            "email": req.user.email,
            "avatar": req.user.avatar
        });
    }
);








module.exports = router;