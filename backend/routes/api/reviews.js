const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Review, User, Spot } = require('../../db/models');

const router = express.Router();

const validateReview = [
  check('review')
    .if(check('review').exists()).isLength({min: 1})
    .withMessage('Review text is required'),
  check('stars')
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
handleValidationErrors
];

//get all reviews of current user
router.get('/current', requireAuth, async (req,res) => {
  const {user} = req;

  if (user) {
    const currentUserId = user.id;
    const reviews = await Review.findAll({
      where: {
        userId: currentUserId
      },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }, {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        }
      }]})
    // add ReviewImage in include later
    return res.json({'Reviews': reviews});
  }
});

//edit review
router.put('/:reviewId', requireAuth, validateReview, async(req,res) => {
  const {reviewId} = req.params;
  const { user } = req;
  const currentUserId = user.id;

  const thisReview = await Review.findByPk(reviewId);
  const reviewUserId = thisReview.userId;

  if (thisReview) {
    if (+currentUserId === +reviewUserId) {
      await thisReview.update(req.body);
      return res.json(thisReview);
    } else {
      res.status(403).json({
        "message": "Forbidden"
      })
    }
  } else {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found"
    });
  }
})

module.exports = router;