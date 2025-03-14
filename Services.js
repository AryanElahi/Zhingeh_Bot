const axios = require('axios');
const {PrismaClient} = require("@prisma/client")
const moment = require('moment-jalaali');
const prisma = new PrismaClient()
const apiBaseUrl = 'https://RestfulSms.com/api';
const requestData = {
    UserApiKey: "f39b005ce36d425bc915005c",
    SecretKey: "it66)%#Zhinga@*&"
};

async function getToken() {
    try {
        const response = await axios.post(`${apiBaseUrl}/Token`, requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201 && response.data.IsSuccessful) {
            return response.data.TokenKey; // استخراج و بازگشت توکن
        } else {
            console.error('دریافت توکن ناموفق بود:', response.data);
            return null;
        }
    } catch (error) {
        console.error("خطا در دریافت توکن:", error.response ? error.response.data : error.message);
        return null;
    }
}
async function sendSms(mobile) {
    const token = await getToken(); 

    if (!token) {
        console.error('token not found');
        return;
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
            console.log("SMS has been sent successfully ", response.data);
        } else {
            console.error("sms has not been send ", response.data);
        }
    } catch (error) {
        console.error("error while sending SMS", error.response ? error.response.data : error.message);
    }
}
async function registerUser(name, phone, birthday_shamsi) {
    try {
        if (!name || !phone || !birthday_shamsi) {
            return { success: false, error: "لطفاً تمام فیلدها را وارد کنید" };
        }

        const birthday_miladi = moment(birthday_shamsi, 'jYYYY/jMM/jDD').toDate();

        if (isNaN(birthday_miladi)) {
            return { success: false, error: "فرمت تاریخ شمسی نامعتبر است" };
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                phone,
                birthday: birthday_miladi
            }
        });

        return { success: true, data: newUser };

    } catch (error) {
        console.error("خطا در ذخیره اطلاعات:", error);
        return { success: false, error: "مشکلی در سرور رخ داده است" };
    }
}
async function getAllusers() {
    try {
        if (!name || !phone || !birthday_shamsi) {
            return { success: false, error: "لطفاً تمام فیلدها را وارد کنید" };
        }

        const birthday_miladi = moment(birthday_shamsi, 'jYYYY/jMM/jDD').toDate();

        if (isNaN(birthday_miladi)) {
            return { success: false, error: "فرمت تاریخ شمسی نامعتبر است" };
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                phone,
                birthday: birthday_miladi
            }
        });

        return { success: true, data: newUser };

    } catch (error) {
        console.error("خطا در ذخیره اطلاعات:", error);
        return { success: false, error: "مشکلی در سرور رخ داده است" };
    }
}

//(async () => {
//    const userMobile = "09181711690";
//    await sendSms(userMobile);
//})();

module.exports = {
    sendSms,
    registerUser
} 
