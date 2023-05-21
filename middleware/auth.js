const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


const auth = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    try {
        if (!token) {
            return res.sendStatus(401);
        }
        const data = jwt.verify(token, process.env.SECRET_KEY);
        if (!data) {
            return res.sendStatus(403);
        }
        const user = await User.findOne({ _id: data._id, 'token': token });

        if (!user) {
            throw new Error("User doesn't exists");
        }

        req.user = user
        req.token = token
        next();
    } catch (error) {
        res.status(401).send({ error: 'Not authorized' });
    }
});

module.exports = auth