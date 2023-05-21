const express = require('express');
const router = express.Router();
const {
    registerUser,
    getUsers,
    deleteUserById,
    getUserById,
    updateUserById,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
} = require('../controllers/userController');
const auth = require('../middleware/auth');


router.route('/')
    .get(auth, getUsers);

router.route('/register')
    .post(registerUser);

router.route('/:userId')
    .get(auth, getUserById)
    .delete(auth, deleteUserById)
    .put(auth, updateUserById);

router.route('/login')
    .post(loginUser);

router.route('/user/logout')
    .post(auth, logoutUser);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/reset-password/:token')
    .post(resetPassword);

module.exports = router;