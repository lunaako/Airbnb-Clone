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

// const checkBookings = [
//   check('startDate')
//     .custom(async (value, { req }) => {
//       const { startDate, endDate } = req.body;
//       if (startDate) {
//         const conflictingBookings = await Booking.findAll({
//           where: {
//             spotId: thisBooking.spotId,
//             startDate: {
//               [Op.lt]: startDate
//             },
//             endDate: {
//               [Op.gt]: startDate
//             }
//           }
//         })
//       }
//     }),
//   check
// ]

// try {
//   const { startDate, endDate } = req.body;
//   if (startDate) {
//     const conflictingBookings = await Booking.findAll({
//       where: {
//         spotId: thisBooking.spotId,
//         startDate: {
//           [Op.lt]: startDate
//         },
//         endDate: {
//           [Op.gt]: startDate
//         }
//       }
//     });

//     if (conflictingBookings.length > 0) {
//       const err = new Error('Start date conflicts with an existing booking');
//       errs.startDate = err;
//       throw err;
//     }
//   }

//   if (endDate) {
//     const conflictingBookings = await Booking.findAll({
//       where: {
//         spotId: thisBooking.spotId,
//         startDate: {
//           [Op.lt]: endDate
//         },
//         endDate: {
//           [Op.gt]: endDate
//         }
//       }
//     });

//     if (conflictingBookings.length > 0) {
//       const err = new Error('End date conflicts with an existing booking');
//       throw err;
//     }
//   }

// } catch(err) {
//   return res.json({
//     "message": "Sorry, this spot is already booked for the specified dates",
//     "errors": err.message
//   })
// }

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
  const bookingsForSameSd = await Booking.findAll({
    where: {
      spotId: spotId,

      [Op.and]: [
        {
          startDate: {
            [Op.lte]: startDate
          }
        },
        {
          endDate: {
            [Op.gt]: startDate
          }
        }
      ]
    }
  });

  const bookingsForSameEd = await Booking.findAll({
    where: {
      spotId: spotId,

      [Op.and]: [
        {
          startDate: {
            [Op.lte]: endDate
          }
        },
        {
          endDate: {
            [Op.gte]: endDate
          }
        }
      ]
    }
  });

  let message = 'Sorry, this spot is already booked for the specified dates';
  let errors = {};

  if (bookingsForSameSd.length || bookingsForSameEd.length) {

    if (bookingsForSameSd.length && bookingsForSameEd.length) {
      errors.endDate = "End date conflicts with an existing booking";
      errors.startDate = "Start date conflicts with an existing booking";

    } else if (bookingsForSameEd.length) {
      errors.endDate = "End date conflicts with an existing booking";

    } else {
      errors.startDate = "Start date conflicts with an existing booking";
    }

    return res.status(403).json({
      message,
      errors
    })
  };

  await thisBooking.update(req.body);
  return res.json(thisBooking);
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
  res.json({
    "message": "Successfully deleted"
  })
})

module.exports = router;