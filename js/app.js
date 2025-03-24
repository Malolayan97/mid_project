(function ($, document, window) {
    $(document).ready(function () {

        // 🔹 إبقاء القائمة الجانبية (Mobile Menu)
        $(".mobile-navigation").append($(".main-navigation .menu").clone());
        $(".menu-toggle").click(function () {
            $(".mobile-navigation").slideToggle();
        });

        // 🔹 جلب بيانات الطقس عند البحث
        $(".find-location").submit(function (event) {
            event.preventDefault(); // منع التحديث التلقائي للصفحة

            var city = $("input[type='text']").val().trim();
            if (!city) {
                alert("Please enter a city name");
                return;
            }

            fetch(`/api/weather?city=${city}`)
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        alert("Error fetching weather data");
                        return;
                    }

                    // 🔹 تحديث بيانات الطقس في الصفحة
                    $(".location").text(data.name);
                    $(".degree .num").html(`${data.main.temp}<sup>o</sup>C`);
                    $(".forecast-icon img").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
                    $(".forecast-header .day").text(new Date().toLocaleDateString("en-US", { weekday: 'long' }));
                    $(".forecast-header .date").text(new Date().toLocaleDateString());
                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Could not fetch weather data");
                });
        });

    });

})(jQuery, document, window);
