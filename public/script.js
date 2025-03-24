// -------------------------------
// Weather App (Back-end)
// -------------------------------
document.addEventListener('DOMContentLoaded', function () { fetchWeather('Amman'); });

document.addEventListener("DOMContentLoaded", function () {
    const apiKey = "3947755863cdba2cd724f639510aa2d7"; // مفتاح API الخاص بـ OpenWeather
    const forecastContainer = document.getElementById("forecast-container");
    const loadingText = document.getElementById("loading");

    const defaultCity = "Amman";
    fetchWeather(defaultCity);

    async function fetchWeather(city) {
        try {
            loadingText.style.display = "block"; 
            forecastContainer.innerHTML = ""; 
            // جلب بيانات الطقس الحالية وتوقعات الأيام القادمة
            const weatherRes = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);
            const forecastRes = await fetch(`${API_URL}/forecast?city=${encodeURIComponent(city)}`);

            const weatherData = await weatherRes.json();
            const forecastData = await forecastRes.json();

            // التحقق من نجاح الطلب
            if (!weatherRes.ok || !forecastRes.ok || weatherData.cod !== 200 || forecastData.cod !== "200") {
                alert("⚠️ لم يتم العثور على المدينة. يرجى المحاولة مرة أخرى.");
                return;
            }

            // تحديث الواجهة بالبيانات
            updateCurrentWeather(weatherData);
            updateForecast(forecastData);

        } catch (error) {
            console.error("❌ حدث خطأ أثناء جلب البيانات:", error);
            alert("❌ حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقًا.");
        } finally {
            loadingText.style.display = "none"; 
        }
    }

    function updateCurrentWeather(data) {
        const { name, weather, main, wind } = data;
        const temperature = Math.round(main.temp);
        const humidity = main.humidity;
        const windSpeed = wind.speed;
        const windDirection = getWindDirection(wind.deg);
        const icon = weather[0].icon;
        const description = weather[0].description;
        const date = new Date().toLocaleDateString("EN", { weekday: 'long', day: 'numeric', month: 'long' });

        forecastContainer.innerHTML = `
                <div class="today forecast">
                    <div class="forecast-header">
                        <div class="day">${date}</div>
                    </div>
                    <div class="forecast-content">
                        <div class="location">${name}</div>
                        <div class="degree">
                            <div class="num" id="current-temp">${temperature}<sup>°C</sup></div>
                            <div class="forecast-icon">
                                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width=90>
                            </div>
                        </div>
                        <span><img src="/images/icon-umberella.png" alt="">${humidity}%</span>
                        <span><img src="/images/icon-wind.png" alt="">${windSpeed} KM/h </span>
                        <span><img src="/images/icon-compass.png" alt="">${windDirection}</span>
                    </div>
                </div>
            `;
    }

    setInterval(() => {
        const city = document.querySelector(".location")?.textContent;
        if (city) {
            fetchWeather(city);
        }
    }, 3000000); 

    // البحث عن الطقس عند إدخال مدينة
    const form = document.querySelector(".find-location");
    const input = document.querySelector("#weather-city-input");

    if (!form || !input) {
        console.error("⚠️ خطأ: لم يتم العثور على عناصر النموذج!");
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); 
        const city = input.value.trim();

        if (city === "") {
            alert("⚠️ يرجى إدخال اسم المدينة!");
            return;
        }

        console.log("🔍 البحث عن الطقس في:", city);
        fetchWeather(city);
    });


    // عرض التوقعات للأيام القادمة مع اليوم الحالي
    function updateForecast(data) {
        let forecastHTML = "";
        const dailyData = filterDailyForecasts(data.list);
    
        dailyData.forEach(day => {
            const dayName = new Date(day.data.dt_txt).toLocaleDateString("EN", { weekday: 'long' });
            const currentTemp = Math.round(day.data.main.temp); 
            const icon = day.data.weather[0].icon;
            const description = day.data.weather[0].description;
    
            forecastHTML += `
                <div class="forecast">
                    <div class="forecast-header">
                        <div class="day">${dayName}</div>
                    </div>
                    <div class="forecast-content">
                        <div class="forecast-icon">
                            <img src="http://openweathermap.org/img/wn/${icon}.png" alt="${description}" width=48>
                        </div>
                        <div class="degree"> ${currentTemp}<sup>°C</sup></div>
                        <span>☁️ ${description}</span>
                    </div>
                </div>
            `;
        });
    
        forecastContainer.innerHTML += forecastHTML;
    }

    function filterDailyForecasts(list) {
        const dailyData = {};
        const today = new Date().toDateString();
    
        list.forEach(forecast => {
            const date = new Date(forecast.dt_txt);
            const dateString = date.toDateString();
    
            if (dateString === today) {
                dailyData[dateString] = { data: forecast };
            }
    
            if (dateString !== today) {
                dailyData[dateString] = { data: forecast };
            }
        });
    
        return Object.values(dailyData).slice(0, 6);
    }

    function getWindDirection(deg) {
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
        return directions[Math.round(deg / 45) % 8];
    }

});

