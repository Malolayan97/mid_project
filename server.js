const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");

dotenv.config();
const app = express();

// ✅ إعداد الـ Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ✅ مفتاح OpenWeather API
const API_KEY = process.env.OPENWEATHER_API_KEY;
if (!API_KEY) {
    console.error("❌ لم يتم العثور على مفتاح API! تأكد من إضافته في ملف .env");
    process.exit(1); // إيقاف التشغيل إذا لم يتم العثور على المفتاح
}

// ✅ ربط قاعدة البيانات
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ تحميل الصفحة الرئيسية عند الدخول إلى "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ✅ Endpoint لجلب بيانات الطقس حسب المدينة
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "يجب إدخال اسم المدينة" });
    }

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: { q: city, appid: API_KEY, units: "metric" }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ أثناء جلب بيانات الطقس" });
    }
});

// ✅ نموذج المستخدم
const User = mongoose.model("User", new mongoose.Schema({
    username: String,
    password: String,
    favorites: [String] // قائمة المدن المفضلة
}));

// ✅ مصادقة JWT
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Forbidden" });
        req.user = user;
        next();
    });
}

// ✅ تسجيل المستخدم
app.post("/api/auth/signup", async (req, res) => {
    const { username, password } = req.body;

    const user = new User({ username, password, favorites: [] });
    await user.save();

    res.json({ message: "تم تسجيل المستخدم بنجاح" });
});

// ✅ تسجيل الدخول
app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: "بيانات غير صحيحة" });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
});

// ✅ CRUD للمفضلات
app.get("/api/favorites", authenticateToken, async (req, res) => {
    const user = await User.findOne({ username: req.user.username });
    res.json(user.favorites);
});

app.post("/api/favorites", authenticateToken, async (req, res) => {
    const { city } = req.body;
    const user = await User.findOne({ username: req.user.username });

    if (!user.favorites.includes(city)) {
        user.favorites.push(city);
        await user.save();
    }
    res.json(user.favorites);
});

app.delete("/api/favorites", authenticateToken, async (req, res) => {
    const { city } = req.body;
    const user = await User.findOne({ username: req.user.username });

    user.favorites = user.favorites.filter(c => c !== city);
    await user.save();
    
    res.json(user.favorites);
});

// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
