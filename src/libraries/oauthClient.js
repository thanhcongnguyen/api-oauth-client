const jwt = require('jsonwebtoken');
import {
    AuthorizationError
} from '../middlewares/errors';
import axios from 'axios';
const hostname = 'https://wecantalk.vn/api';
const config = {
    client_id: '123456',
    client_secret: 'Aa@123456',
    grant_type: 'authorization_code',
    code: 'read write',
    redirect_uri: 'https://petplus.vn',
}
export class OauthClient{
    static signJWT(payload, secretKey, options = {}){
        const token = jwt.sign(payload, secretKey, options);
        return token;
    }

    static verifyJWT(jwtString, secretKey){
        let decoded = null;
        try {
            decoded = jwt.verify(jwtString, secretKey);
        } catch(err) {
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }
        return decoded;
    }

    static getToken(){
        return axios.post(`${hostname}/token/`, {
            client_id: config.client_id,
            client_secret: config.client_secret,
            grant_type: config.grant_type,
            code: config.code,
            redirect_uri: config.redirect_uri,
        });
    }

    static sharePost(accessToken, content){
        let config = {
            headers: {
                authorization: 'Bearer ' + accessToken
            },
            data: {
                content
            }
        }
        return axios.post(`${hostname}/post/share`, config);
    }
}