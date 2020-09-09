const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');

router.get("/test", (req, res) => res.json({ msg: 'users works' }));

// @route POST /api/users/register
// @desc Register user
// @access Public
router.post('/register', (req, res) => {
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



module.exports = router;