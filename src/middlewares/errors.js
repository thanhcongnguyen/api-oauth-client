export class ApplicationError extends Error {
	constructor(message = 'Internal Service Error!'){
		super(message);
		this.name = this.constructor.name;
		this.error = 'server_error';
		this.status = 500;
		Error.captureStackTrace(this, ApplicationError);
	}
}

export class AuthenticationError extends ApplicationError {
	constructor({message= 'Authentication Error!', error = ''}) {
		super(message);
		this.name = this.constructor.name;
		this.error = error;
		this.status = 401;
	}
}


export class AuthorizationError extends ApplicationError {
	constructor({message= 'Authorization Error!', error = ''}) {
		super(message);
		this.name = this.constructor.name;
		this.error = error;
		this.status = 403;
	}
}

export class ValidationError extends ApplicationError {
	constructor({message= 'Bad request!', error = ''}) {
		super(message);
		this.name = this.constructor.name;
		this.error = error;
		this.status = 400;
	}
}