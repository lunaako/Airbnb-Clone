const express = require('express');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, User, ReviewImage, Booking, SpotImage} = require('../../db/models');

//import check function and handleValidationError function for validating signup
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkNull: true })
    .isFloat({min: -90, max: 90})
    .withMessage('Latitude must be within -90 and 90'),
  check('lng')
    .exists({ checkNull: true })
    .isFloat({min: -180, max: 180})
    .withMessage('Longitude must be within -180 and 180'),
  check('name')
    .exists({ checkFalsy: true })
    .notEmpty()
    .isLength({min: 1, max: 49})
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .isFloat({min: 1})
    .withMessage('Price per day must be a positive number'),
handleValidationErrors
];

const validateReview = [
  check('review')
    .if(check('review').exists()).isLength({min: 1})
    .withMessage('Review text is required'),
  check('stars')
    .isInt({min: 1, max: 5})
    .withMessage('Stars must be an integer from 1 to 5'),
handleValidationErrors
];

const validateQuery = [
  check('page')
    .optional({ checkFalsy: true })
    .isInt({ min: 1})
    .withMessage('Page must be greater than or equal to 1'),
  check('size')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 20})
    .withMessage('Size must be between 1 and 20'),
  check('minLat')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90})
    .withMessage('Minimum latitude is invalid'),
  check('maxLat')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90})
    .withMessage('Maximum latitude is invalid'),
  check('minLng')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180})
    .withMessage('Minimum longitude is invalid'),
  check('maxLng')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180})
    .withMessage('Maximum longitude is invalid'),
  check('minPrice')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be greater than or equal to 0'),
  check('maxPrice')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be greater than or equal to 0'),
  handleValidationErrors
];

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

//get all spots
  // add avgRating and previewImg to response body when reviews table's created
router.get('/', validateQuery, async (req, res)=> {
  let { page=1, size=20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  page = +page || 1;
  size = +size || 20;

  let where = {};

  if (minLat && maxLat) {
    where.lat = {[Op.between]: [minLat, maxLat]};
  } else if (minLat) {
    where.lat = {[Op.gte]: minLat};
  } else if (maxLat) {
    where.lat = {[Op.lte]: maxLat};
  };

  if (minLng && maxLng) {
    where.lng = {[Op.between]: [minLng, maxLng]};
  } else if (minLng) {
    where.lng = {[Op.gte]: minLng};
  } else if (maxLng) {
    where.lng = {[Op.lte]: maxLng};
  };

  if (minPrice && maxPrice) {
    where.price = {[Op.between]: [minPrice, maxPrice]};
  } else if (minPrice) {
    where.price = {[Op.gte]: minPrice}
  } else if (maxPrice) {
    where.price = {[Op.lte]: maxPrice}
  };

  const spots = await Spot.findAll({
    where,
    limit: size,
    offset: size * (page - 1)
  });

  //add avgRating key & previewImage keys
  const spotsWizRatings = [];

  for (let spot of spots) {

    const reviewCount = await Review.count({
      where: {spotId: spot.id},
    });

    const totalStars = await Review.sum('stars', {
      where: {spotId: spot.id}
    });

    let avgRating = totalStars / reviewCount;

    if (!avgRating) {
      avgRating = null;
    };

    const previewImg = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      },
      attributes: ['url']
    });

    const spotWizRating = spot.toJSON();
    spotWizRating.avgRating = avgRating;
    if(previewImg) {
      spotWizRating.previewImage = previewImg.url;
    } else {
      spotWizRating.previewImage = null;
    }
    spotsWizRatings.push(spotWizRating);

  };
  return res.json({
    'Spots': spotsWizRatings,
    'page': page,
    'size': size
  });
});

//create a new spot
router.post('/', requireAuth, validateSpot, async (req, res) => {
  const { user } = req;
  const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const id = user.id;
    const newSpot = await Spot.create({
      ownerId: id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });

    return res.status(201).json(newSpot);
});

//get all spots owned by the current user
router.get('/current', requireAuth, async(req, res, next) => {
  const { user } = req;
  const ownerId = user.id;

  const spots = await Spot.findAll({where: {ownerId}});

  const spotsWizRatings = [];
  for (let spot of spots) {

    const reviewCount = await Review.count({
      where: {spotId: spot.id},
    });

    const totalStars = await Review.sum('stars', {
      where: {spotId: spot.id}
    });

    let avgRating = totalStars / reviewCount;

    if (!avgRating) {
      avgRating = null;
    };

    const previewImg = await SpotImage.findOne({
      where: {
        spotId: spot.id,
        preview: true
      },
      attributes: ['url']
    });


    const spotWizRating = spot.toJSON();
    spotWizRating.avgRating = avgRating;
    if(previewImg) {
      spotWizRating.previewImage = previewImg.url;
    } else {
      spotWizRating.previewImage = null;
    }
    spotsWizRatings.push(spotWizRating);
  };

  return res.json({
    Spots: spotsWizRatings
  });
});

