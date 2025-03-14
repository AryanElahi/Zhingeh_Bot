const express = require('express');
const { sendSms, registerUser } = require('./Services');

const app = express();
const port = 3001;

app.use(express.json());

// Root route
app.get('/', (req, res) => {
    console.log("✅ API is working.");
    res.send('API is working');
});

// Register user and send SMS
app.post('/send', async (req, res) => {
    try {
        const { name, phone, birthday } = req.body;

        // Validate input
        if (!name || !phone || !birthday) {
            console.error("❌ Missing required fields: name, phone, or birthday.");
            return res.status(400).json({ error: "Please provide all required fields." });
        }

        // Register user
        const userResult = await registerUser(name, phone, birthday);
        if (!userResult.success) {
            console.error("❌ Failed to register user:", userResult.error);
            return res.status(400).json({ error: userResult.error });
        }

        console.log("✅ User registered successfully:", userResult.data);

        // Send SMS
        const smsResult = await sendSms(phone);
        if (!smsResult) {
            console.error("❌ Failed to send SMS.");
            return res.status(500).json({ error: "Failed to send SMS." });
        }

        console.log("✅ SMS sent successfully to:", phone);

        res.json({
            message: "User registered and SMS sent successfully.",
            user: userResult.data
        });

    } catch (error) {
        console.error("❌ Error in /send route:", error);
        res.status(500).json({ error: "An error occurred while processing the request." });
    }
});

// Start server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});
