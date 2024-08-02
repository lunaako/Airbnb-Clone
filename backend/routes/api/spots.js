const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

//import check function and handleValidationError function for validating signup
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

router.get('/', async (req, res)=> {
  const spots = await Spot.findAll();
  // add avgRating to response body when reviews table's created
  res.status(200);
  return res.json({'Spots': spots});
})


module.exports = router;