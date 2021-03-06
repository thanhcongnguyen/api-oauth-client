import _ from 'lodash';
import db from '../../models';
import { ValidationError, AuthorizationError } from '../middlewares/errors';
import { OauthClient } from '../libraries/oauthClient';

export class PostService{
    
    create({ content, title, thumbnail, accessToken }){

        if(!accessToken){
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }

        let decoded = OauthClient.verifyJWT(accessToken, 'wecantalk.vn')
        console.log('decoded', decoded);
        if(!decoded){
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }

        if(!content){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        return db.Post.create({
                content,
                title,
                thumbnail,
                created_by: decoded.user_id
        });  
    }

    delete({ id, accessToken }){
        if(!accessToken){
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }

        let decoded = OauthClient.verifyJWT(accessToken, 'wecantalk.vn')
        if(!decoded){
            throw new AuthorizationError({
                error: 'invalid access_token'
            })
        }

        if(!id){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }

        return db.Post.destroy({
            where: {
               id,
               created_by: `${decoded.user_id}`
            }
        });
    }

    getPosts({ accessToken }){
        if(!accessToken){
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }

        let decoded = OauthClient.verifyJWT(accessToken, 'wecantalk.vn')
        if(!decoded){
            throw new AuthorizationError({
                error: 'invalid access_token'
            })
        }

        return db.Post.findAll({
            where: {
                created_by: `${decoded.user_id}`
            },
            order: [
                ['id', 'DESC']
            ],
        });
    }
}


