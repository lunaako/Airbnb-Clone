const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, Spot } = require('../../db/models');

const router = express.Router();

const validateBooking = [
  check('startDate')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('startDate cannot be in the past');
      }
      return true;
    }),
  check('endDate')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('endDate cannot be on or before startDate');
      }
      return true;
    }),
  handleValidationErrors
];

//get all bookings from current user
router.get('/current', requireAuth, async (req,res) => {
  const {user} = req;

  if (user) {
    const currentUserId = user.id;
    const bookings = await Booking.findAll({
      where: {
        userId: currentUserId
      },
      include: [{
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        }
      }]})
    return res.json({'Bookings': bookings});
  }
});

router.put('/:bookingId', requireAuth, validateBooking, async(req, res)=> {
  const { user } = req;
  const {bookingId} = req.params;
  const thisBooking = await Booking.findByPk(bookingId);

  if (!thisBooking) {
    res.status(404);
    return res.json({
      "message": "Booking couldn't be found"
    });
  }

  if (+user.id !== +thisBooking.userId) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }

  if (new Date(thisBooking.startDate) < new Date()) {
    return res.status(403).json({
      "message": "Past bookings can't be modified"
    })
  } else {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
  }
})

module.exports = router;