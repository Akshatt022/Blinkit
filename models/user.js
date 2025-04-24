const mongoose = require('mongoose');
const Joi = require('joi');

// Address Sub-Schema and Validation
const AddressSchema = new mongoose.Schema({
  address: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 200
  },
  state: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  city: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  pincode: { 
    type: Number, 
    required: true,
    min: 100000,
    max: 999999
  }
});

// Main User Schema
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  },
  password: { 
    type: String, 
    
    minlength: 8
  },
  phone: { 
    type: String, 
    match: /^[6-9]\d{9}$/
  },
  addresses: [AddressSchema]
}, { 
  timestamps: true 
});

// Joi Validation Schema
const userJoiSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required(),
  
  email: Joi.string()
    .email()
    .required(),
  
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .message('Password must include uppercase, lowercase, number, and special character')
    .required(),
  
  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .message('Invalid phone number')
    .required(),
  
  addresses: Joi.array().items(Joi.object({
    address: Joi.string()
      .min(5)
      .max(200),
    
    state: Joi.string()
      .min(2)
      .max(50)
      .required(),
    
    city: Joi.string()
      .min(2)
      .max(50)
      .required(),
    
    pincode: Joi.number()
      .min(100000)
      .max(999999)
      .required()
  }))
});

// Validation Function
const validateUser = (user) => {
  return userJoiSchema.validate(user);
};

// Create Mongoose Model
const userModel = mongoose.model('user', UserSchema);

module.exports = {
  userModel,
  validateUser
};