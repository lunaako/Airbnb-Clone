const router = require('express').Router();

// must be before any other middleware or route handlers
const { restoreUser } = require('../../utils/auth.js');
// if valid current user session, req.user is set to User in db
// if not valid current user session, req.user is set to null
router.use(restoreUser);

module.exports = router;