const express = require('express');
const router = express.Router();
//import routes
const usersRouter = require('./user.route');
const postRouter = require('./post.route');

router.use('/user', usersRouter);
router.use('/post', postRouter);

module.exports = router;