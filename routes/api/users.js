const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');

// @route POST /api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
  const {errors,isValid} = validateRegisterInput(req.body);
  if (!isValid)
  {
    return res.status(400).json(errors);
    }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }
      else {

        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar,
          academy_name: req.body.academy_name,
          bootcamp_name: req.body.bootcamp_name,
          bootcamp_year: req.body.bootcamp_year,
          bootcamp_city: req.body.bootcamp_city,
          bootcamp_state: req.body.bootcamp_state
        });
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err))
          })
        })

      }
    })
    
    .catch();
})

// @route POST /api/users/login
// @desc user login
// @access Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find the user with email
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ email: 'User not found' });
      }

      //Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            // if user match
            const payload = { id: user.id, name: user.name, avatar: user.avatar };
            
            // sign token
            jwt.sign(
              payload,
              keys.secretOrKey,
              { expiresIn: 3600 },
              (err, token) => {
                return res.json({token: 'Bearer '+token})
              }
            )
          }
            else 
            {
              return res.status(404).json({ password: 'Password incorect' });
            }
            
          
        })
        .catch(err => console.log(err));

    })
    .catch();

})

// @route GET /api/users/current
// @desc Return the current user
// @access Private

router.get('/current',
  passport.authenticate('jwt', {session:false}),
  (req, res) => {
    return res.json(req.user);
  }
)


module.exports = router;