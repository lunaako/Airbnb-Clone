const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

//import check function and handleValidationError function for validating signup
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//make a middleware to check and validate keys
const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Username is required'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
  .exists({ checkFalsy: true })
  .withMessage('First Name is required'),
  check('lastName')
  .exists({ checkFalsy: true })
  .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    const isEmailExisted = await User.findAll({where: {email}});
    const isUsernameExisted = await User.findAll({where: {username}});

    if (isEmailExisted.length || isUsernameExisted.length) {
      const errs = {};

      if (isEmailExisted.length) {
        errs.email = "User with that email already exists"
      };

      if (isUsernameExisted.length) {
        errs.username = "User with that username already exists"
      };

      return res.status(500).json({
        "message": "User already exists",
        "errors": errs
      })
    };

    const user = await User.create({ email, username, firstName, lastName, hashedPassword });

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);
    res.status(201);
    return res.json({
      user: safeUser
    });
  }
);

module.exports = router;