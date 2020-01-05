import { PostService } from '../services/post.service';
const post = new PostService();

export class PostController{
    create(req, res, next){
        const { content, title, thumbnail } = req.body;
        const accessToken = req.headers['authorization'];
        return post.create({
            content,
            title,
            thumbnail,
            accessToken
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
        const accessToken = req.headers['authorization'];
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
        // const { id } = req.body;
        // const {accessToken} = req.headers['authorization'];
        // return post.share({
        //     id,
        //     accessToken
        // }).then( () => {
        //     res.status(200).send({
		// 		status: true
		// 	});
        // }).catch( err => {
        //     next(err);
        // })
    }

    getPosts(req, res, next){
        const accessToken = req.headers['authorization'];
        console.log('accessToken', accessToken);
        return post.getPosts({
            accessToken
        }).then( posts => {
            res.status(200).send({
                data: posts,
				status: true
			});
        }).catch( err => {
            next(err);
        })
    }
}