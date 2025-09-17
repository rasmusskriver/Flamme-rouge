/* ========================================
   GAME DATA & CONFIGURATION
   ======================================== */

// Player data structure - 8 riders total (4 colors x 2 types each)
let ryttereData = {
  roed_sprinter: {
    navn: '🔴 Rød Sprinter',
    type: 'sprinter',
    farve: 'roed',
    farveDisplay: '🔴 Rød',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  roed_allaround: {
    navn: '🔴 Rød Allaround',
    type: 'allaround',
    farve: 'roed',
    farveDisplay: '🔴 Rød',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  sort_sprinter: {
    navn: '⚫ Sort Sprinter',
    type: 'sprinter',
    farve: 'sort',
    farveDisplay: '⚫ Sort',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  sort_allaround: {
    navn: '⚫ Sort Allaround',
    type: 'allaround',
    farve: 'sort',
    farveDisplay: '⚫ Sort',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  groen_sprinter: {
    navn: '🟢 Grøn Sprinter',
    type: 'sprinter',
    farve: 'groen',
    farveDisplay: '🟢 Grøn',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  groen_allaround: {
    navn: '🟢 Grøn Allaround',
    type: 'allaround',
    farve: 'groen',
    farveDisplay: '🟢 Grøn',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  blaa_sprinter: {
    navn: '🔵 Blå Sprinter',
    type: 'sprinter',
    farve: 'blaa',
    farveDisplay: '🔵 Blå',
    bunke: [],
    træthed: [],
    brugtekort: [],
    fravalgtkort: [],
    position: 0,
    dragnekort: [],
  },
  blaa_allaround: {
    navn: '🔵 Blå Allaround',
    type: 'allaround',
    farve: 'blaa',
    farveDisplay: '🔵 Blå',
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
  fase: 'vælg_kort', // "vælg_kort" or "vis_resultater"
  valgtekort: {},
  rundeDone: false,
  aktivSpiller: 'roed', // "roed", "sort", "groen", "blaa"
  spillerRækkefolge: ['roed', 'sort', 'groen', 'blaa'],
};

/* ========================================
   LOCAL STORAGE - GAME STATE PERSISTENCE
   ======================================== */

function gemSpilTilstand() {
  try {
    const spilldata = {
      ryttereData: ryttereData,
      spilletilstand: spilletilstand,
      aktivSpiller: aktivSpiller,
      timestamp: new Date().getTime(),
    };
    localStorage.setItem('flammeRougeSpildata', JSON.stringify(spilldata));
  } catch (error) {
    console.error('Kunne ikke gemme spiltilstand:', error);
  }
}

function indlæsSpilTilstand() {
  try {
    const gemt = localStorage.getItem('flammeRougeSpildata');
    if (gemt) {
      const spilldata = JSON.parse(gemt);

      // Check if saved data is less than 7 days old
      const now = new Date().getTime();
      const dageSiden = (now - spilldata.timestamp) / (1000 * 60 * 60 * 24);

      if (dageSiden < 7) {
        ryttereData = spilldata.ryttereData;
        spilletilstand = spilldata.spilletilstand;
        aktivSpiller = spilldata.aktivSpiller;
        return true;
      } else {
        // Remove old save data
        localStorage.removeItem('flammeRougeSpildata');
      }
    }
  } catch (error) {
    console.error('Kunne ikke indlæse spiltilstand:', error);
    localStorage.removeItem('flammeRougeSpildata');
  }
  return false;
}

function rydGemtSpildata() {
  try {
    localStorage.removeItem('flammeRougeSpildata');
    visNotifikation('Gemt spildata er ryddet!', 'info');
  } catch (error) {
    console.error('Kunne ikke rydde gemt data:', error);
  }
}

/* ========================================
   GAME INITIALIZATION
   ======================================== */

function opretRyttere() {
  let container = document.getElementById('ryttere');
  container.innerHTML = '';

  // Create color sections for each team
  let roedDiv = document.createElement('div');
  roedDiv.className = 'spiller-sektion farve-roed';
  roedDiv.id = 'roed-sektion';
  roedDiv.innerHTML = '<div class="spillertitel">🔴 Røde Ryttere</div>';

  let sortDiv = document.createElement('div');
  sortDiv.className = 'spiller-sektion farve-sort';
  sortDiv.id = 'sort-sektion';
  sortDiv.innerHTML = '<div class="spillertitel">⚫ Sorte Ryttere</div>';

  let groenDiv = document.createElement('div');
  groenDiv.className = 'spiller-sektion farve-groen';
  groenDiv.id = 'groen-sektion';
  groenDiv.innerHTML = '<div class="spillertitel">🟢 Grønne Ryttere</div>';

  let blaaDiv = document.createElement('div');
  blaaDiv.className = 'spiller-sektion farve-blaa';
  blaaDiv.id = 'blaa-sektion';
  blaaDiv.innerHTML = '<div class="spillertitel">� Blå Ryttere</div>';

  // Create rider components for each color
  for (let key in ryttereData) {
    let rytter = ryttereData[key];

    // Assign correct cards based on rider type
    if (rytter.type === 'sprinter') {
      rytter.bunke = [...sprinterKort];
    } else {
      rytter.bunke = [...allaroundKort];
    }

    // Reset rider state
    rytter.træthed = [];
    rytter.brugtekort = [];
    rytter.fravalgtkort = [];
    rytter.dragnekort = [];

    let div = document.createElement('div');
    div.className = 'rytter';
    div.id = key;

    // Different colors for each rider type
    let borderColor = rytter.type === 'sprinter' ? '#ff6b35' : '#28a745';
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

    // Add rider to correct color section
    if (key.includes('roed')) {
      roedDiv.appendChild(div);
    } else if (key.includes('sort')) {
      sortDiv.appendChild(div);
    } else if (key.includes('groen')) {
      groenDiv.appendChild(div);
    } else if (key.includes('blaa')) {
      blaaDiv.appendChild(div);
    }
  }

  container.appendChild(roedDiv);
  container.appendChild(sortDiv);
  container.appendChild(groenDiv);
  container.appendChild(blaaDiv);

  opdaterAktivSpiller();
  opdaterUI();
}

function nytSpil() {
  // Reset all riders
  for (let key in ryttereData) {
    let rytter = ryttereData[key];

    // Assign correct cards based on rider type
    if (rytter.type === 'sprinter') {
      rytter.bunke = [...sprinterKort];
    } else {
      rytter.bunke = [...allaroundKort];
    }

    rytter.træthed = [];
    rytter.brugtekort = [];
    rytter.fravalgtkort = [];
    rytter.dragnekort = [];
    rytter.position = 0;
    document.getElementById(`${key}-kort`).innerHTML = '';
  }

  aktivSpiller = null;
  blandAlle();

  visNotifikation('Nyt spil startet! Røde ryttere begynder.', 'success');

  // Reset game state
  spilletilstand.fase = 'vælg_kort';
  spilletilstand.valgtekort = {};
  spilletilstand.aktivSpiller = 'roed';
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
  if (spilletilstand.fase !== 'vælg_kort') {
    visNotifikation('Venter på at alle spillere har valgt kort!', 'warning');
    return;
  }

  if (!rytter.includes(spilletilstand.aktivSpiller)) {
    let farveNavne = {
      roed: '🔴 Røde',
      sort: '⚫ Sorte',
      groen: '🟢 Grønne',
      blaa: '🔵 Blå',
    };
    visNotifikation(
      `Det er ${farveNavne[spilletilstand.aktivSpiller]} rytteres tur!`,
      'warning'
    );
    return;
  }

  if (spilletilstand.valgtekort[rytter]) {
    visNotifikation('Du har allerede valgt kort for denne rytter!', 'warning');
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
        'info'
      );
    }

    // If still not enough cards, shuffle fatigue cards back
    if (r.bunke.length < 4 && r.træthed.length > 0) {
      r.bunke = r.bunke.concat(r.træthed);
      r.træthed = [];
      r.bunke.sort(() => Math.random() - 0.5);
      visNotifikation(
        `${r.navn}: Træthedskort også blandet tilbage i bunken!`,
        'info'
      );
    }
  }

  if (r.bunke.length < 4) {
    visNotifikation(`${r.navn} har ikke nok kort til at trække 4!`, 'warning');
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
        .join('')}
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
  document.getElementById(`${rytter}-kort`).innerHTML = '';
  document.getElementById(`${rytter}-valgt`).innerHTML =
    '✓ Kort valgt hemmeligt';
  document.getElementById(`${rytter}-træk-btn`).disabled = true;

  aktivSpiller = null;

  // Check if color has selected for both riders
  let farveNavn = rytter.split('_')[0]; // Extract color from rider key
  let sprinter = farveNavn + '_sprinter';
  let allaround = farveNavn + '_allaround';

  if (
    spilletilstand.valgtekort[sprinter] &&
    spilletilstand.valgtekort[allaround]
  ) {
    // Color is done, switch to next color or finish
    if (skiftTilNæsteSpiller()) {
      // All have selected, show cards
      setTimeout(() => {
        spilletilstand.fase = 'vis_resultater';
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

  visNotifikation(`${r.navn} får et træthedskort (værdi 2)`, 'warning');
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
  spilletilstand.aktivSpiller = spilletilstand.spillerRækkefolge[næsteIndex];

  opdaterAktivSpiller();

  if (spilletilstand.aktivSpiller === 'roed') {
    visNotifikation('Alle farver har valgt kort! Kort afsløres nu.', 'success');
    return true; // All have selected
  } else {
    let farveNavne = {
      roed: '🔴 Røde',
      sort: '⚫ Sorte',
      groen: '🟢 Grønne',
      blaa: '🔵 Blå',
    };
    visNotifikation(
      `${farveNavne[spilletilstand.aktivSpiller]} rytteres tur!`,
      'info'
    );
    return false;
  }
}

function tjekOmAlleHarValgt() {
  let antalValgte = Object.keys(spilletilstand.valgtekort).length;
  let antalRyttere = Object.keys(ryttereData).length;

  if (antalValgte === antalRyttere) {
    spilletilstand.fase = 'vis_resultater';
    visAlleKort();
  }

  opdaterRundeStatus();
}

function nytRunde() {
  // Reset to new round
  spilletilstand.fase = 'vælg_kort';
  spilletilstand.valgtekort = {};
  spilletilstand.aktivSpiller = 'roed';

  // Hide result container and show main content
  document.getElementById('resultat-container').classList.remove('vis');
  document.getElementById('main-content').classList.remove('hidden');
  document.querySelector('.menu-knap').style.display = 'block';

  // Reset UI
  for (let key in ryttereData) {
    document.getElementById(`${key}-valgt`).innerHTML = '';
    document.getElementById(`${key}-kort`).innerHTML = '';
    document.getElementById(`${key}-træk-btn`).disabled = false;
  }

  opdaterAktivSpiller();
  opdaterRundeStatus();
  opdaterUI();

  visNotifikation('Ny runde startet! Røde ryttere begynder.', 'info');
}

/* ========================================
   RESULTS DISPLAY
   ======================================== */

function visAlleKort() {
  let resultater = [];
  let resultatGrid = document.getElementById('resultat-grid');
  resultatGrid.innerHTML = '';

  for (let rytter in spilletilstand.valgtekort) {
    let valg = spilletilstand.valgtekort[rytter];
    let r = ryttereData[rytter];

    // Move selected card to used cards
    r.brugtekort.push(valg.kort);
    r.position += valg.kort;

    resultater.push(`${r.navn}: ${valg.kort}`);

    // Create result card for display
    let resultatKort = document.createElement('div');
    resultatKort.className = 'resultat-kort';
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
    document.getElementById(`${rytter}-valgt`).innerHTML =
      `Spillede kort: ${valg.kort}`;
  }

  // Show result container with animation
  document.getElementById('resultat-container').classList.add('vis');
  document.getElementById('main-content').classList.add('hidden');
  document.querySelector('.menu-knap').style.display = 'none';

  // Show both players
  opdaterAktivSpiller();

  visNotifikation(
    'Alle kort afsløret! Tilføj træthedskort hvis nødvendigt.',
    'success'
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

  visNotifikation(`${r.navn} får et træthedskort (værdi 2)`, 'warning');

  // Update display in result screen
  let resultatKort = event.target.closest('.resultat-kort');
  let positionDiv = resultatKort.querySelector('.resultat-position');
  let nuværendeText = positionDiv.innerHTML;
  if (!nuværendeText.includes('Træthedskort:')) {
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

function visNotifikation(besked, type = 'info') {
  let notification = document.getElementById('notification');
  notification.textContent = besked;
  notification.className = `notification ${type}`;
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function opdaterAktivSpiller() {
  // Hide all color sections first
  const farver = ['roed', 'sort', 'groen', 'blaa'];
  farver.forEach((farve) => {
    let sektion = document.getElementById(`${farve}-sektion`);
    if (sektion) {
      sektion.classList.remove('aktiv', 'vis-alle');
    }
  });

  // Show only the active color section
  if (spilletilstand.fase === 'vælg_kort') {
    let aktivSektion = document.getElementById(
      `${spilletilstand.aktivSpiller}-sektion`
    );
    if (aktivSektion) {
      aktivSektion.classList.add('aktiv');
    }
  } else {
    // Show all color sections when cards are revealed
    farver.forEach((farve) => {
      let sektion = document.getElementById(`${farve}-sektion`);
      if (sektion) {
        sektion.classList.add('vis-alle');
      }
    });
  }

  // Disable buttons for inactive colors
  for (let key in ryttereData) {
    let erAktivFarve = key.includes(spilletilstand.aktivSpiller);
    let trakBtn = document.getElementById(`${key}-træk-btn`);
    if (trakBtn) {
      trakBtn.disabled =
        !erAktivFarve ||
        spilletilstand.valgtekort[key] ||
        spilletilstand.fase !== 'vælg_kort';
    }
  }
}

function opdaterRundeStatus() {
  let status = document.getElementById('rundestatus');

  if (spilletilstand.fase === 'vælg_kort') {
    let farveNavne = {
      roed: '🔴 Røde',
      sort: '⚫ Sorte',
      groen: '🟢 Grønne',
      blaa: '🔵 Blå',
    };
    let aktivFarveNavn = farveNavne[spilletilstand.aktivSpiller];
    status.innerHTML = `${aktivFarveNavn} rytteres tur - Vælg kort for begge ryttere`;

    let farveColors = {
      roed: '#dc3545',
      sort: '#343a40',
      groen: '#28a745',
      blaa: '#007bff',
    };
    status.style.color = farveColors[spilletilstand.aktivSpiller];
  } else {
    status.innerHTML = "Alle kort afsløret! Klik 'Ny runde' for næste runde";
    status.style.color = '#28a745';
  }

  opdaterKnappeVisning();
}

function opdaterUI() {
  for (let key in ryttereData) {
    let r = ryttereData[key];
    let info = `Position: ${r.position}\nKort i bunke: ${r.bunke.length}\nTræthedskort: ${r.træthed.length}\nBrugte kort: ${r.brugtekort.length}\nFravalgte kort: ${r.fravalgtkort.length}`;
    if (r.brugtekort.length > 0) {
      info += `\nSidste brugte kort: ${r.brugtekort[r.brugtekort.length - 1]}`;
    }
    document.getElementById(`${key}-info`).innerText = info;
  }
}

function opdaterKnappeVisning() {
  let spillKnapper = document.getElementById('spil-knapper');
  let menuKnap = document.querySelector('.menu-knap');

  // Hide buttons when players select cards, show only in result phase
  if (spilletilstand.fase === 'vælg_kort') {
    spillKnapper.classList.add('skjult');
    menuKnap.style.display = 'block';
  } else {
    spillKnapper.classList.remove('skjult');
    menuKnap.style.display = 'none'; // Hide menu when results are shown
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
  document.getElementById('menu-overlay').classList.add('vis');
}

function skjulMenu() {
  document.getElementById('menu-overlay').classList.remove('vis');
}

/* ========================================
   GAME INITIALIZATION & PWA
   ======================================== */

// Initialize the game
document.addEventListener('DOMContentLoaded', function () {
  // Start new game
  opretRyttere();
  blandAlle();
  opdaterRundeStatus();
  visNotifikation('Velkommen til Flamme Rouge! Røde ryttere begynder.', 'info');

  // PWA Service Worker registration
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(
      function (registration) {
        console.log(
          'ServiceWorker registreret med success: ',
          registration.scope
        );
      },
      function (err) {
        console.log('ServiceWorker registrering fejlede: ', err);
      }
    );
  }
});
