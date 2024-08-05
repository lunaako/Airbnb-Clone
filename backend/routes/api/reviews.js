const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Review, User, Spot } = require('../../db/models');

const router = express.Router();

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
router.put('/:reviewId', requireAuth, async (req,res) => {
  const {review, stars} = req.body;
  const {reviewId} = req.params;
  const currentUserId = user.id;

  const thisReview = await Review.findByPk(reviewId);
  const reviewUserId = this.Review.userId;

  if (thisReview) {
    if (+currentUserId === +reviewUserId) {
      this.Review.review = review;
      this.Review.stars = stars;
      return res.json(thisReview);
    }
  } else {
    res.status(404);
    return res.json({
      "message": "Review couldn't be found"
    });
  }
})

module.exports = router;