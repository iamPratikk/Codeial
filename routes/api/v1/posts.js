const express = require('express');
const router = express.Router();
const passport = require('passport')
const postApiController = require('../../../controllers/api/v1/posts_api');

router.get('/', passport.authenticate('jwt',{session:false}) , postApiController.index);
router.delete('/destroy/:id', passport.authenticate('jwt',{session:false}) ,postApiController.destroy);


module.exports = router;