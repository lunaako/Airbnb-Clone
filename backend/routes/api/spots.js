const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

//import check function and handleValidationError function for validating signup
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

//get all spots
router.get('/', async (req, res)=> {
  const spots = await Spot.findAll();
  // add avgRating and previewImg to response body when reviews table's created
  res.status(200);
  return res.json({'Spots': spots});
});

//create a new spot 
router.post('/', requireAuth, async(req, res) => {
  const { user } = req;
  const {address, city, state, country, lat, lng, name, description, price} = req.body;
  try{
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
  
    res.status(201).json(newSpot);
  } catch(err) {
    return res.json({errors: err.errors});
  }
})



module.exports = router;