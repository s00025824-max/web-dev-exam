const guestMessage = document.getElementById("guest-message");
const tools = document.getElementById("tools");
const summary = document.getElementById("summary");
const filterButtons = tools.querySelectorAll("[data-filter]");
const statusMessage = document.getElementById("status");
const destinationsList = document.getElementById("destinations");
const cardTemplate = document.getElementById("destination-card");
let currentFilter = "all";

async function loadWeather(destination, target) {
  try {
    const weather = await fetchCurrentWeather(destination.latitude, destination.longitude);
    target.textContent = `${Math.round(weather.current.temperature_2m)}°C, ${describeWeather(weather.current.weather_code)}`;
  } catch (error) {
    console.error(error);
    target.textContent = "non disponibile";
  }
}

function createCard(destination) {
  const item = cardTemplate.content.firstElementChild.cloneNode(true);
  item.dataset.id = destination.id;
  item.dataset.visited = String(destination.visited);
  item.querySelector("article").classList.toggle("visited", destination.visited);

  const flag = item.querySelector("img");
  if (destination.countryCode) {
    flag.src = flagUrl(destination.countryCode);
    flag.alt = `Bandiera: ${destination.country}`;
  } else {
    flag.remove();
  }

  item.querySelector("h2").textContent = destination.name;
  item.querySelector('[data-field="place"]').textContent = describePlace(destination);
  item.querySelector('[data-field="date"]').textContent = new Date(destination.savedAt).toLocaleDateString("it-IT");
  item.querySelector("input").checked = destination.visited;

  loadWeather(destination, item.querySelector('[data-field="weather"]'));
  return item;
}

function updateSummary() {
  const wishlist = getWishlist();
  const visitedCount = wishlist.filter((destination) => destination.visited).length;
  summary.textContent = `Destinazioni salvate: ${wishlist.length}. Già visitate: ${visitedCount}.`;
}

function applyFilter() {
  const items = destinationsList.querySelectorAll("li");
  let visibleCount = 0;

  items.forEach((item) => {
    const visited = item.dataset.visited === "true";
    const matches =
      currentFilter === "all" ||
      (currentFilter === "visited" && visited) ||
      (currentFilter === "to-visit" && !visited);
    item.hidden = !matches;
    if (matches) {
      visibleCount += 1;
    }
  });

  if (items.length === 0) {
    statusMessage.textContent = "La tua lista è vuota. Cerca una destinazione e salvala qui.";
  } else if (visibleCount === 0) {
    statusMessage.textContent = "Nessuna destinazione in questa categoria.";
  } else {
    statusMessage.textContent = "";
  }
}

function renderWishlist() {
  const wishlist = getWishlist();
  destinationsList.replaceChildren();
  wishlist.forEach((destination) => destinationsList.append(createCard(destination)));
  updateSummary();
  applyFilter();
}

function toggleVisited(item, visited) {
  const wishlist = getWishlist();
  const destination = wishlist.find((candidate) => candidate.id === Number(item.dataset.id));
  destination.visited = visited;
  saveWishlist(wishlist);

  item.dataset.visited = String(visited);
  item.querySelector("article").classList.toggle("visited", visited);
  updateSummary();
  applyFilter();
  showFeedback(visited ? `${destination.name} segnata come visitata` : `${destination.name} tornata tra le mete da visitare`);
}

function removeDestination(item) {
  const wishlist = getWishlist().filter((destination) => destination.id !== Number(item.dataset.id));
  saveWishlist(wishlist);

  item.remove();
  updateSummary();
  applyFilter();
  showFeedback("Destinazione rimossa dalla lista");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    applyFilter();
  });
});

destinationsList.addEventListener("change", (event) => {
  if (event.target.type === "checkbox") {
    toggleVisited(event.target.closest("li"), event.target.checked);
  }
});

destinationsList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) {
    removeDestination(button.closest("li"));
  }
});

if (getUser() === null) {
  guestMessage.hidden = false;
} else {
  tools.hidden = false;
  renderWishlist();
}
