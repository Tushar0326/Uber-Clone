const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }

    const { firstname, lastname, email, password, colour, plate, capacity, vehicleType } = req.body


    const isCaptainAlreadyExist = await captainModel.findOne({email});

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    const hashedPassword = await captainService.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname:fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        colour,
        plate,
        capacity,
        vehicleType
    });

    const token= captain.generateAuthToken();
    res.status(201).json({ token, captain });

}


module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors:errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({email}).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.updateCaptainProfile = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logged out successfully' });
}