const { getUserByEmail, createUser} = require("../user/index")
const config = require('../../../config.json');
const jwt = require('jsonwebtoken');

const JWT_KEY = config.databaseConfig.jwtKey; 

async function validateUser (userData) {
    await validateEmail(userData.email);

    const existingUser = await getUserByEmail(userData.email);
    if (existingUser && existingUser.length > 0) {
        throw new Error("Email-ul este deja utilizat!");
    }

    if (!userData.firstName || userData.firstName.length === 0 
        || !userData.lastName || userData.lastName.length === 0) {
        throw new Error("Trebuie sa introduceti numele si prenumele!");
    }

    if (!userData.password ||  userData.password.length === 0) {
        throw new Error("Trebuie sa introduceti o parola valida!");
    }
}

async function validateEmail (email) {
    if (!email || email.length === 0) {
        throw new Error("Trebuie sa introduceti emailul!");
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        throw new Error("Emailul nu este valid!");
    }
}

function  formatUserForResponse (dbUser) {
    return {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name
    };
}

module.exports = {
    registerUser: async (userData) => {
        await validateUser(userData);
        const newUser = await createUser(userData);

        if (!JWT_KEY) {
            throw new Error("Eroare interna, token-ul JWT nu este configurat!");
        }

        const token = jwt.sign(
            {
                id : newUser.id,
            },
            JWT_KEY,
            {expiresIn: "24h"}
        );

        return {
            user: formatUserForResponse(newUser),
            token: token
        }
    },
}