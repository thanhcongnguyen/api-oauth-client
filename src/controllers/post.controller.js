import { PostService } from '../services/post.service';
const post = new PostService();

export class PostController{
    create(req, res, next){
        const { content, title, thumbnail } = req.body;
        return post.create({
            content,
            title,
            thumbnail
        }).then( postRes => {
            res.status(200).send({
                data: postRes,
				status: true
			});
        }).catch( err => {
            next(err);
        });
    }

    delete(req, res, next){
        const { id } = req. body;
        return post.delete({
            id
        }).then( () => {
            res.status(200).send({
				status: true
			});
        }).catch( err => {
            next(err);
        })
    }

    share(req, res, next){
        const { id } = req.body;
        return post.share({
            id
        }).then( () => {
            res.status(200).send({
				status: true
			});
        }).catch( err => {
            next(err);
        })
    }

    getPosts(req, res, next){
        return post.getPosts()
        .then( posts => {
            res.status(200).send({
                data: posts,
				status: true
			});
        }).catch( err => {
            next(err);
        })
    }
}