const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');

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

    const bookingsPlus = [];
    for (let booking of bookings) {
      let spot = booking.Spot

      const previewImg = await SpotImage.findOne({
        where: {
          spotId: spot.id,
          preview: true
        },
        attributes: ['url']
      })

      const bookingPlus = booking.toJSON();
      const spotPlus = bookingPlus.Spot
      if (previewImg) spotPlus.previewImage = previewImg.url;

      bookingsPlus.push(bookingPlus);
    }
    return res.json({'Bookings': bookingsPlus});
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

  const bookings = await Booking.findAll({
    where: {
      spotId: spotId,
      id: {
        [Op.ne]: thisBooking.id
      },
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [newStartDate, newEndDate]
          }
        },
        {
          endDate: {
            [Op.between]: [newStartDate, newEndDate]
          }
        },
        {
          [Op.and]: [
            {
              startDate: {
                [Op.lte]: newStartDate
              }
            },
            {
              endDate: {
                [Op.gte]: newEndDate
              }
            }
          ]
        }
      ]
    }
  });

  let errors = {};

  for (let booking of bookings) {
    if (newStartDate >= booking.startDate && newStartDate <= booking.endDate) {
      errors.startDate = "Start date conflicts with an existing booking";
    }
    if (newEndDate >= booking.startDate && newEndDate <= booking.endDate) {
      errors.endDate = "End date conflicts with an existing booking";
    }
    if (newStartDate < booking.startDate && newEndDate > booking.endDate) {
      errors.startDate = "Start date conflicts with an existing booking";
      errors.endDate = "End date conflicts with an existing booking";
    }
  }

  if (Object.keys(errors).length) {
    return res.status(403).json({
      message: 'Sorry, this spot is already booked for the specified dates',
      errors
    });
  } else {
    await thisBooking.update(req.body);
    return res.json(thisBooking);
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