(function() {
  // Create shadow root container
  const container = document.createElement("div");
  container.style.display = "inline-block";
  const shadow = container.attachShadow({ mode: "open" });

  // Inject CSS + HTML
  shadow.innerHTML = `
    <style>
      .card {
        font-family: system-ui, sans-serif;
        padding: 16px;
        border-radius: 12px;
        width: 220px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        transition: background .3s, color .3s;
        box-sizing: border-box;
      }
      @media (prefers-color-scheme: light) {
        .card { background: #fff; color: #111; }
      }
      @media (prefers-color-scheme: dark) {
        .card { background: #111; color: #fff; }
      }
      .temp { font-size: 32px; font-weight: 600; }
      .desc { opacity: .7; }
      .city { font-size: 14px; opacity: .5; }
    </style>

    <div class="card">
      <div class="temp" id="temp">--°</div>
      <div class="desc" id="desc">Loading...</div>
      <div class="city" id="city">Detecting...</div>
    </div>
  `;

  document.currentScript.replaceWith(container);

  const tempEl = shadow.getElementById("temp");
  const descEl = shadow.getElementById("desc");
  const cityEl = shadow.getElementById("city");

  async function detectLocation() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();
      return {
        city: data.city,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (e) {
      return null;
    }
  }

  async function loadWeather() {
    const loc = await detectLocation();

    if (!loc) {
      descEl.textContent = "Location unavailable";
      cityEl.textContent = "";
      return;
    }

    cityEl.textContent = loc.city;

    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current_weather=true`
    ).then(r => r.json());

    tempEl.textContent = weather.current_weather.temperature + "°";
    descEl.textContent = "Weather code " + weather.current_weather.weathercode;
  }

  loadWeather();
})();
