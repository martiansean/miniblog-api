const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ username: req.body.username }).then(user => {
    errors.error = true
    if (user) {
      errors.text = 'Username already exists';
      // console.log(errors)
      return res.json(errors);
    } else {
      const newUser = new User({
        username: req.body.username,
      });
      // console.log(`Username is ${newUser.username}`)
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.username, salt, (err, hash) => {
          if (err) throw err;
          // console.log(`User.username : ${newUser.username}` )
          // console.log(`Password is ${hash}`)
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.json(errors);
  }

  const username = req.body.username;
  const password = req.body.password;
  // console.log(`entered password ${password}`)
  errors.error = true
  // Find user by email
  User.findOne({ username }).then(user => {
    // Check for user
    if (!user) {
      errors.username = 'User not found';
      return res.json(errors);
    }

    // Check Password
    bcrypt.compare(user.username,password).then(isMatch => {
      if (isMatch) {
        // User Matched
        // const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload
        const payload = { id: user.id, username: user.username }; // Create JWT Payload
        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: '1 days' },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      username: req.user.username
    });
  }
);

module.exports = router;
