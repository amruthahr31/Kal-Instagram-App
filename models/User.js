const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required:true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  academy_name: {
    type: String,
    required: true
  },
  bootcamp_name: {
    type: String,
    required: true
  },
  bootcamp_year: {
    type: Number,
    required: true
  },
  bootcamp_city: {
    type: String,
    required: true
  },
  bootcamp_state:
  {
    type: String,
    required: true
  }
});

module.exports = User = mongoose.model('users', UserSchema);


