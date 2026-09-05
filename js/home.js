const FEATURED_DESTINATIONS = [
  { name: "Lisbona", country: "Portogallo", countryCode: "PT", latitude: 38.72, longitude: -9.14 },
  { name: "Tokyo", country: "Giappone", countryCode: "JP", latitude: 35.68, longitude: 139.69 },
  { name: "Città del Capo", country: "Sudafrica", countryCode: "ZA", latitude: -33.92, longitude: 18.42 },
  { name: "Reykjavík", country: "Islanda", countryCode: "IS", latitude: 64.15, longitude: -21.94 }, //cercare la pronuncia qualora dovessi leggerlo all'esame orale
  { name: "Buenos Aires", country: "Argentina", countryCode: "AR", latitude: -34.61, longitude: -58.38 },
  { name: "Marrakech", country: "Marocco", countryCode: "MA", latitude: 31.63, longitude: -7.99 },
  { name: "Sydney", country: "Australia", countryCode: "AU", latitude: -33.87, longitude: 151.21 },
  { name: "Vancouver", country: "Canada", countryCode: "CA", latitude: 49.28, longitude: -123.12 },
];

const liveCard = document.getElementById("live-card");
const liveStatus = document.getElementById("live-status");
const anotherButton = document.getElementById("another");
const heroCta = document.getElementById("hero-cta");
let currentDestination = null;

function pickRandomDestination() {
  const options = FEATURED_DESTINATIONS.filter((destination) => destination !== currentDestination);
  currentDestination = options[Math.floor(Math.random() * options.length)];
  return currentDestination;
}

function renderLiveCard(destination, weather) {
  const flag = liveCard.querySelector("img");
  flag.src = flagUrl(destination.countryCode);
  flag.alt = `Bandiera: ${destination.country}`;

  const localTime = new Date().toLocaleTimeString("it-IT", {
    timeZone: weather.timezone,
    hour: "2-digit",
    minute: "2-digit",
  });

  liveCard.querySelector("h2").textContent = `Adesso a ${destination.name}`;
  liveCard.querySelector('[data-field="country"]').textContent = destination.country;
  liveCard.querySelector('[data-field="temperature"]').textContent = `${Math.round(weather.current.temperature_2m)}°C`;
  liveCard.querySelector('[data-field="weather"]').textContent = describeWeather(weather.current.weather_code);
  liveCard.querySelector('[data-field="time"]').textContent = localTime;
}

async function showRandomDestination() {
  const destination = pickRandomDestination();
  anotherButton.disabled = true;
  liveStatus.textContent = "Controllo il meteo in tempo reale";
  liveStatus.classList.add("loading");

  try {
    const weather = await fetchCurrentWeather(destination.latitude, destination.longitude);
    renderLiveCard(destination, weather);
    liveStatus.textContent = "";
  } catch (error) {
    console.error(error);
    liveStatus.textContent = "Il servizio meteo non risponde. Riprova tra qualche istante.";
  } finally {
    anotherButton.disabled = false;
    liveStatus.classList.remove("loading");
  }
}

if (getUser()) {
  heroCta.textContent = "La mia lista";
  heroCta.href = "wishlist.html";
}

anotherButton.addEventListener("click", showRandomDestination);
showRandomDestination();
