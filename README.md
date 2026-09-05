# Atlante

Atlante è una piccola web app per chi ama viaggiare: cerchi una città, la salvi nella tua lista e vedi che tempo fa lì in questo momento. L'ho realizzata nella speranza di poter viaggiare di più, ma questo dipende da quanto dovrò studiare per i prossimi esami... IYKYK

## Cosa si può fare

- Cercare una città e vedere i risultati in delle card che mostrano bandiera, regione, abitanti (se disponibili, spesso no purtroppo) e coordinate
- Salvare le città in una lista personale (serve loggarsi)
- Vedere il meteo attuale e l'ora locale di ogni destinazione salvata
- Segnare una destinazione come visitata, filtrare la lista, rimuovere la card
- Accedere con un account demo e modificare nome e bio nel profilo (solo mock auth e storage, niente API o BE)
- Inviare un messaggio dal form contatti (l'invio è in realtà un console.log)

## Pagine

- index.html: home con una destinazione randomica (e un button per nuova estrazione) e il suo meteo
- explore.html: ricerca lkocalità
- wishlist.html: lista personale
- contact.html: contatti
- login.html: form di accesso
- profile.html: profilo utente

## Installazione/setup

Non serve installare nulla: basta aprire index.html nel browser. Serve la connessione a internet per le chiamate alle API e per il google font.

## Account demo

Email: demo@epicode-exam.it
Password: Esame-Superato!4SURE

Nella pagina di accesso c'è un bottone che compila i campi da solo. (Come disse, più o meno, il buon Larry Wall: la pigrizia in un dev è cosa buona)

## API usate

- Open-Meteo Geocoding per cercare le città
- Open-Meteo Forecast per il meteo attuale
- flagcdn.com per le immagini delle bandiere

Sono tutte gratuite e senza api key. I dati di Open-Meteo richiedono la citazione, l'ho messa nel footer.

## Come è organizzato il codice

C'è un solo foglio di stile (css/style.css) poiché la suddivisione semantica non avrebbe avuto senso per un progetto di queste dimensioni e sarebbe stata persino overkill. Ho creato uno script per ogni pagina e si trovano nella cartella js. Le funzioni che servono a tutte le pagine (utente, lista, meteo, messaggi di feedback, header) stanno in app.js, che ogni pagina carica prima del proprio script. Per le funzioni, diversamente da quanto detto per i file css, ho optato per maggiore granularità di specializzazione (tornata molto comoda in fase di testing).

L'utente e la lista sono salvati in localStorage che sopravvive alla chiusura di sessione. Come anticipavo, il login è simulato: non c'è alcun server e le credenziali vengono confrontate con l'account demo hardcodato; la password non viene mai salvata.

Il layout è basato su Flexbox (nessuna reale esigenza di usare grid); ho usato una media query a 768px (mantenuta la best practice risalente ad Apple, ma che tutt'ora si fa valere con Bootstrap e Tailwind come convenzione) per il menu e le card. I form sono validati in JavaScript con un messaggio sotto ogni campo. Le card vengono create clonando un template presente nell'HTML.
