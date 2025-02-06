const mongoose = require('mongoose');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength:[3, 'First name must be at least 3 characters long'],
        },
        lastname: {
            type: String,
            minlength:[3, 'Last name must be at least 3 characters long'],
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/\S+@\S+\.\S+/, 'Invalid email'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    vehicle: {
        colour:{
            type: String,
            required: true,
            minlength:[3, 'Colour must be at least 3 characters long'],
        },
        plate : {
            type: String,
            required: true,
            minlength:[3, 'Plate must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
        },
        vehicleType: {
            type: String,
            enum: ['car', 'motorcycle', 'auto'],
            required: true,
        }
    },
    location: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        },
    }
});

captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

captainSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(Password, this.password);
}

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain', captainSchema);

module.exports = captainModel;



