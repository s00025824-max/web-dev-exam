const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city");
const statusMessage = document.getElementById("status");
const resultsList = document.getElementById("results");
const cardTemplate = document.getElementById("city-card");
let cities = [];

function formatCity(result) {
  return {
    id: result.id,
    name: result.name,
    region: result.admin1 || "",
    country: result.country || "",
    countryCode: result.country_code || "",
    latitude: result.latitude,
    longitude: result.longitude,
    population: result.population || 0,
  };
}

function markAsSaved(button) {
  button.textContent = "Nella tua lista";
  button.disabled = true;
}

function createCard(city, wishlist) {
  const item = cardTemplate.content.firstElementChild.cloneNode(true);
  item.dataset.id = city.id;

  const flag = item.querySelector("img");
  if (city.countryCode) {
    flag.src = flagUrl(city.countryCode);
    flag.alt = `Bandiera: ${city.country}`;
  } else {
    flag.remove();
  }

  item.querySelector("h2").textContent = city.name;
  item.querySelector('[data-field="place"]').textContent = describePlace(city);
  item.querySelector('[data-field="population"]').textContent = city.population
    ? city.population.toLocaleString("it-IT")
    : "non disponibile";
  item.querySelector('[data-field="coordinates"]').textContent = `${city.latitude.toFixed(2)}, ${city.longitude.toFixed(2)}`;

  const alreadySaved = wishlist.some((destination) => destination.id === city.id);
  if (alreadySaved) {
    markAsSaved(item.querySelector("button"));
  }
  return item;
}

function renderResults(query) {
  const wishlist = getWishlist();
  resultsList.replaceChildren();
  cities.forEach((city) => resultsList.append(createCard(city, wishlist)));

  if (cities.length === 0) {
    statusMessage.textContent = `Nessun risultato per "${query}". Prova con un nome diverso.`;
  } else {
    const label = cities.length === 1 ? "risultato" : "risultati";
    statusMessage.textContent = `${cities.length} ${label} per "${query}"`;
  }
}

async function searchCities(query) {
  statusMessage.textContent = "Ricerca in corso";
  statusMessage.classList.add("loading");
  resultsList.replaceChildren();

  //! Se avanza tempo implementare ricerca live con debounce

  try {
    const response = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(query)}&count=12&language=it&format=json`);
    if (!response.ok) {
      throw new Error(`Errore HTTP ${response.status}`);
    }
    const data = await response.json();
    cities = (data.results || []).map(formatCity);
    renderResults(query);
  } catch (error) {
    console.error(error);
    statusMessage.textContent = "Impossibile completare la ricerca. Controlla la connessione e riprova.";
  } finally {
    statusMessage.classList.remove("loading");
  }
}

function saveDestination(item) {
  if (getUser() === null) {
    showFeedback("Accedi per salvare le destinazioni nella tua lista", "error");
    return;
  }

  const city = cities.find((candidate) => candidate.id === Number(item.dataset.id));
  const wishlist = getWishlist();
  wishlist.push({ ...city, visited: false, savedAt: new Date().toISOString() });
  saveWishlist(wishlist);

  markAsSaved(item.querySelector("button"));
  showFeedback(`${city.name} aggiunta alla tua lista`);
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = cityInput.value.trim();
  // 2ch min attivazione -> in questo caso d'uso in cui alcune dstinazioni hanno nomi da 2 lettere è meglio dello standard 3ch
  if (query.length < 2) {
    setError(cityInput, "Inserisci almeno 2 caratteri");
    return;
  }
  clearError(cityInput);
  searchCities(query);
});

cityInput.addEventListener("input", () => clearError(cityInput));

resultsList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) {
    saveDestination(button.closest("li"));
  }
});
