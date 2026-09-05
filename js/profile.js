const guestSection = document.getElementById("guest-section");
const profileSection = document.getElementById("profile-section");
const profileForm = document.getElementById("profile-form");
const nameInput = document.getElementById("name");
const bioInput = document.getElementById("bio");
const recentList = document.getElementById("recent");

function getInitials(fullName) {
  return fullName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2);
}

function renderProfile(user) {
  document.getElementById("avatar").textContent = getInitials(user.name);
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-bio").textContent = user.bio || "Nessuna bio per ora: raccontaci qualcosa di te.";
  document.getElementById("member-since").textContent = new Date(user.memberSince).toLocaleDateString("it-IT", {
    month: "long",
    year: "numeric",
  });

  nameInput.value = user.name;
  bioInput.value = user.bio;
}

function renderStats() {
  const wishlist = getWishlist();
  const visitedCount = wishlist.filter((destination) => destination.visited).length;

  document.getElementById("stat-saved").textContent = wishlist.length;
  document.getElementById("stat-visited").textContent = visitedCount;
  document.getElementById("stat-to-visit").textContent = wishlist.length - visitedCount;
}

function renderRecent() {
  const recent = getWishlist().slice(-3).reverse();
  recentList.replaceChildren();

  if (recent.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "Nessuna destinazione salvata per ora.";
    recentList.append(emptyItem);
    return;
  }

  recent.forEach((destination) => {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = `${destination.name}, ${destination.country}`;

    if (destination.countryCode) {
      const flag = document.createElement("img");
      flag.src = flagUrl(destination.countryCode);
      flag.alt = "";
      item.append(flag);
    }

    item.append(name);
    recentList.append(item);
  });
}

profileForm.addEventListener("input", (event) => {
  clearError(event.target);
});

profileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newName = nameInput.value.trim();
  if (newName.length < 2) {
    setError(nameInput, "Il nome deve avere almeno 2 caratteri");
    showFeedback("Controlla i campi evidenziati in rosso", "error");
    return;
  }

  const updatedUser = { ...getUser(), name: newName, bio: bioInput.value.trim() };
  saveUser(updatedUser);
  renderProfile(updatedUser);
  updateHeader();
  showFeedback("Profilo aggiornato");
});

document.getElementById("logout-profile").addEventListener("click", logout);

const currentUser = getUser();
if (currentUser === null) {
  guestSection.hidden = false;
} else {
  profileSection.hidden = false;
  renderProfile(currentUser);
  renderStats();
  renderRecent();
}
