const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Review } = require('../../db/models');

const router = express.Router();

//get all reviews of current user
router.get('/current', requireAuth, async (req,res) => {
  const {user} = req;
  const currentUserId = user.id;
  const reviews = await Review.findAll({where: {userId: currentUserId}})
  return res.json({'Reviews': reviews});
})

module.exports = router;