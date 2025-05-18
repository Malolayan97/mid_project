 
const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

// قائمة المدن المفضلة لكل مستخدم (محاكاة قاعدة بيانات)
let userFavorites = {};

// 🔹 جلب الطقس لمدينة معينة
router.get("/weather/:city", async (req, res) => {
    const city = req.params.city;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// 🔹 إضافة مدينة إلى المفضلة
router.post("/favorites", (req, res) => {
    const { userId, city } = req.body;
    if (!userFavorites[userId]) {
        userFavorites[userId] = [];
    }
    if (!userFavorites[userId].includes(city)) {
        userFavorites[userId].push(city);
    }
    res.json({ message: "City added to favorites", favorites: userFavorites[userId] });
});

// 🔹 جلب المدن المفضلة لمستخدم معين
router.get("/favorites/:userId", (req, res) => {
    const userId = req.params.userId;
    res.json({ favorites: userFavorites[userId] || [] });
});

// 🔹 إزالة مدينة من المفضلة
router.delete("/favorites", (req, res) => {
    const { userId, city } = req.body;
    if (userFavorites[userId]) {
        userFavorites[userId] = userFavorites[userId].filter(c => c !== city);
    }
    res.json({ message: "City removed from favorites", favorites: userFavorites[userId] });
});

module.exports = router;
