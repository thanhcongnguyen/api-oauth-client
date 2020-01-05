const express = require('express');
const router = express.Router();


//import middleware
import { errorMiddleware } from '../middlewares/errorMiddleware';


//import controller
import { 
    PostController
} from '../controllers/post.controller';
const post = new PostController();

// router.post('/create', post.create);
router.post('/create', post.create);
router.delete('/delete', post.delete);
router.post('/share', post.share);
router.get('/all', post.getPosts);
router.use(errorMiddleware);
module.exports = router;