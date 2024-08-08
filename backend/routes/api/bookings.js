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
      return true;
    }),
  check('endDate')
    .custom(async (value, { req }) => {
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
  const {bookingId} = req.params;
  const { user } = req;
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

  const spotId = thisBooking.spotId;
  const { startDate, endDate } = req.body;
  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);
  const bookingStartConflict = await Booking.findOne({
    where: {
      spotId: spotId,
      userId: {
        [Op.ne]: user.Id
      },
      [Op.or]: [
        {
          [Op.or]: [
            {
              startDate: newStartDate
            },
            {
              endDate: newStartDate
            }
          ]
        },
        {
          [Op.and]: [ // startDate < newStart < endDate
            {
              startDate: {
                [Op.lt]: newStartDate
              }
            },
            {
              endDate: {
                [Op.gt]: newStartDate
              }
            }
          ]
        },
      ]
    }
  });

  const bookingEndConflict = await Booking.findOne({
    where: {
      spotId: spotId,
      userId: {
        [Op.ne]: user.Id
      },
      [Op.or]: [
        {
          [Op.or]: [
            {
              startDate: newEndDate
            },
            {
              endDate: newEndDate
            }
          ]
        },
        {
          [Op.and]: [ // startDate < newEnd < endDate
            {
              startDate: {
                [Op.lt]: newEndDate
              }
            },
            {
              endDate: {
                [Op.gt]: newEndDate
              }
            }
          ]
        }
      ]
    }
  });

  const bookingBothConflict = await Booking.findOne({
    where: {
      spotId: spotId,
      userId: {
        [Op.ne]: user.Id
      },
      // [Op.or]: [
      //   {
          [Op.and]: [ // newStart < startDate < endDate < newEnd
            {
              startDate: {
                [Op.gt]: newStartDate
              }
            },
            {
              endDate: {
                [Op.lt]: newEndDate
              }
            }
          ]
      //   },
      //   {
      //     [Op.and]: [ // startDate < newStart < newEnd < endDate
      //       {
      //         startDate: newStartDate
      //       },
      //       {
      //         endDate: newEndDate
      //       }
      //     ]
      //   }
      // ]
    }
  });

  let message = 'Sorry, this spot is already booked for the specified dates';
  let errors = {};

  if (bookingStartConflict) {
    errors.startDate = "Start date conflicts with an existing booking";
  }

  if (bookingEndConflict) {
    errors.startDate = undefined;
    errors.endDate = "End date conflicts with an existing booking";
  }

  if (bookingBothConflict) {
    errors.startDate = "Start date conflicts with an existing booking";
    errors.endDate = "End date conflicts with an existing booking";
  }

  if (bookingStartConflict && bookingEndConflict) {
    errors.startDate = "Start date conflicts with an existing booking";
    errors.endDate = "End date conflicts with an existing booking";
  }

  if (newStartDate > thisBooking.startDate && newEndDate > thisBooking.endDate) {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
  }
  if (newStartDate === thisBooking.startDate && newEndDate > thisBooking.endDate) {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
  }
  if (newStartDate > thisBooking.startDate && newEndDate === thisBooking.endDate) {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
  }
  if (newStartDate === thisBooking.startDate && newEndDate === thisBooking.endDate) {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
  }

  if (!errors.startDate && !errors.endDate) {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
  } else {
    return res.status(403).json({
      message,
      errors
    })
  }
});

router.delete('/:bookingId', requireAuth, async(req, res) => {
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
  if (new Date(thisBooking.startDate) < new Date()) {
    return res.status(403).json({
      "message": "Bookings that have been started can't be deleted"
    })
  }
  await thisBooking.destroy();
  return res.json({
    "message": "Successfully deleted"
  })
})

module.exports = router;