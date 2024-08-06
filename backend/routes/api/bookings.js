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
    .custom(async (value, { req }) => {
      const startDate = new Date(value);
      if (startDate < new Date()) {
        throw new Error('startDate cannot be in the past');
      }

      const {bookingId} = req.params;
      const { endDate } = req.body;
      if (endDate) {
        const end = new Date(endDate);
        const thisBooking = await Booking.findByPk(bookingId);
        const conflictingBookings = await Booking.findAll({
          where: {
            spotId: thisBooking.spotId,
            startDate: {
              [Op.lt]: end
            },
            endDate: {
              [Op.gt]: startDate
            }
          }
        });

        if (conflictingBookings.length > 0) {
          throw new Error('Start date conflicts with an existing booking');
        }
      }
      return true;
    }),
  check('endDate')
    .custom(async (value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      if (endDate <= startDate) {
        throw new Error('endDate cannot be on or before startDate');
      }
      const { bookingId } = req.params;
      const thisBooking = await Booking.findByPk(bookingId);
      if (startDate) {
        const conflictingBookings = await Booking.findAll({
          where: {
            spotId: thisBooking.spotId,
            startDate: {
              [Op.lt]: endDate
            },
            endDate: {
              [Op.gt]: startDate
            }
          }
        });

        if (conflictingBookings.length > 0) {
          throw new Error('End date conflicts with an existing booking');
        }
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
    return res.status(404).json({
      "message": "Booking couldn't be found"
    });
  }

  if (+user.id !== +thisBooking.userId) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }

  if (new Date(thisBooking.endDate) < new Date()) {
    return res.status(403).json({
      "message": "Past bookings can't be modified"
    })
  }

  await thisBooking.update(req.body);
  return res.json(thisBooking);
})

module.exports = router;