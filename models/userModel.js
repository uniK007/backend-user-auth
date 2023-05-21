const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 100,
        validate: {
            validator: age => age >= 18,
            message: props => `${props.age} is under age.`
        }
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        sparse: true,
        validate: {
            validator: function (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: props => `${props.value} is not a valid email address`
        }
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                const phoneRegex = /^\d{10}$/;
                return phoneRegex.test(v);
            },
            message: props => `${props.value} is not a valid phone number`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

// generate JWT token for user
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY);
    user.token = token;
    await user.save();
    return token;
};

userSchema.methods.isValidPassword = async function (password) {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

module.exports = mongoose.model('User', userSchema);
