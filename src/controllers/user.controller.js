import { UserService } from '../services/user.service';
import { ValidationError } from '../middlewares/errors';
import { hostname } from '../configs/constants';
const user = new UserService();

export class UserController{
    register(req, res, next){
        const { email, password } = req.body;
		user.register({
            password,
            email,
		}).then( user => {
			res.status(200).send({
				data: {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    lastName: user.lastName,
                    firstName: user.firstName,
                    avatar: user.avatar
                },
				status: true
			});
		}).catch(err => {
			next(err);
		});
    }
    
    loginOauth(req, res, next){
        const { email, password, response_type, client_id, redirect_uri, scope, state } = req.body;
        return user.loginOauth({
            email,
            password,
            response_type,
            client_id,
            redirect_uri,
            scope,
            state
        }).then( user => {
            res.status(200).send({
                data:{
                    code: user.code,
                    state: user.state
                },
                status: true
            });
        }).catch( err => {
            next(err);
        });

    }


    userLogin(req, res, next){
        const { email, password } = req.body;
        console.log('req.body', req.body);
        return user.userLogin({
            email, 
            password
        }).then( response => {
            res.status(200).send({
				data: {
                    access_token: response.access_token,
                    token_type: response.token_type,
                    expires_in: response.expires_in,
                    refresh_token: response.refresh_token,
                    scope: response.scope,
                },
				status: true
			});
        }).catch( err => {
            next(err);
        })
    }

    getUserInfo(req, res, next){
        const access_token  = req.headers['authorization'];
        console.log('access_token', access_token);
        return user.getUserInfo({
            access_token
        }).then( user => {
            res.status(200).send({
                data: {
                    lastName: user.lastName,
                    firstName: user.firstName,
                    phone: user.phone,
                    address: user.address,
                    email: user.email,
                    avatar: user.avatar
                },
                status: true
            });
        }).catch( err => {
            next(err);
        });
    }


    updateUserInfo(req, res, next){
        const { lastName, firstName, phone, address } = req.body;
        const file = req.file;
        const access_token  = req.headers['authorization'];
        return user.updateUserInfo({
            lastName, 
            firstName, 
            phone,
            address,
            avatar: hostname + file.path,
            access_token
        }).then( info => {
            res.status(200).send({
                data: {
                    lastName: info.lastName,
                    firstName: info.firstName,
                    phone: info.phone,
                    address: info.address,
                    email: info.email,
                    avatar: info.avatar
                },
                status: true
            });
        }).catch( err => {
            next(err);
        });
    }
}