//get all reviews by a spot's id
router.get('/:id/reviews', async(req, res, next) => {
  const { id: spotId } = req.params;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json(
      {
        "message": "Spot couldn't be found"
      }
    )
  };

  const reviews = await Review.findAll({
    where: { spotId },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName']
    },
    {
      model: ReviewImage,
      attributes: ['id', 'url']
    }]
  })

  return res.json({
    "Reviews": reviews
  });
})

//get details of a spot from an id
router.get('/:id', async(req, res, next) => {
  const { id } = req.params
  const spot = await Spot.findByPk(id, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      }
    ]
  });

  if (spot) {
    const owner = await User.findByPk(spot.ownerId, {
      attributes: ['id', 'firstName', 'lastName']
    });

    const reviewCount = await Review.count({
      where: {spotId: spot.id},
    });

    const totalStars = await Review.sum('stars', {
      where: {spotId: spot.id}
    });

    let avgRating = totalStars / reviewCount;

    if (!avgRating) {
      avgRating = null;
    };

    const spotWizRating = spot.toJSON();
    spotWizRating.numReviews = reviewCount;
    spotWizRating.avgStarRating = avgRating;
    spotWizRating.Owner = owner;

    return res.json(spotWizRating);

  } else {
    return res.status(404).json({
      message: "Spot couldn't be found"
    })
  }
});

//edit a spot
router.put('/:id', requireAuth, validateSpot, async(req, res, next) => {
  const { user } = req;
  const { id:spotId } = req.params;
  const userId = user.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  };

  if (spot.ownerId === userId) {
    await spot.update(req.body);
    return res.json(spot);
  } else {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }

});

//delete a spot
router.delete('/:id', requireAuth, async(req, res, next) => {
  const { id: spotId } = req.params;
  const { user } = req;
  const userId = user.id;
  const spot = await Spot.findByPk(spotId);

  if (!spot) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  }

  if (spot.ownerId === userId) {
    await spot.destroy();
    return res.json({
      "message": "Successfully deleted"
    })

  } else {
    return res.status(403).json({
      "message": "Forbidden"
    })
  }

});

//add an img to a spot based on spot id
router.post('/:id/images', requireAuth, async(req, res, next) => {
  const { id } = req.params;
  const { url, preview } = req.body;
  const { user } = req;
  const spot = await Spot.findByPk(id);

  if (!spot) return res.status(404).json({"message": "Spot couldn't be found"});

  if (user.id !== spot.ownerId) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  };


  const newImg = await spot.createSpotImage({
    url,
    preview
  });

  const newImgInfo = await SpotImage.findByPk(newImg.id, {
    attributes: ['id', 'url', 'preview']
  })

  return res.status(201).json(newImgInfo);
})


//create a review for a spot based on the spot's id
router.post('/:id/reviews', requireAuth, validateReview, async(req, res, next) => {
  const { id } = req.params;
  const{ review, stars } = req.body;
  const { user } = req;
  const userId = user.id;

  const spot = await Spot.findByPk(id);

  if (!spot) {
    return res.status(404).json(
      {
        "message": "Spot couldn't be found"
      }
    )
  };

  const existedReview = await Review.findAll({
    where: {
      userId,
      spotId: id,
    }
  });

  if (existedReview.length) {
    return res.status(500).json({
      "message": "User already has a review for this spot"
    })
  }

  const newReview = await spot.createReview({
    review,
    stars,
    userId
  })

  return res.status(201).json(newReview);
});

//get all bookings for a spot
router.get('/:id/bookings', requireAuth, async(req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const userId = user.id;

  const spot = await Spot.findByPk(id);

  if (!spot) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  };

  let booking;
  if (userId !== spot.ownerId) {
    booking = await Booking.findAll({
      where: {
        spotId: id
      },
      attributes: ['spotId', 'startDate', 'endDate']
    })
  } else {
    booking = await Booking.findAll({
      where: {
        spotId: id
      },
      include: {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    })
  };

  return res.json({
    "Bookings": booking
  })
});

//create a booking from spot
router.post('/:id/bookings', requireAuth, validateBooking, async(req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(id);
  const userId = user.id;

  if (!spot) {
    return res.status(404).json(
      {
        "message": "Spot couldn't be found"
      }
    )
  };

  if (userId === spot.ownerId) {
    return res.status(403).json({
      "message": "Forbidden"
    })
  };

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  const bookings = await Booking.findAll({
    where: {
      spotId: id,
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

  let message = 'Sorry, this spot is already booked for the specified dates';
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

  if (Object.keys(errors).length > 0) {
    return res.status(403).json({
      message,
      errors
    });
  }

  const newBooking = await spot.createBooking({
    userId,
    startDate,
    endDate
  });

  return res.status(201).json(newBooking);
})

module.exports = router;