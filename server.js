const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");
<<<<<<< HEAD
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
=======
const mysql = require("mysql2/promise");  // استخدم mysql2 مع Promise
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
const path = require("path");

dotenv.config();
const app = express();

// ✅ إعداد الـ Middleware
app.use(express.json());
app.use(cors());
<<<<<<< HEAD
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
=======
app.use(express.static(path.join(__dirname, "public")));

// ✅ مفاتيح البيئة
const API_KEY = process.env.OPENWEATHER_API_KEY;
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

// ✅ إعداد اتصال MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed

// ✅ تحميل الصفحة الرئيسية عند الدخول إلى "/"
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

<<<<<<< HEAD
// ✅ Endpoint لجلب بيانات الطقس حسب المدينة
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "يجب إدخال اسم المدينة" });
    }
=======
// ✅ مصادقة JWT
function authenticateToken(req, res, next) {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}

// ✅ تسجيل المستخدم (Signup)
app.post("/api/auth/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: "❌ يجب ملء جميع الحقول" });

        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existingUser.length > 0) return res.status(400).json({ error: "❌ البريد الإلكتروني مستخدم بالفعل!" });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashedPassword]);

        res.status(201).json({ message: "✅ تم تسجيل المستخدم بنجاح" });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء التسجيل" });
    }
});

// ✅ تسجيل الدخول (Login)
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: "❌ يجب إدخال البريد الإلكتروني وكلمة المرور" });

        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (user.length === 0) return res.status(401).json({ error: "❌ المستخدم غير موجود" });

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) return res.status(401).json({ error: "❌ كلمة المرور غير صحيحة" });

        const token = jwt.sign({ id: user[0].id, username: user[0].username, email: user[0].email }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, username: user[0].username });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء تسجيل الدخول" });
    }
});

// ✅ جلب الطقس لمدينة معينة
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "❌ يجب إدخال اسم المدينة" });
>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: { q: city, appid: API_KEY, units: "metric" }
        });
        res.json(response.data);
    } catch (error) {
<<<<<<< HEAD
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
=======
        res.status(500).json({ error: "❌ حدث خطأ أثناء جلب بيانات الطقس" });
    }
});

// ✅ جلب المدن المفضلة للمستخدم
app.get("/api/favorites", authenticateToken, async (req, res) => {
    try {
        const [favorites] = await db.query("SELECT city FROM favorites WHERE user_id = ?", [req.user.id]);
        res.json(favorites.map(fav => fav.city));
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء جلب المفضلات" });
    }
});

// ✅ جلب الطقس لمدينة معينة
app.get("/api/weather", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "❌ يجب إدخال اسم المدينة" });

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: { q: city, appid: API_KEY, units: "metric", lang: "EN" }
        });
        res.json(response.data);
    } catch (error) {
        console.error("❌ خطأ في جلب بيانات الطقس:", error.response?.data || error.message);
        res.status(500).json({ error: "❌ حدث خطأ أثناء جلب بيانات الطقس" });
    }
});

// ✅ جلب التوقعات الجوية لـ 6 أيام
app.get("/api/forecast", async (req, res) => {
    const city = req.query.city;
    if (!city) return res.status(400).json({ error: "❌ يجب إدخال اسم المدينة" });

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
            params: { q: city, appid: API_KEY, units: "metric", lang: "EN" }
        });

        if (!response.data || !response.data.list) {
            return res.status(500).json({ error: "❌ لم يتم العثور على توقعات لهذه المدينة" });
        }

        res.json(response.data);
    } catch (error) {
        console.error("❌ خطأ في جلب التوقعات:", error.response?.data || error.message);
        res.status(500).json({ error: "❌ حدث خطأ أثناء جلب التوقعات" });
    }
});
// ✅ إضافة مدينة للمفضلات
app.post("/api/favorites", authenticateToken, async (req, res) => {
    try {
        const { city } = req.body;
        if (!city) return res.status(400).json({ error: "❌ يجب إدخال اسم المدينة" });

        await db.query("INSERT INTO favorites (user_id, city) VALUES (?, ?)", [req.user.id, city]);
        res.json({ message: "✅ تمت إضافة المدينة إلى المفضلات" });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء إضافة المدينة" });
    }
});

// ✅ حذف مدينة من المفضلات
app.delete("/api/favorites", authenticateToken, async (req, res) => {
    try {
        const { city } = req.body;
        if (!city) return res.status(400).json({ error: "❌ يجب إدخال اسم المدينة" });

        await db.query("DELETE FROM favorites WHERE user_id = ? AND city = ?", [req.user.id, city]);
        res.json({ message: "✅ تم حذف المدينة من المفضلات" });
    } catch (error) {
        res.status(500).json({ error: "❌ حدث خطأ أثناء حذف المدينة" });
    }
});


// ✅ تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


>>>>>>> 454aa3e244e0a08f5f06df8800df184cf5ac67ed
