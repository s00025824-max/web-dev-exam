const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const topicSelect = document.getElementById("topic");
const messageInput = document.getElementById("message");
const privacyCheckbox = document.getElementById("privacy");
const counter = document.getElementById("counter");

function validateContactForm() {
  let isValid = true;

  if (nameInput.value.trim().length < 2) {
    setError(nameInput, "Inserisci il tuo nome (almeno 2 caratteri)");
    isValid = false;
  }

  if (!isValidEmail(emailInput.value.trim())) {
    setError(emailInput, "Inserisci un indirizzo email valido");
    isValid = false;
  }

  if (topicSelect.value === "") {
    setError(topicSelect, "Scegli il motivo del messaggio");
    isValid = false;
  }

  if (messageInput.value.trim().length < 20) {
    setError(messageInput, "Il messaggio deve avere almeno 20 caratteri");
    isValid = false;
  }

  if (!privacyCheckbox.checked) {
    setError(privacyCheckbox, "Devi accettare l'informativa sulla privacy");
    isValid = false;
  }

  return isValid;
}

function updateCounter() {
  counter.textContent = `(${messageInput.value.length}/${messageInput.maxLength})`;
}

contactForm.addEventListener("input", (event) => {
  clearError(event.target);
});

messageInput.addEventListener("input", updateCounter);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateContactForm()) {
    showFeedback("Controlla i campi evidenziati in rosso", "error");
    contactForm.querySelector('[aria-invalid="true"]').focus();
    return;
  }

  const formData = Object.fromEntries(new FormData(contactForm));
  console.log("Messaggio inviato:", formData);

  contactForm.reset();
  updateCounter();
  showFeedback("Messaggio inviato! Ti risponderemo al più presto.");
});
