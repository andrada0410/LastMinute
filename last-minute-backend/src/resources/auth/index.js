const { getUserByEmail, createUser, deleteUserById} = require("../user/index")
const {associatePersonToUser} = require("../person/index")
const config = require('../../../config.json');
const jwt = require('jsonwebtoken');

const JWT_KEY = config.databaseConfig.jwtKey; 

function generateToken(user) {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        JWT_KEY,
        { expiresIn: "24h" }
    );
}

async function validateUser (userData) {
    await validateEmail(userData.email);

    const existingUser = await getUserByEmail(userData.email);
    if (existingUser && existingUser.length > 0) {
        const error = new Error("Emailul este deja utilizat!");
        error.status = 400;
        throw error;
    }

    if (!userData.firstName || userData.firstName.length === 0 
        || !userData.lastName || userData.lastName.length === 0) {
        
        const error = new Error("Trebuie să introduceți numele și prenumele!");
        error.status = 400;
        throw error;
    }

    if (!userData.password ||  userData.password.length === 0) {
        const error = new Error("Trebuie să introduceți o parolă validă!");
        error.status = 400;
        throw error;
    }
}

async function validateEmail (email) {
    if (!email || email.length === 0) {
        const error = new Error("Trebuie să introduceți emailul!");
        error.status = 400;
        throw error;
    }

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        const error = new Error("Emailul nu este valid!");
        error.status = 400;
        throw error;
    }
}

function  formatUserForResponse (dbUser) {
    return {
        id: dbUser.id,
        email: dbUser.email,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        role: dbUser.role
    };
}

module.exports = {
    registerUser: async (userData) => {
        await validateUser(userData);
        
        if (!userData.role || userData.role !== 'USER') {
            userData.role = 'USER';
        }

        const newUser = await createUser(userData);
        newUser.lastName = userData.lastName;
        newUser.firstName = userData.firstName;

        try {
            await associatePersonToUser(newUser);
        } catch (error) {
            await deleteUserById(newUser.id);
            throw error;
        }

        return {
            user: formatUserForResponse(newUser),
            token: generateToken(newUser)
        }
    },

    loginUser: async (loginData) => {
        if (!loginData.email || !loginData.password) {
            const error = new Error("Emailul și parola sunt obligatorii!");
            error.status = 400;
            throw error;
        }

        if (loginData.email.length === 0 || loginData.password.length === 0) {
            const error = new Error("Trebuie să introduceți emailul și parola!");
            error.status = 400;
            throw error;
        }

        const user = await getUserByEmail(loginData.email);

        if (!user || user.password !== loginData.password) {
            const error = new Error("Email sau parolă incorectă!");
            error.status = 401;
            throw error;
        }

        return {
            user: formatUserForResponse(user),
            token: generateToken(user)
        };
    }
}