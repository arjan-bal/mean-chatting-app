const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  // unique is not for validation, it helps mongoose and mongoDB in internal optimisations
  email: { type: String, required: true, unique:true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Post', postSchema);
