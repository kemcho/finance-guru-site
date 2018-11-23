const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcryptjs = require('bcryptjs');


// @route   GET api/users/test
// @desc    test route to see if everything is working fine
// @access  public
router.get('/test', (req,res) => res.json({msg:'Users works'}));

const User = require('../../models/User');

// @route   POST api/users/post
// @desc    register a new user or throw an error if user exists
// @access  public
router.post('/register', (req,res) => {
    User.findOne({email: req.body.email})
        .then( user => {
            if(user) {
                return res.status(400).json({email: "User Already exists"});
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


module.exports = router;