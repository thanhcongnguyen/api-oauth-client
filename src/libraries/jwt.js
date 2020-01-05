const CryptoJS = require("crypto-js");
const jws = require('jws');

export function generateJWT(payload, secretOrPrivateKey, options){
    if(!payload || !secretOrPrivateKey){
        return {
            error: true,
            message: 'invalid parameters'
        }
    }
    let header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    if(options && options.alg){
        header.alg = options.alg;
    }
    let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    let encodedHeader = base64url(stringifiedHeader);

    let data = {};
    Object.assign(data, payload);
    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    let encodedPayload = base64url(stringifiedData);

    let token = encodedHeader + "." + encodedPayload;
    let signature = CryptoJS.HmacSHA256(token, secretOrPrivateKey);
        signature = base64url(signature);
    let signedToken = token + "." + signature;
    return signedToken;
}

export function verifyJWT(jwtString, secretOrPrivateKey, options){
      let parts = jwtString.split('.');
      if (parts.length !== 3){
        return {
            error: true,
            name: 'jwtError',
            message: 'jwt malformed'
        }
      }
    
      
      let decodedToken = decode(jwtString, { complete: true });
      if (!decodedToken) {
        return {
            error: true,
            name: 'jwtError',
            message: 'invalid token'
        }
      }
    
      let header = decodedToken.header;
      let hasSignature = parts[2].trim() !== '';
      if (!hasSignature && secretOrPrivateKey){
        return {
          error: true,
          name: 'jwtError',
          message: 'jwt signature is required'
        }
      }
  
      if (hasSignature && !secretOrPrivateKey) {
        return {
          error: true,
          name: 'jwtError',
          message: 'secret or public key must be provided'
        }
      }
  
      if(decodedToken.header.alg !== 'HS256'){
          return {
              error: true,
              name: 'jwtError',
              message: 'invalid algorithm'
          }
      }
  
      let valid = jws.verify(jwtString, decodedToken.header.alg, secretOrPrivateKey);
  
      
      if (!valid) {
          return {
              error: true,
              name: 'jwtError',
              message: 'invalid signature'
          }
      }
  
      let payload = decodedToken.payload;
      if (options && options.complete === true) {
        let signature = decodedToken.signature;
  
        return done(null, {
          header: header,
          payload: payload,
          signature: signature
        });
      }
  
      return payload 
}


function base64url(source) {
    let encodedSource = CryptoJS.enc.Base64.stringify(source);// Encode in classical base64
    encodedSource = encodedSource.replace(/=+$/, '');// Remove padding equal characters
    encodedSource = encodedSource.replace(/\+/g, '-');// Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\//g, '_');
    return encodedSource;
}

function decode(jwt, options){
    options = options || {};
    var decoded = jws.decode(jwt, options);
    if (!decoded) { return null; }
    var payload = decoded.payload;
    if(typeof payload === 'string') {
      try {
        var obj = JSON.parse(payload);
        if(obj !== null && typeof obj === 'object') {
          payload = obj;
        }
      } catch (e) { }
    }
    if (options.complete === true) {
      return {
        header: decoded.header,
        payload: payload,
        signature: decoded.signature
      };
    }
    return payload 
}
