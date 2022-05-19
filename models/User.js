const { Schema, model } = require('mongoose');

// Schema to create a user model
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validateEmail, 'Please fill a valid email address'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thoughts'

    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }]
     
    },

  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

const Course = model('users', userSchema);

module.exports = Course;
