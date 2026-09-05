const USER_KEY = "atlante_user";
const WISHLIST_KEY = "atlante_wishlist";
const FLASH_KEY = "atlante_flash";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const WEATHER_LABELS = {
  0: "sereno",
  1: "prevalentemente sereno",
  2: "parzialmente nuvoloso",
  3: "coperto",
  45: "nebbia",
  48: "nebbia con brina",
  51: "pioggerella leggera",
  53: "pioggerella",
  55: "pioggerella intensa",
  56: "pioggerella gelata",
  57: "pioggerella gelata intensa",
  61: "pioggia leggera",
  63: "pioggia",
  65: "pioggia intensa",
  66: "pioggia gelata",
  67: "pioggia gelata intensa",
  71: "neve leggera",
  73: "neve",
  75: "neve intensa",
  77: "granelli di neve", //! ricordati di decidere se chiamarli granelli o fiocchi
  80: "rovesci leggeri",
  81: "rovesci",
  82: "rovesci violenti",
  85: "rovesci di neve",
  86: "rovesci di neve intensi",
  95: "temporale",
  96: "temporale con grandine",
  99: "temporale con grandine forte",
};

function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getWishlist() {
  return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
}

function saveWishlist(wishlist) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
}

function flagUrl(countryCode) {
  return `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`;
}

function describePlace(place) {
  return place.region ? `${place.region}, ${place.country}` : place.country;
}

function describeWeather(code) {
  return WEATHER_LABELS[code] || "condizioni non disponibili";
}

async function fetchCurrentWeather(latitude, longitude) {
  const url = `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Errore HTTP ${response.status}`);
  }
  return response.json();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); // prsa da es.2 del capitolo 9
}

function setError(input, message) {
  input.setAttribute("aria-invalid", "true");
  document.getElementById(input.getAttribute("aria-describedby")).textContent = message;
}

function clearError(input) {
  input.removeAttribute("aria-invalid");
  const errorId = input.getAttribute("aria-describedby");
  if (errorId) {
    document.getElementById(errorId).textContent = "";
  }
}

const feedback = document.createElement("div");
feedback.id = "feedback";
feedback.setAttribute("role", "status");
document.body.append(feedback);
let feedbackTimer;

function showFeedback(message, type = "success") {
  feedback.textContent = message;
  feedback.className = `${type} visible`;
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => feedback.classList.remove("visible"), 3500);
}

function redirectWithFeedback(url, message, type = "success") {
  sessionStorage.setItem(FLASH_KEY, JSON.stringify({ message, type }));
  window.location.href = url;
}

function showPendingFeedback() {
  const flash = sessionStorage.getItem(FLASH_KEY);
  if (!flash) {
    return;
  }
  sessionStorage.removeItem(FLASH_KEY);
  const { message, type } = JSON.parse(flash);
  showFeedback(message, type);
}

function logout() {
  localStorage.removeItem(USER_KEY);
  redirectWithFeedback("index.html", "Sei uscito. A presto!");
}

function updateHeader() {
  const user = getUser();
  document.querySelectorAll('[data-auth="user"]').forEach((item) => {
    item.hidden = user === null;
  });
  document.querySelectorAll('[data-auth="guest"]').forEach((item) => {
    item.hidden = user !== null;
  });
  if (user) {
    document.getElementById("greeting").textContent = `Ciao, ${user.name.split(" ")[0]}`;
  }
}

function initHeader() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  document.getElementById("logout").addEventListener("click", logout);
  updateHeader();
}

initHeader();
showPendingFeedback();
