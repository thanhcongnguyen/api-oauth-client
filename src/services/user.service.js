import _ from 'lodash';
import db from '../../models';
import { ValidationError, AuthorizationError, AuthenticationError } from '../middlewares/errors';
import { SCOPE } from '../configs/constants';
import { randomString } from '../utils/randomString';
import { TOKEN_KEY } from '../configs/constants';
const jwt = require('jsonwebtoken');


function hashPassword(password) {
    const bcrypt = require('bcrypt');
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

function comparePassword(password, hash) {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(password, hash).then(res => {
        return res;
    }).catch(err => {
        return false;
    })
}

export class UserService {
    register({ email, password }) {
        if (!email || !password) {
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        return db.User.findOne({
            where: { email }
        }).then((user) => {
            if (user) {
                throw new ValidationError({
                    error: 'user exists!'
                });
            } else {
                return db.User.create({
                    email,
                    password: hashPassword(password)
                });
            }
        })
    }

    loginOauth({ email, password, client_id = '', redirect_uri = '', scope = '', response_type = '', state = undefined }) {

        if (!client_id || !redirect_uri || !response_type) {
            throw new ValidationError({
                error: 'invalid_request'
            });
        }

        if (!email || !password) {
            throw new ValidationError();
        }

        return db.User.findOne({
            where: { email }
        }).then(async user => {
            if (!user) {
                throw new ValidationError({
                    error: 'user not exits!'
                })
            }
            let result = await comparePassword(password, user.password);
            if (!result) {
                throw new ValidationError({
                    error: 'invalid password!'
                });
            }

            //check response_type
            if (response_type !== 'code') {
                throw new ValidationError({
                    error: 'unsupported_response_type'
                });
            }

            //check scope
            if (scope) {
                const scopeArr = scope.split(" ");
                const resultScopeDiff = _.difference(scopeArr, SCOPE);
                if (resultScopeDiff.length > 0) {
                    throw new ValidationError({
                        error: 'invalid_scope'
                    });
                }
            }

            return db.Provider.findOne({
                where: { client_id }
            }).then(client => {

                if (!client) {
                    throw new ValidationError({
                        error: 'unauthorized_client'
                    })
                }

                if (client.redirect_uri != redirect_uri) {
                    throw new ValidationError({
                        error: 'error_uri'
                    });
                }
                return db.Code.create({
                    code: randomString(30),
                    client_id,
                    user_id: user.id
                }).then(res => {
                    return {
                        code: res.code,
                        state: state ? state : randomString(20)
                    }
                });
            });

        })
    }

    userLogin({ email, password }){
        if (!email || !password) {
            throw new ValidationError({
                error: 'invalid_request'
            });
        }

        return db.User.findOne({
            where: { email }
        }).then(async user => {
            if (!user) {
                throw new ValidationError({
                    error: 'user not exits!'
                })
            }
            let result = await comparePassword(password, user.password);
            if (!result) {
                throw new ValidationError({
                    error: 'invalid password!'
                });
            }

            let userInfo = {
                user_id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar
            };

            let access_token = jwt.sign(
                userInfo,
                TOKEN_KEY
            );

            let refresh_token = jwt.sign(
                { 
                    user_id: user.id 
                }, 
                TOKEN_KEY
            );

            return {
                access_token,
                token_type: 'bearer',
                expires_in: 3600,
                refresh_token,
                scope: 'read create'
            }

        });
    }

    getUserInfo({ access_token }){
        if(!access_token){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        let decoded = null;
        try {
            decoded = jwt.verify(access_token, TOKEN_KEY);
        } catch(err) {
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }
        return db.User.findOne({
            where: {
                id: decoded.user_id
            }
        }).then( user => {
            if(!user){
                throw new AuthenticationError({
                    error: 'user not exits!'
                });
            }
            return {
                email: user.email,
                phone: user.phone,
                lastName: user.lastName,
                firstName: user.firstName,
                address: user.address.address,
                avatar: user.avatar
            }
        });
    }

    updateUserInfo(data){
        let access_token = data.access_token;

        if(!access_token){
            throw new ValidationError({
                error: 'invalid_request'
            });
        }
        let decoded = null;
        try {
            decoded = jwt.verify(access_token, TOKEN_KEY);
            
        } catch(err) {
            throw new AuthorizationError({
                error: 'invalid access_token'
            });
        }

        return db.User.findOne({
            where: {
                id: decoded.user_id
            }
        }).then( user => {
            if(!user){
                throw new AuthenticationError({
                    error: 'user not exits!'
                });
            }
            console.log('userrrr', user);
            if(user){
                return user.update({
                    lastName: data.lastName,
                    firstName: data.firstName,
                    address: data.address,
                    phone: data.phone,
                    avatar: data.avatar
                });
            }
        });
    }
}


