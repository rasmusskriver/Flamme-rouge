/* ========================================
   GAME DATA & CONFIGURATION
   ======================================== */

// Player data structure
let ryttereData = {
  spiller1_sprinter: {
    navn: "Spiller 1 - Sprinter",
    type: "sprinter",
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  spiller1_allaround: {
    navn: "Spiller 1 - Allaround",
    type: "allaround",
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  spiller2_sprinter: {
    navn: "Spiller 2 - Sprinter",
    type: "sprinter",
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  spiller2_allaround: {
    navn: "Spiller 2 - Allaround",
    type: "allaround",
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
};

// Card sets for different rider types
const sprinterKort = [2, 2, 3, 3, 4, 4, 5, 5, 9, 9, 9, 9, 9, 9, 9];
const allaroundKort = [3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7];

// Game state management
let aktivSpiller = null;
let spilletilstand = {
  fase: "vælg_kort", // "vælg_kort" or "vis_resultater"
  valgtekort: {},
  rundeDone: false,
  aktivSpiller: "spiller1", // "spiller1" or "spiller2"
  spillerRækkefolge: ["spiller1", "spiller2"],
};

/* ========================================
   GAME INITIALIZATION
   ======================================== */

function opretRyttere() {
  let container = document.getElementById("ryttere");
  container.innerHTML = "";

  // Create player sections
  let spiller1Div = document.createElement("div");
  spiller1Div.className = "spiller-sektion spiller1";
  spiller1Div.id = "spiller1-sektion";
  spiller1Div.innerHTML = '<div class="spillertitel">🚴‍♂️ Spiller 1</div>';

  let spiller2Div = document.createElement("div");
  spiller2Div.className = "spiller-sektion spiller2";
  spiller2Div.id = "spiller2-sektion";
  spiller2Div.innerHTML = '<div class="spillertitel">🚴‍♀️ Spiller 2</div>';

  // Create rider components for each player
  for (let key in ryttereData) {
    let rytter = ryttereData[key];

    // Assign correct cards based on rider type
    if (rytter.type === "sprinter") {
      rytter.bunke = [...sprinterKort];
    } else {
      rytter.bunke = [...allaroundKort];
    }

    // Reset rider state
    rytter.træthed = [];
    rytter.brugtekort = [];
    rytter.fravalgtkort = [];
    rytter.dragnekort = [];

    let div = document.createElement("div");
    div.className = "rytter";
    div.id = key;

    // Different colors for each rider type
    let borderColor = rytter.type === "sprinter" ? "#ff6b35" : "#28a745";
    div.style.borderColor = borderColor;

    div.innerHTML = `
      <h2>${rytter.navn}</h2>
      <div class="info" id="${key}-info"></div>
      <button onclick="trækKort('${key}')" id="${key}-træk-btn">Træk 4 kort</button>
      <div id="${key}-kort" class="kortvalg" style="margin: 15px 0;"></div>
      <div id="${key}-valgt" style="margin: 10px 0; font-weight: bold; color: green;"></div>
      <button onclick="tilføjTræthed('${key}')" style="background-color: #dc3545;">
        Tilføj træthedskort (2)
      </button>
    `;

    // Add rider to correct player section
    if (key.includes("spiller1")) {
      spiller1Div.appendChild(div);
    } else {
      spiller2Div.appendChild(div);
    }
  }

  container.appendChild(spiller1Div);
  container.appendChild(spiller2Div);

  opdaterAktivSpiller();
  opdaterUI();
}

function nytSpil() {
  // Reset all riders
  for (let key in ryttereData) {
    let rytter = ryttereData[key];

    // Assign correct cards based on rider type
    if (rytter.type === "sprinter") {
      rytter.bunke = [...sprinterKort];
    } else {
      rytter.bunke = [...allaroundKort];
    }

    rytter.træthed = [];
    rytter.brugtekort = [];
    rytter.fravalgtkort = [];
    rytter.dragnekort = [];
    rytter.position = 0;
    document.getElementById(`${key}-kort`).innerHTML = "";
  }

  aktivSpiller = null;
  blandAlle();
  visNotifikation("Nyt spil startet! Spiller 1 begynder.", "success");

  // Reset game state
  spilletilstand.fase = "vælg_kort";
  spilletilstand.valgtekort = {};
  spilletilstand.aktivSpiller = "spiller1";
  opdaterAktivSpiller();
  opdaterRundeStatus();
}

/* ========================================
   CARD MANAGEMENT
   ======================================== */

function blandAlle() {
  for (let key in ryttereData) {
    ryttereData[key].bunke.sort(() => Math.random() - 0.5);
  }
  opdaterUI();
}

function trækKort(rytter) {
  if (spilletilstand.fase !== "vælg_kort") {
    visNotifikation(
      "Venter på at alle spillere har valgt kort!",
      "warning"
    );
    return;
  }

  if (!rytter.includes(spilletilstand.aktivSpiller)) {
    visNotifikation(
      `Det er ${
        spilletilstand.aktivSpiller === "spiller1"
          ? "Spiller 1"
          : "Spiller 2"
      }s tur!`,
      "warning"
    );
    return;
  }

  if (spilletilstand.valgtekort[rytter]) {
    visNotifikation(
      "Du har allerede valgt kort for denne rytter!",
      "warning"
    );
    return;
  }

  let r = ryttereData[rytter];

  // Check if there are enough cards in deck
  if (r.bunke.length < 4) {
    // First: shuffle discarded cards back
    if (r.fravalgtkort.length > 0) {
      r.bunke = r.bunke.concat(r.fravalgtkort);
      r.fravalgtkort = [];
      r.bunke.sort(() => Math.random() - 0.5);
      visNotifikation(
        `${r.navn}: Fravalgte kort blandet tilbage i bunken!`,
        "info"
      );
    }

    // If still not enough cards, shuffle fatigue cards back
    if (r.bunke.length < 4 && r.træthed.length > 0) {
      r.bunke = r.bunke.concat(r.træthed);
      r.træthed = [];
      r.bunke.sort(() => Math.random() - 0.5);
      visNotifikation(
        `${r.navn}: Træthedskort også blandet tilbage i bunken!`,
        "info"
      );
    }
  }

  if (r.bunke.length < 4) {
    visNotifikation(
      `${r.navn} har ikke nok kort til at trække 4!`,
      "warning"
    );
    return;
  }

  // Draw 4 cards
  r.dragnekort = [];
  for (let i = 0; i < 4; i++) {
    r.dragnekort.push(r.bunke.pop());
  }

  aktivSpiller = rytter;
  visDragneKort(rytter);
}

function visDragneKort(rytter) {
  let kortDiv = document.getElementById(`${rytter}-kort`);
  let r = ryttereData[rytter];

  kortDiv.innerHTML = `
    <h3>Vælg et kort at spille:</h3>
    <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 15px 0;">
      ${r.dragnekort
        .map(
          (kort, index) =>
            `<button onclick="vælgKort('${rytter}', ${index})" class="kortvalg-knap">${kort}</button>`
        )
        .join("")}
    </div>
  `;
}

function vælgKort(rytter, kortIndex) {
  let r = ryttereData[rytter];
  let valgtKort = r.dragnekort[kortIndex];

  // Store the selected card secretly
  spilletilstand.valgtekort[rytter] = {
    kort: valgtKort,
    dragnekort: [...r.dragnekort],
  };

  // Remove the selected card from drawn cards
  r.dragnekort.splice(kortIndex, 1);

  // Put remaining cards in discarded cards (not back in deck)
  r.fravalgtkort = r.fravalgtkort.concat(r.dragnekort);
  r.dragnekort = [];

  // Show that card is selected, but not which one
  document.getElementById(`${rytter}-kort`).innerHTML = "";
  document.getElementById(`${rytter}-valgt`).innerHTML =
    "✓ Kort valgt hemmeligt";
  document.getElementById(`${rytter}-træk-btn`).disabled = true;

  aktivSpiller = null;

  // Check if player has selected for both riders
  let spillerNavn = rytter.includes("spiller1") ? "spiller1" : "spiller2";
  let sprinter = spillerNavn + "_sprinter";
  let allaround = spillerNavn + "_allaround";

  if (
    spilletilstand.valgtekort[sprinter] &&
    spilletilstand.valgtekort[allaround]
  ) {
    // Player is done, switch to next player or finish
    if (skiftTilNæsteSpiller()) {
      // All have selected, show cards
      setTimeout(() => {
        spilletilstand.fase = "vis_resultater";
        visAlleKort();
      }, 1000);
    }
  }

  tjekOmAlleHarValgt();
}

function tilføjTræthed(rytter) {
  let r = ryttereData[rytter];
  // Add fatigue card (value 2) to fatigue deck
  r.træthed.push(2);
  visNotifikation(`${r.navn} får et træthedskort (værdi 2)`, "warning");
  opdaterUI();
}

/* ========================================
   GAME FLOW CONTROL
   ======================================== */

function skiftTilNæsteSpiller() {
  let nuværendeIndex = spilletilstand.spillerRækkefolge.indexOf(
    spilletilstand.aktivSpiller
  );
  let næsteIndex =
    (nuværendeIndex + 1) % spilletilstand.spillerRækkefolge.length;
  spilletilstand.aktivSpiller =
    spilletilstand.spillerRækkefolge[næsteIndex];

  opdaterAktivSpiller();

  if (spilletilstand.aktivSpiller === "spiller1") {
    visNotifikation(
      "Alle spillere har valgt kort! Kort afsløres nu.",
      "success"
    );
    return true; // All have selected
  } else {
    visNotifikation("Spiller 2s tur!", "info");
    return false;
  }
}

function tjekOmAlleHarValgt() {
  let antalValgte = Object.keys(spilletilstand.valgtekort).length;
  let antalRyttere = Object.keys(ryttereData).length;

  if (antalValgte === antalRyttere) {
    spilletilstand.fase = "vis_resultater";
    visAlleKort();
  }

  opdaterRundeStatus();
}

function nytRunde() {
  // Reset to new round
  spilletilstand.fase = "vælg_kort";
  spilletilstand.valgtekort = {};
  spilletilstand.aktivSpiller = "spiller1";

  // Hide result container and show main content
  document.getElementById("resultat-container").classList.remove("vis");
  document.getElementById("main-content").classList.remove("hidden");
  document.querySelector(".menu-knap").style.display = "block";

  // Reset UI
  for (let key in ryttereData) {
    document.getElementById(`${key}-valgt`).innerHTML = "";
    document.getElementById(`${key}-kort`).innerHTML = "";
    document.getElementById(`${key}-træk-btn`).disabled = false;
  }

  opdaterAktivSpiller();
  opdaterRundeStatus();
  opdaterUI();
  visNotifikation("Ny runde startet! Spiller 1 begynder.", "info");
}

/* ========================================
   RESULTS DISPLAY
   ======================================== */

function visAlleKort() {
  let resultater = [];
  let resultatGrid = document.getElementById("resultat-grid");
  resultatGrid.innerHTML = "";

  for (let rytter in spilletilstand.valgtekort) {
    let valg = spilletilstand.valgtekort[rytter];
    let r = ryttereData[rytter];

    // Move selected card to used cards
    r.brugtekort.push(valg.kort);
    r.position += valg.kort;

    resultater.push(`${r.navn}: ${valg.kort}`);

    // Create result card for display
    let resultatKort = document.createElement("div");
    resultatKort.className = "resultat-kort";
    resultatKort.innerHTML = `
      <div class="resultat-rytter">${r.navn}</div>
      <div class="resultat-kort-værdi">${valg.kort}</div>
      <div class="resultat-position">Ny position: ${r.position}</div>
      <div class="resultat-actions">
        <button onclick="tilføjTræthedResultat('${rytter}')">
          ⚡ Tilføj træthedskort
        </button>
      </div>
    `;
    resultatGrid.appendChild(resultatKort);

    // Update rider display
    document.getElementById(
      `${rytter}-valgt`
    ).innerHTML = `Spillede kort: ${valg.kort}`;
  }

  // Show result container with animation
  document.getElementById("resultat-container").classList.add("vis");
  document.getElementById("main-content").classList.add("hidden");
  document.querySelector(".menu-knap").style.display = "none";

  // Show both players
  opdaterAktivSpiller();

  visNotifikation(
    "Alle kort afsløret! Tilføj træthedskort hvis nødvendigt.",
    "success"
  );
  opdaterUI();
}

function skjulResultater() {
  // This starts a new round
  nytRunde();
}

function tilføjTræthedResultat(rytter) {
  let r = ryttereData[rytter];
  r.træthed.push(2);
  visNotifikation(`${r.navn} får et træthedskort (værdi 2)`, "warning");

  // Update display in result screen
  let resultatKort = event.target.closest(".resultat-kort");
  let positionDiv = resultatKort.querySelector(".resultat-position");
  let nuværendeText = positionDiv.innerHTML;
  if (!nuværendeText.includes("Træthedskort:")) {
    positionDiv.innerHTML =
      nuværendeText + `<br>Træthedskort: ${r.træthed.length}`;
  } else {
    positionDiv.innerHTML = positionDiv.innerHTML.replace(
      /Træthedskort: \d+/,
      `Træthedskort: ${r.træthed.length}`
    );
  }

  opdaterUI();
}

/* ========================================
   UI MANAGEMENT
   ======================================== */

function visNotifikation(besked, type = "info") {
  let notification = document.getElementById("notification");
  notification.textContent = besked;
  notification.className = `notification ${type}`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

function opdaterAktivSpiller() {
  // Hide all players first
  document
    .getElementById("spiller1-sektion")
    .classList.remove("aktiv", "vis-alle");
  document
    .getElementById("spiller2-sektion")
    .classList.remove("aktiv", "vis-alle");

  // Show only the active player
  if (spilletilstand.fase === "vælg_kort") {
    document
      .getElementById(`${spilletilstand.aktivSpiller}-sektion`)
      .classList.add("aktiv");
  } else {
    // Show both players when cards are revealed
    document.getElementById("spiller1-sektion").classList.add("vis-alle");
    document.getElementById("spiller2-sektion").classList.add("vis-alle");
  }

  // Disable buttons for inactive player
  for (let key in ryttereData) {
    let erAktivSpiller = key.includes(spilletilstand.aktivSpiller);
    let trakBtn = document.getElementById(`${key}-træk-btn`);
    if (trakBtn) {
      trakBtn.disabled =
        !erAktivSpiller ||
        spilletilstand.valgtekort[key] ||
        spilletilstand.fase !== "vælg_kort";
    }
  }
}

function opdaterRundeStatus() {
  let status = document.getElementById("rundestatus");

  if (spilletilstand.fase === "vælg_kort") {
    let aktivSpillerNavn =
      spilletilstand.aktivSpiller === "spiller1"
        ? "Spiller 1"
        : "Spiller 2";
    status.innerHTML = `${aktivSpillerNavn}s tur - Vælg kort for begge ryttere`;
    status.style.color =
      spilletilstand.aktivSpiller === "spiller1" ? "#007acc" : "#dc3545";
  } else {
    status.innerHTML =
      "Alle kort afsløret! Klik 'Ny runde' for næste runde";
    status.style.color = "#28a745";
  }

  opdaterKnappeVisning();
}

function opdaterUI() {
  for (let key in ryttereData) {
    let r = ryttereData[key];
    let info = `Position: ${r.position}\nKort i bunke: ${r.bunke.length}\nTræthedskort: ${r.træthed.length}\nBrugte kort: ${r.brugtekort.length}\nFravalgte kort: ${r.fravalgtkort.length}`;
    if (r.brugtekort.length > 0) {
      info += `\nSidste brugte kort: ${
        r.brugtekort[r.brugtekort.length - 1]
      }`;
    }
    document.getElementById(`${key}-info`).innerText = info;
  }
}

function opdaterKnappeVisning() {
  let spillKnapper = document.getElementById("spil-knapper");
  let menuKnap = document.querySelector(".menu-knap");

  // Hide buttons when players select cards, show only in result phase
  if (spilletilstand.fase === "vælg_kort") {
    spillKnapper.classList.add("skjult");
    menuKnap.style.display = "block";
  } else {
    spillKnapper.classList.remove("skjult");
    menuKnap.style.display = "none"; // Hide menu when results are shown
    // Only "New round" button in main game
    spillKnapper.innerHTML = `
      <button onclick="nytRunde()" style="background-color: #17a2b8; margin: 10px;">
        🚴‍♂️ Ny runde 🚴‍♀️
      </button>
    `;
  }
}

/* ========================================
   MENU SYSTEM
   ======================================== */

function visMmenu() {
  document.getElementById("menu-overlay").classList.add("vis");
}

function skjulMenu() {
  document.getElementById("menu-overlay").classList.remove("vis");
}

/* ========================================
   GAME INITIALIZATION & PWA
   ======================================== */

// Initialize the game
document.addEventListener("DOMContentLoaded", function() {
  opretRyttere();
  blandAlle();
  opdaterRundeStatus();
  visNotifikation(
    "Velkommen til Flamme Rouge! Spiller 1 begynder.",
    "info"
  );

  // PWA Service Worker registration
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registreret med success: ",
          registration.scope
        );
      },
      function (err) {
        console.log("ServiceWorker registrering fejlede: ", err);
      }
    );
  }
});