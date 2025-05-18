// -------------------------------
// Weather App (Back-end)
// -------------------------------

document.addEventListener("DOMContentLoaded", function () {
    // تحديد العناصر الأساسية من DOM
    const form = document.querySelector(".find-location");
    const input = document.querySelector("#city-input");
    const forecastContainer = document.querySelector("#forecast-container");
    const loadingText = document.querySelector("#loading");

    // مفتاح API الخاص بـ OpenWeather
    const apiKey = "3947755863cdba2cd724f639510aa2d7";

    // التعامل مع إرسال النموذج
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // منع إعادة تحميل الصفحة
        const city = input.value.trim(); // الحصول على اسم المدينة المُدخلة

        if (city === "") {
            alert("⚠️ يرجى إدخال اسم المدينة!");
            return;
        }

        console.log("🔍 جلب الطقس لمدينة:", city);
        fetchWeather(city);
    });

    // جلب بيانات الطقس من API
    async function fetchWeather(city) {
        try {
            loadingText.style.display = "block"; // إظهار رسالة التحميل

            // جلب بيانات الطقس الحالية والتوقعات
            const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=EG`);
            const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=EG`);

            const weatherData = await weatherRes.json();
            const forecastData = await forecastRes.json();

            console.log("✅ بيانات الطقس الحالية:", weatherData);
            console.log("✅ بيانات التوقعات:", forecastData);

            // التحقق من وجود خطأ عند عدم العثور على المدينة
            if (weatherData.cod !== 200 || forecastData.cod !== "200") {
                alert("⚠️ لم يتم العثور على المدينة. يرجى المحاولة مرة أخرى.");
                return;
            }

            // تحديث الواجهة ببيانات الطقس
            updateCurrentWeather(weatherData);
            updateForecast(forecastData);

        } catch (error) {
            console.error("❌ حدث خطأ أثناء جلب البيانات:", error);
            alert("❌ حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقًا.");
        } finally {
            loadingText.style.display = "none"; // إخفاء رسالة التحميل
        }
    }

    // تحديث الواجهة ببيانات الطقس الحالية
    function updateCurrentWeather(data) {
        const { name, weather, main, wind } = data;
        const temperature = Math.round(main.temp);
        const humidity = main.humidity;
        const windSpeed = wind.speed;
        const windDirection = getWindDirection(wind.deg);
        const icon = weather[0].icon;
        const description = weather[0].description;
        const date = new Date().toLocaleDateString("EG", { weekday: 'long', day: 'numeric', month: 'long' });

        // عرض بيانات الطقس في الواجهة
        forecastContainer.innerHTML = `
            <div class="today forecast">
                <div class="forecast-header">
                    <div class="day">${date}</div>
                </div>
                <div class="forecast-content">
                    <div class="location">${name}</div>
                    <div class="degree">
                        <div class="num">${temperature}<sup>°C</sup></div>
                        <div class="forecast-icon">
                            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width=90>
                        </div>
                    </div>
                    <span><img src="/images/icon-umberella.png" alt="">${humidity}%</span>
                    <span><img src="/images/icon-wind.png" alt="">${windSpeed} Km/h </span>
                    <span><img src="/images/icon-compass.png" alt="">${windDirection}</span>
                </div>
            </div>
        `;
    }

    // تحديث الواجهة ببيانات التوقعات الجوية
    function updateForecast(data) {
        let forecastHTML = "";
        const dailyData = filterDailyForecasts(data.list);

        // إنشاء عناصر لكل يوم في التوقعات
        dailyData.forEach(day => {
            const dayName = new Date(day.dt_txt).toLocaleDateString("EG", { weekday: 'long' }); // اسم اليوم
            const temp = Math.round(day.main.temp); // درجة الحرارة
            const icon = day.weather[0].icon; // أيقونة الطقس

            forecastHTML += `
            <div class="forecast">
                <div class="forecast-header">
                    <div class="day">${dayName}</div>
                </div>
                <div class="forecast-content">
                    <div class="forecast-icon">
                        <img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather" width=48>
                    </div>
                    <div class="degree">${temp}<sup>°C</sup></div>
                </div>
            </div>
        `;
        });

        // تحديث محتوى الصفحة
        forecastContainer.innerHTML += forecastHTML;
    }


    function filterDailyForecasts(list) {
        const filteredDays = {};
        const today = new Date().toDateString(); // الحصول على تاريخ اليوم الحالي
        const forecastDays = [];

        list.forEach(forecast => {
            const date = new Date(forecast.dt_txt).toDateString();

            // تخطي اليوم الحالي، وأخذ توقع واحد فقط لكل يوم
            if (date !== today && !filteredDays[date]) {
                filteredDays[date] = forecast;
            }
        });

        // استخراج أول 6 أيام بعد اليوم الحالي
        return Object.values(filteredDays).slice(0, 6);
    }


    // تحويل درجة الرياح إلى اتجاه (مثل N, NE, E, إلخ)
    function getWindDirection(deg) {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        return directions[Math.round(deg / 45) % 8];
    }
});

// -------------------------------
// Modal (Login & Signup)
// -------------------------------

document.addEventListener("DOMContentLoaded", function () {
    // تحديد عناصر النوافذ المنبثقة
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const signinModal = document.getElementById("signinModal");
    const signupModal = document.getElementById("signupModal");
    const closeButtons = document.querySelectorAll(".modal .close");

    // فتح نافذة تسجيل الدخول
    loginBtn.addEventListener("click", function (event) {
        event.preventDefault(); // منع السلوك الافتراضي للرابط
        openModal(signinModal);
    });

    // فتح نافذة التسجيل
    signupBtn.addEventListener("click", function (event) {
        event.preventDefault(); // منع السلوك الافتراضي للرابط
        openModal(signupModal);
    });

    // إغلاق النافذة عند النقر على زر الإغلاق "X"
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            closeModal(this.closest(".modal"));
        });
    });

    // إغلاق النافذة عند النقر خارج محتوى النافذة
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
            closeModal(event.target);
        }
    });

    // وظيفة لفتح النافذة بسلاسة
    function openModal(modal) {
        if (modal) {
            modal.classList.add("active"); // إضافة فئة CSS لتأثير الانتقال
        }
    }

    // وظيفة لإغلاق النافذة بسلاسة
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("active"); // إزالة فئة CSS لتأثير الانتقال
            setTimeout(() => {
                modal.style.display = "none"; // إخفاء النافذة تمامًا بعد انتهاء الانتقال
            }, 300); // يجب أن يطابق وقت الانتقال في CSS
        }
    }
});
