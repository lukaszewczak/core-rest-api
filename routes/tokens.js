const _data = require('../lib/data');
const helpers = require('../lib/helpers');

const TOKENS_COLLECTION = 'tokens';
const USERS_COLLECTION = 'users';
const tokens = {};

// Tokens - post
// Required data: phone, password
// Optional data: none
tokens.post = async (data) => {
    const phone = typeof (data.payload.phone) === 'string' &&
    data.payload.phone.trim().length === 9 ? data.payload.phone : false;
    const password = typeof (data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password : false;

    if (phone && password) {
        // Lookup the user who matches that phone
        let userData;
        try {
            userData = await _data.read(USERS_COLLECTION, phone);
        } catch (err) {
            return helpers.responsObject(400, {Error: 'Could not find the specified user'})
        }

        // Hash the sent password, an compare to the password  stored in the user object
        const hashPassword = helpers.hash(password);

        if (userData && userData.hashPassword === hashPassword) {
            // if valid, create a new token, with random name, set expiration data 1 hour in the future
            const tokenId = helpers.createRandomString(20);
            const expires = Date.now() + 1000 * 60 * 60; //1000ms * 60 s in the minute * 60 minutes in the hour
            const tokenObject = {
                phone,
                id: tokenId,
                expires
            };

            // Store the token
            try {
                await _data.create(TOKENS_COLLECTION, tokenId, tokenObject);
                return helpers.responsObject(200, tokenObject);
            } catch (err) {
                return helpers.responsObject(500, {Error: 'Coul not create the new token'});
            }

        } else {
            return helpers.responsObject(400, {Error: 'Password did not match the specified user'});
        }

    } else {
        return helpers.responsObject(400, {Error: 'Missing required fields'})
    }

};
// Tokens - get
// Required data: id
// Optional data: none
tokens.get = async (data) => {
    // Check that id is valid
    const id = typeof(data.queryStringObject.id) === 'string'
    && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id : false;
    if (id) {
        try {
            const token = await _data.read(TOKENS_COLLECTION, id);
            return helpers.responsObject(200, token);
        } catch (err) {
            console.log(err);
            return helpers.responsObject(404, {Error: 'Could not find the specified token'});
        }
    } else {
        return helpers.responsObject(400, {
            Error: 'Missing reuired field'
        });
    }
};
// Tokens - put
// Required fields: id, extend (add one hour to token expiration)
// Optional data: none
tokens.put = async (data) => {
    const id = typeof (data.payload.id) === 'string' &&
    data.payload.id.trim().length === 20 ? data.payload.id : false;
    const extend = typeof (data.payload.extend) === 'boolean' && data.payload.extend;

    if (id && extend) {

        let token;
        try {
            token = await _data.read(TOKENS_COLLECTION, id);
        } catch (err) {
            console.log(err);
            return helpers.responsObject(404, {Error: 'Token doeas not exists'});
        }

        //Check to the make sure the token isn't already expired
        if (token.expires > Date.now()) {
            token.expires = Date.now() + 1000 * 60 * 60;

            try {
                await _data.update(TOKENS_COLLECTION, id, token);
                return helpers.responsObject(200);
            } catch (err) {
                console.log(err);
                return helpers.responsObject(500, {Error: 'Could not update the token expiration'});
            }

        } else {
            return helpers.responsObject(400, {
                Error: 'Token has already expired'
            });
        }

    } else {
        return helpers.responsObject(400, {
            Error: 'Missing reuired field'
        });
    }

};
// Tokens - delete
//Required data: id
// Optional data: none
tokens.delete = async (data) => {
    const id = typeof(data.queryStringObject.id) === 'string'
    && data.queryStringObject.id.trim().length === 20 ? data.queryStringObject.id : false;
    if (id) {
        try {
            await _data.read(TOKENS_COLLECTION, id);
        } catch (err) {
            console.log(err);
            return helpers.responsObject(404, {Error: 'Could not find the specified token'});
        }

        try {
            await _data.delete(TOKENS_COLLECTION, id);
            return helpers.responsObject(200);
        } catch (err) {
            return helpers.responsObject(500, {
                Error: 'Could not delete token'
            });
        }

    } else {
        return helpers.responsObject(400, {
            Error: 'Missing reuired field'
        });
    }
};

// Verify it a given token id is currently valid for a given user
tokens.verifyToken = async (id, phone) => {
    try {
// Lookup the token
        const token = await _data.read(TOKENS_COLLECTION, id);
        //Check if the token it for the given user and has not expired
        return token.phone === phone && token.expires > Date.now();
    } catch (err) {
        return false;
    }
};

module.exports.verifyToken = tokens.verifyToken;
module.exports = async (data) => {
    const acceptableMethod = ['post', 'get', 'put', 'delete'];
    if (acceptableMethod.includes(data.method)) {
        return tokens[data.method](data);
    } else {
        helpers.responsObject(405); // Method not allowed
    }
};
