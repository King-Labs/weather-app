const apiKey = "38d2e8ebf0624909e407e531afd7993f";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather";

document.getElementById("getWeather").addEventListener("click", async () => {
  const city = document.getElementById("city").value.trim();
  const weatherInfo = document.getElementById("weatherInfo");

  if (!city) {
    weatherInfo.innerHTML = "<p>Please enter a city name!</p>";
    weatherInfo.classList.remove("hidden");
    return;
  }

  // استخدام encodeURIComponent لضمان إرسال النصوص بشكل صحيح
  const lang = detectLanguage(city); // تعيين اللغة بناءً على المدينة المدخلة
  const url = `${apiUrl}?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric&lang=${lang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");

    const data = await response.json();

    // تحديد التوقيت بناءً على اللغة
    const timeLocale = lang === "ar" ? "ar" : lang === "ru" ? "ru" : "en";

    weatherInfo.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p><strong>${
        lang === "ar"
          ? "درجة الحرارة"
          : lang === "ru"
          ? "Температура"
          : "Temperature"
      }:</strong> ${data.main.temp} °C</p>
      <p><strong>${
        lang === "ar"
          ? "غطاء السحب"
          : lang === "ru"
          ? "Облачность"
          : "Cloud Coverage"
      }:</strong> ${data.clouds.all}%</p>
      <p><strong>${
        lang === "ar" ? "الوقت" : lang === "ru" ? "Время" : "Time"
      }:</strong> ${new Date().toLocaleTimeString(timeLocale)}</p>
    `;
    weatherInfo.classList.remove("hidden");
  } catch (error) {
    weatherInfo.innerHTML = `<p>Error: ${error.message}</p>`;
    weatherInfo.classList.remove("hidden");
  }
});

// وظيفة للكشف عن اللغة المدخلة في اسم المدينة
function detectLanguage(city) {
  const arabicRegex = /[\u0600-\u06FF]/;
  const russianRegex = /[\u0400-\u04FF]/;

  if (arabicRegex.test(city)) return "ar";
  if (russianRegex.test(city)) return "ru";
  return "en";
}