const API_URL = "http://localhost:5000/api";
let authToken = localStorage.getItem("token");

// تحميل المدن المفضلة وإظهارها بعد تسجيل الدخول
async function loadFavorites() {
    if (!authToken) return;

    try {
        const response = await fetch(`${API_URL}/favorites`, {
            headers: { Authorization: authToken }
        });
        const favorites = await response.json();

        if (Array.isArray(favorites)) {
            const list = document.getElementById("favorites-list"); 
            list.innerHTML = ""; // تفريغ القائمة قبل التحديث

            favorites.forEach(city => {
                const li = document.createElement("li");
                li.innerHTML = `
                   <span class="favorite-city" data-city="${city}" style="cursor: pointer;">🌍 ${city}</span>
                    <button onclick="removeFavorite('${city}')">❌</button>
                `;
                list.appendChild(li);
            });

            document.getElementById("open-favorites-btn").style.display = "block";
        }
    } catch (error) {
        console.error("❌ فشل في تحميل المدن:", error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("favorites-modal");
    const openBtn = document.getElementById("open-favorites-btn");
    const closeBtn = document.querySelector(".close-btn"); // زر الإغلاق

    if (!modal || !openBtn || !closeBtn) {
        console.error("❌ خطأ: بعض العناصر غير موجودة في DOM!");
        return;
    }

    // فتح النافذة عند الضغط على الزر
    openBtn.addEventListener("click", function () {
        modal.style.display = "block";
        modal.style.opacity = "1";      // جعلها مرئية
        modal.style.visibility = "visible";
    });

    // إغلاق النافذة عند الضغط على زر الإغلاق
    closeBtn.addEventListener("click", function () {
        closeFavorites();
    });

    // إغلاق النافذة عند الضغط خارجها
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeFavorites();
        }
    });

    // إغلاق النافذة
    function closeFavorites() {
        console.log("❌ إغلاق النافذة!");
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
    }
});


