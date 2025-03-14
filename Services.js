const axios = require('axios');
const { PrismaClient } = require("@prisma/client");
const moment = require('moment-jalaali');
const prisma = new PrismaClient();
const apiBaseUrl = 'https://RestfulSms.com/api';

const requestData = {
    UserApiKey: "f39b005ce36d425bc915005c",
    SecretKey: "it66)%#Zhinga@*&"
};

// Function to get token
async function getToken() {
    try {
        const response = await axios.post(`${apiBaseUrl}/Token`, requestData, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.status === 201 && response.data.IsSuccessful) {
            return response.data.TokenKey;
        } else {
            console.error('❌ Token retrieval failed:', response.data);
            return null;
        }
    } catch (error) {
        console.error("❌ Error while retrieving token:", error.response ? error.response.data : error.message);
        return null;
    }
}

// Function to send SMS
async function sendSms(mobile) {
    const token = await getToken();
    if (!token) {
        console.error('❌ Token not found, SMS sending aborted.');
        return false;
    }

    const smsData = {
        ParameterArray: [
            { Parameter: "EstateCode", ParameterValue: "" },
            { Parameter: "referID", ParameterValue: "" }
        ],
        Mobile: mobile,
        TemplateId: "83678"
    };

    try {
        const response = await axios.post(`${apiBaseUrl}/UltraFastSend`, smsData, {
            headers: {
                'Content-Type': 'application/json',
                'x-sms-ir-secure-token': token
            }
        });

        if (response.data.IsSuccessful) {
            console.log("✅ SMS sent successfully:", response.data);
            return true;  // ✅ مقدار `true` برگردانده شود
        } else {
            console.error("❌ SMS failed to send:", response.data);
            return false;  // ❌ مقدار `false` برگردانده شود
        }
    } catch (error) {
        console.error("❌ Error while sending SMS:", error.response ? error.response.data : error.message);
        return false;
    }
}


// Function to register a new user
async function registerUser(name, phone, birthday_shamsi) {
    try {
        if (!name || !phone || !birthday_shamsi) {
            console.error("❌ Missing required fields: name, phone, or birthday_shamsi.");
            return { success: false, error: "Please provide all required fields." };
        }

        const birthday_miladi = moment(birthday_shamsi, 'jYYYY/jMM/jDD').toDate();
        if (isNaN(birthday_miladi)) {
            console.error("❌ Invalid Shamsi date format:", birthday_shamsi);
            return { success: false, error: "Invalid Shamsi date format." };
        }

        const newUser = await prisma.user.create({
            data: { name, phone, birthday: birthday_miladi }
        });

        console.log("✅ User registered successfully:", newUser);
        return { success: true, data: newUser };

    } catch (error) {
        console.error("❌ Error while registering user:", error);
        return { success: false, error: "An error occurred while registering the user." };
    }
}

// Function to retrieve all users
async function getAllUsers() {
    try {
        const users = await prisma.user.findMany();
        console.log("✅ Retrieved all users successfully.");
        return { success: true, data: users };
    } catch (error) {
        console.error("❌ Error while retrieving users:", error);
        return { success: false, error: "An error occurred while retrieving users." };
    }
}

// Export functions
module.exports = {
    sendSms,
    registerUser,
    getAllUsers
};
