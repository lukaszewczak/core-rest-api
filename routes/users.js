const _data = require('../lib/data');
const helpers = require('../lib/helpers');
const {verifyToken} = require('./tokens');

const COLLECTION = 'users';
const users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
users.post = async (data) => {
    // Check that all required dields are filled out
    const firstName = typeof (data.payload.firstName) === 'string' &&
    data.payload.firstName.trim().length > 0 ? data.payload.firstName : false;
    const lastName = typeof (data.payload.lastName) === 'string' &&
    data.payload.lastName.trim().length > 0 ? data.payload.lastName : false;
    const phone = typeof (data.payload.phone) === 'string' &&
    data.payload.phone.trim().length === 9 ? data.payload.phone : false;
    const password = typeof (data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password : false;
    const tosAgreement = typeof (data.payload.tosAgreement) === 'boolean' && data.payload.tosAgreement === true;

    if (firstName && lastName && password && phone && tosAgreement) {
        // Make sure that user dosent already exist
        try {
            await _data.read(COLLECTION, phone);
            return helpers.responsObject(400, {
                Error: 'A user with that phone number already exists '
            });
        }
        catch (err) {
            console.log(err);
            // Store the user
            try {
                // hash the password
                const hashPassword = helpers.hash(password);

                if (!hashPassword) {
                    return helpers.responsObject(500, {
                        Error: `Could not hash the user password`
                    });
                }

                // Create the user object
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    hashPassword,
                    tosAgreement
                };

                await _data.create(COLLECTION, phone, userObject);

                return helpers.responsObject(200);
            } catch (err) {
                console.log(err);
                return helpers.responsObject(500, {
                    Error: `Could not create a user`
                });
            }
        }

    } else {
        return helpers.responsObject(400, {
            Error: `Missing required fields`
        });
    }
};

// Users - get
// Required data: phone
// Optional data: none
users.get = async (data) => {
    const phone = typeof(data.queryStringObject.phone) === 'string'
    && data.queryStringObject.phone.trim().length === 9 ? data.queryStringObject.phone : false;
    if (phone) {

        // Lookup the token from the headers
        const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
        // verify that the givn token is valid for the phone number
        const tokenIsValid = await verifyToken(token, phone);
        if (!tokenIsValid) {
            return helpers.responsObject(403, {Error: 'Missing required token in header, or token is invalid'});
        }

        try {
            const user = await _data.read(COLLECTION, phone);
            // Remove the hasshed password from the user object, beofor returning to requeste
            delete user.hashPassword;
            return helpers.responsObject(200, user);
        } catch (err) {
            console.log(err);
            return helpers.responsObject(404, {Error: 'Could not find the specified user'});
        }
    } else {
        return helpers.responsObject(400, {
            Error: 'Missing reuired field'
        });
    }
};

// Users - put
// Required data: phone
// Optional data: firstName, lastName, phone, password (at least one must be specified)
users.put = async (data) => {
    // Check for the required field
    const phone = typeof(data.payload.phone) === 'string'
    && data.payload.phone.trim().length === 9 ? data.payload.phone : false;

    // Check for the optional fields
    const firstName = typeof (data.payload.firstName) === 'string' &&
    data.payload.firstName.trim().length > 0 ? data.payload.firstName : false;
    const lastName = typeof (data.payload.lastName) === 'string' &&
    data.payload.lastName.trim().length > 0 ? data.payload.lastName : false;
    const password = typeof (data.payload.password) === 'string' &&
    data.payload.password.trim().length > 0 ? data.payload.password : false;

    if (phone) {

        if (firstName || lastName || password) {

            // Lookup the token from the headers
            const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
            // verify that the givn token is valid for the phone number
            const tokenIsValid = await verifyToken(token, phone);
            if (!tokenIsValid) {
                return helpers.responsObject(403, {Error: 'Missing required token in header, or token is invalid'});
            }

            let user = {};
            try {
                user = await _data.read(COLLECTION, phone);
            } catch (err) {
                console.log(err);
                return helpers.responsObject(404, {Error: 'User doeas not exists'});
            }
            try {
                user.firstName = firstName || user.firstName;
                user.lastName = lastName || user.lastName;
                user.hashPassword = password ? helpers.hash(password) : user.hashPassword;

                await _data.update(COLLECTION, phone, user);

                return helpers.responsObject(200);
            } catch (err) {
                console.log(err);
                return helpers.responsObject(500, {Error: 'Could not update the user'});
            }

        } else {
            return helpers.responsObject(400, {Error: 'Missing fields to update'})
        }

    } else {
        return helpers.responsObject(400, {Error: 'Missing required field'})
    }

};

// Users - delete
// Required data: phone
users.delete = async (data) => {
    const phone = typeof(data.queryStringObject.phone) === 'string'
    && data.queryStringObject.phone.trim().length === 9 ? data.queryStringObject.phone : false;
    if (phone) {

        // Lookup the token from the headers
        const token = typeof (data.headers.token) === 'string' ? data.headers.token : false;
        // verify that the givn token is valid for the phone number
        const tokenIsValid = await verifyToken(token, phone);
        if (!tokenIsValid) {
            return helpers.responsObject(403, {Error: 'Missing required token in header, or token is invalid'});
        }

        try {
            await _data.read(COLLECTION, phone);
        } catch (err) {
            console.log(err);
            return helpers.responsObject(404, {Error: 'Could not find the specified user'});
        }

        try {
            await _data.delete(COLLECTION, phone);
            return helpers.responsObject(200);
        } catch (err) {
            return helpers.responsObject(500, {
                Error: 'Could not delete user'
            });
        }

    } else {
        return helpers.responsObject(400, {
            Error: 'Missing reuired field'
        });
    }
};

module.exports = async (data) => {
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.includes(data.method)) {
        return users[data.method](data);
    } else {
        return helpers.responsObject(405);// Method not allowed
    }
};