// جلب بيانات الطقس عند اختيار مدينة
async function fetchWeather(city) {
    try {
        let forecastHTML = "";
        const forecastContainer = document.querySelector("#forecast-container");

        if (!forecastContainer) {
            console.error("❌ عنصر forecastContainer غير موجود في DOM.");
            return;
        }

        const response = await fetch(`${API_URL}/weather?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        console.log("✅ استجابة API:", data);

        if (!response.ok || !data || !data.weather || !data.main) {
            console.error("❌ خطأ في البيانات:", data);
            alert("❌ لم يتم العثور على بيانات الطقس لهذه المدينة.");
            return;
        }

        const temperature = data.main?.temp ? Math.round(data.main.temp) : "N/A";
        const windSpeed = data.wind?.speed ?? "N/A";
        const windDirection = data.wind?.deg !== undefined ? getWindDirection(data.wind.deg) : "N/A";
        const humidity = data.main?.humidity ?? "N/A";
        const icon = data.weather[0]?.icon || "01d";
        const description = data.weather[0]?.description || "No data";
        const dayName = new Date().toLocaleDateString("EN", { weekday: "long", day: 'numeric', month: 'long' });

        forecastHTML += `
            <div class="today forecast">
                <div class="forecast-header">
                    <div class="day">${dayName}</div>
                </div>
                <div class="forecast-content">
                    <div class="location">${city}</div>
                    <div class="degree">
                        <div class="num">${temperature}<sup>°C</sup></div>
                        <div class="forecast-icon">
                            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width=90>
                        </div>
                    </div>
                    <span><img src="/images/icon-umberella.png" alt="">${humidity}%</span>
                    <span><img src="/images/icon-wind.png" alt="">${windSpeed} KM/h </span>
                    <span><img src="/images/icon-compass.png" alt="">${windDirection}</span>
                </div>
                
            </div>
        `;

        forecastContainer.innerHTML = forecastHTML;

        updateForecast(city);

    } catch (error) {
        console.error("❌ فشل في جلب بيانات الطقس:", error);
        alert("⚠️ حدث خطأ أثناء جلب البيانات.");
    }
}


async function updateForecast(city) {
    try {
        const response = await fetch(`${API_URL}/forecast?city=${encodeURIComponent(city)}`);
        const data = await response.json();

        if (!response.ok || !data || !data.list) {
            console.error("❌ خطأ في بيانات التوقعات:", data);
            return;
        }

        let forecastHTML = "";
        const forecastContainer = document.querySelector("#forecast-container");

        // فلترة التوقعات بحيث تعرض توقع واحد لكل يوم عند الساعة 12 ظهرا
        const dailyForecasts = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00"));

        dailyForecasts.forEach(forecast => {
            const date = new Date(forecast.dt_txt);
            const dayName = date.toLocaleDateString("EN", { weekday: "long" });
            const maxTemp = Math.round(forecast.main.temp_max);
            const minTemp = Math.round(forecast.main.temp_min);
            const icon = forecast.weather[0].icon;
            const description = forecast.weather[0].description;

            forecastHTML += `
                <div class="forecast">
                    <div class="forecast-header">
                        <div class="day">${dayName}</div>
                    </div>
                    <div class="forecast-content">
                        <div class="degree">
                        <div class="forecast-icon">
                                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" width=90>
                            </div>

                            <div class="degree"> ${maxTemp}<sup>°C</sup></div>
                            
                        </div>
                        
                        <span>☁️ ${description}</span>
                    </div>
                </div>
            `;
        });

        forecastContainer.innerHTML += forecastHTML;

    } catch (error) {
        console.error("❌ فشل في جلب بيانات التوقعات:", error);
    }
}

function getWindDirection(deg) {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return directions[Math.round(deg / 45) % 8];
}



// إضافة مدينة جديدة
async function addFavorite() {
    const inputElement = document.getElementById("favorite-city-input");

    if (!inputElement) {
        console.error("❌ عنصر إدخال المدينة (favorite-city-input) غير موجود في HTML.");
        alert("⚠️ حدث خطأ: عنصر الإدخال غير موجود.");
        return;
    }

    const city = inputElement.value.trim();
    if (!city) {
        alert("⚠️ الرجاء إدخال اسم المدينة!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: authToken },
            body: JSON.stringify({ city })
        });

        if (response.ok) {
            inputElement.value = ""; // تصفية الحقل بعد الإضافة
            loadFavorites();
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ فشل في إضافة المدينة:", error);
    }
}


// حذف مدينة من المفضلة
async function removeFavorite(city) {
    try {
        const response = await fetch(`${API_URL}/favorites`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: authToken },
            body: JSON.stringify({ city })
        });

        if (response.ok) {
            loadFavorites(); // تحديث القائمة بعد الحذف
        } else {
            const data = await response.json();
            alert(data.error);
        }
    } catch (error) {
        console.error("❌ فشل في حذف المدينة:", error);
    }
}

// التأكد من تحميل المفضلات عند تسجيل الدخول
document.addEventListener("DOMContentLoaded", () => {
    if (authToken) {
        loadFavorites();
    }
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("favorite-city")) {
            const city = event.target.getAttribute("data-city");
            fetchWeather(city); // ✅ تحميل بيانات الطقس عند النقر على المدينة
        }
    });

});


// إظهار وإخفاء البطاقة عند الضغط على زر "اختر دولة"
document.getElementById("select-country-btn").addEventListener("click", function () {
    let card = document.getElementById("country-card");
    card.classList.toggle("hidden"); // إظهار أو إخفاء البطاقة
    if (!card.classList.contains("hidden")) {
        fetchCountries(); // جلب الدول فقط عند ظهور البطاقة
    }
});

// جلب قائمة الدول
function fetchCountries() {
    fetch("https://countriesnow.space/api/v0.1/countries")
        .then(response => response.json())
        .then(data => {
            const countryList = document.getElementById("country-list");
            countryList.innerHTML = ""; // مسح المحتوى السابق

            data.data.forEach(country => {
                let countryItem = document.createElement("button");
                countryItem.textContent = country.country;
                countryItem.classList.add("country-item");
                countryItem.onclick = function () {
                    fetchCities(country.country);
                };
                countryList.appendChild(countryItem);
            });
        });
}

// جلب المدن بعد اختيار الدولة
function fetchCities(selectedCountry) {
    fetch("https://countriesnow.space/api/v0.1/countries/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry })
    })
        .then(response => response.json())
        .then(data => {
            const countryList = document.getElementById("country-list");
            countryList.innerHTML = `<h3>المدن في ${selectedCountry}</h3>`; // تحديث العنوان

            data.data.forEach(city => {
                let cityItem = document.createElement("button");
                cityItem.textContent = city;
                cityItem.classList.add("city-item");
                cityItem.onclick = function () {
                    selectCity(city); // عند اختيار المدينة
                };
                countryList.appendChild(cityItem);
            });
        });
}

// عند اختيار المدينة، يتم إغلاق البطاقة وتحديث حقل البحث
function selectCity(city) {
    document.getElementById("weather-city-input").value = city; // تحديث حقل البحث
    document.getElementById("country-card").classList.add("hidden"); // إخفاء البطاقة
}


// -------------------------------
// Modal (Login & Signup)
// -------------------------------

document.addEventListener("DOMContentLoaded", function () {
    // تحديد عناصر النوافذ المنبثقة
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const usernameDisplay = document.getElementById("usernameDisplay");
    const signinModal = document.getElementById("signinModal");
    const signupModal = document.getElementById("signupModal");
    const closeButtons = document.querySelectorAll(".modal .close");

    // النماذج
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    // التحقق من حالة المستخدم عند تحميل الصفحة
    const token = localStorage.getItem("token");
    if (token) {
        const username = localStorage.getItem("username");
        showUserUI(username);
    }

    // فتح نافذة تسجيل الدخول
    if (loginBtn) {
        loginBtn.addEventListener("click", function (event) {
            event.preventDefault();
            openModal(signinModal);
        });
    }

    // فتح نافذة التسجيل
    if (signupBtn) {
        signupBtn.addEventListener("click", function (event) {
            event.preventDefault();
            openModal(signupModal);
        });
    }

    // إغلاق النوافذ عند الضغط على زر الإغلاق "X"
    closeButtons.forEach(button => {
        button.addEventListener("click", function () {
            closeModal(this.closest(".modal"));
        });
    });

    // إغلاق النوافذ عند النقر خارج محتواها
    window.addEventListener("click", function (event) {
        if (event.target.classList.contains("modal")) {
            closeModal(event.target);
        }
    });

    // فتح المودال
    function openModal(modal) {
        if (modal) {
            modal.style.display = "flex";
            document.body.style.overflow = "hidden";

            requestAnimationFrame(() => {
                modal.classList.add("active");
                modal.querySelector("input")?.focus();
            });
        }
    }

    // إغلاق المودال
    function closeModal(modal) {
        if (modal) {
            modal.classList.remove("active");
            setTimeout(() => {
                modal.style.display = "none";
                document.body.style.overflow = "";
            }, 300);
        }
    }

    // إرسال بيانات التسجيل
    if (signupForm) {
        signupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            // التحقق من صحة البيانات
            if (!username || !email || !password || !confirmPassword) {
                alert("⚠️ يرجى ملء جميع الحقول!");
                return;
            }

            if (password !== confirmPassword) {
                alert("⚠️ كلمة المرور غير متطابقة!");
                return;
            }

            try {
                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert("✅ تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.");
                    signupForm.reset();
                    closeModal(signupModal);
                } else {
                    alert(`❌ خطأ: ${result.error}`);
                }
            } catch (error) {
                console.error("❌ خطأ في الاتصال بالسيرفر:", error);
                alert("❌ حدث خطأ أثناء الاتصال بالسيرفر!");
            }
        });
    }

    // إرسال بيانات تسجيل الدخول
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            if (!email || !password) {
                alert("⚠️ يرجى إدخال البريد الإلكتروني وكلمة المرور!");
                return;
            }

            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`✅ مرحبًا ${result.username}! تم تسجيل الدخول بنجاح.`);
                    loginForm.reset();
                    closeModal(signinModal);
                    localStorage.setItem("token", result.token); // حفظ التوكن
                    localStorage.setItem("username", result.username);

                    showUserUI(result.username); // تحديث الواجهة

                    // تحميل المدن المفضلة بعد تسجيل الدخول مباشرة
                    loadFavorites();
                    document.getElementById("open-favorites-btn").style.display = "block"; // إظهار الزر

                } else {
                    alert(`❌ خطأ: ${result.error}`);
                }
            } catch (error) {
                console.error("❌ خطأ في الاتصال بالسيرفر:", error);
                alert("❌ حدث خطأ أثناء تسجيل الدخول!");
            }
        });
    }


    // تسجيل الخروج
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            showGuestUI();
            alert("✅ تم تسجيل الخروج بنجاح.");
        });
    }

    // عرض واجهة المستخدم عند تسجيل الدخول
    function showUserUI(username) {
        if (loginBtn) loginBtn.style.display = "none";
        if (signupBtn) signupBtn.style.display = "none";
        if (logoutBtn) logoutBtn.style.display = "inline-block";
        if (usernameDisplay) {
            usernameDisplay.textContent = `مرحبًا، ${username}`;
            usernameDisplay.style.display = "inline-block";
        }
    }
    // = عرض واجهة الضيف عند تسجيل الخروج
    function showGuestUI() {
        if (loginBtn) loginBtn.style.display = "inline-block";
        if (signupBtn) signupBtn.style.display = "inline-block";
        if (logoutBtn) logoutBtn.style.display = "none";
        if (usernameDisplay) {
            usernameDisplay.textContent = "";
            usernameDisplay.style.display = "none";
        }

        // إخفاء زر " مدنك المفضلة" عند تسجيل الخروج
        const favoritesBtn = document.getElementById("open-favorites-btn");
        if (favoritesBtn) favoritesBtn.style.display = "none";
    }
});
