import _ from 'lodash';
import db from '../../models';
import { ValidationError } from '../middlewares/errors';

export class PostService{
    create({ content, title, thumbnail}){
        if(!content){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        return db.Post.create({
                content,
                title,
                thumbnail
        });  
    }

    delete({ id }){
        if(!id){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        return db.Post.destroy({
            where: {
               id 
            }
        });
    }

    share({ id }){
        if(!id){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        return db.Post.findOne({
            where: { id }
        }).then( post => {
            if(!post){
                throw new ValidationError({
                    error: 'post find not found!'
                });
            }
            console.log('post', post);
        })
    }

    getPosts(){
        return db.Post.findAll();
    }
}


