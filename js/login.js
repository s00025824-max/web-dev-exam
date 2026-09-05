const DEMO_USER = {
  name: "Massimiliano Longo",
  email: "demo@epicode-exam.it",
  password: "Esame-Superato!4SURE",
  memberSince: "2026-08-01",
};

const loginSection = document.getElementById("login-section");
const loggedSection = document.getElementById("logged-section");
const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const fillDemoButton = document.getElementById("fill-demo");

function validateLoginForm() {
  let isValid = true;

  if (!isValidEmail(emailInput.value.trim())) {
    setError(emailInput, "Inserisci un indirizzo email valido");
    isValid = false;
  }

  if (passwordInput.value.length < 6) {
    setError(passwordInput, "La password deve avere almeno 6 caratteri");
    isValid = false;
  }

  return isValid;
}

function credentialsMatch() {
  return emailInput.value.trim().toLowerCase() === DEMO_USER.email && passwordInput.value === DEMO_USER.password;
}

loginForm.addEventListener("input", (event) => {
  clearError(event.target);
});

fillDemoButton.addEventListener("click", () => {
  emailInput.value = DEMO_USER.email;
  passwordInput.value = DEMO_USER.password;
  clearError(emailInput);
  clearError(passwordInput);
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateLoginForm()) {
    showFeedback("Controlla i campi evidenziati in rosso", "error");
    return;
  }

  if (!credentialsMatch()) {
    setError(passwordInput, "Email o password non corretti");
    showFeedback("Credenziali non valide, riprova", "error");
    return;
  }

  saveUser({
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    memberSince: DEMO_USER.memberSince,
    bio: "",
  });
  redirectWithFeedback("profile.html", `Accesso effettuato. Ciao, ${DEMO_USER.name}!`);
});

const currentUser = getUser();
if (currentUser) {
  loginSection.hidden = true;
  loggedSection.hidden = false;
  document.getElementById("logged-name").textContent = currentUser.name;
}
