const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, User, Spot } = require('../../db/models');

const router = express.Router();

// const validateReview = [
//   check('review')
//     .if(check('review').exists()).isLength({min: 1})
//     .withMessage('Review text is required'),
//   check('stars')
//     .isInt({min: 1, max: 5})
//     .withMessage('Stars must be an integer from 1 to 5'),
// handleValidationErrors
// ];

module.exports = router;