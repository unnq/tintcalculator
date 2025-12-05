// pitape.js – Pi tape roll inventory (square-foot based) with live preview

// ---- Film catalog ---------------------------------------------------------
const PI_FILMS = [
  // XR PLUS
  { id: "xr_plus_5",  name: "XR PLUS 5",  thicknessMil: 1.5 },
  { id: "xr_plus_15", name: "XR PLUS 15", thicknessMil: 1.5 },
  { id: "xr_plus_20", name: "XR PLUS 20", thicknessMil: 1.5 },
  { id: "xr_plus_30", name: "XR PLUS 30", thicknessMil: 1.5 },
  { id: "xr_plus_35", name: "XR PLUS 35", thicknessMil: 1.5 },
  { id: "xr_plus_45", name: "XR PLUS 45", thicknessMil: 1.5 },
  { id: "xr_plus_55", name: "XR PLUS 55", thicknessMil: 1.5 },
  { id: "xr_plus_70", name: "XR PLUS 70", thicknessMil: 2.0 },

  // XR BLACK
  { id: "xr_black_5",  name: "XR Black 5",  thicknessMil: 1.5 },
  { id: "xr_black_15", name: "XR Black 15", thicknessMil: 1.5 },
  { id: "xr_black_20", name: "XR Black 20", thicknessMil: 1.5 },
  { id: "xr_black_30", name: "XR Black 30", thicknessMil: 1.5 },
  { id: "xr_black_35", name: "XR Black 35", thicknessMil: 1.5 },
  { id: "xr_black_45", name: "XR Black 45", thicknessMil: 1.5 },
  { id: "xr_black_55", name: "XR Black 55", thicknessMil: 1.5 },
  { id: "xr_black_70", name: "XR Black 70", thicknessMil: 1.5 },

  // XR BLUE
  { id: "xr_blue_70", name: "XR Blue 70", thicknessMil: 2.0 },
  { id: "xr_blue_80", name: "XR Blue 80", thicknessMil: 2.0 },

  // HP BLACK
  { id: "hp_black_5",  name: "HP Black 5",  thicknessMil: 1.5 },
  { id: "hp_black_15", name: "HP Black 15", thicknessMil: 1.5 },
  { id: "hp_black_20", name: "HP Black 20", thicknessMil: 1.5 },
  { id: "hp_black_35", name: "HP Black 35", thicknessMil: 1.5 },
  { id: "hp_black_50", name: "HP Black 50", thicknessMil: 1.5 },

  // CS BLACK
  { id: "cs_black_5",  name: "CS Black 5",  thicknessMil: 1.5 },
  { id: "cs_black_15", name: "CS Black 15", thicknessMil: 1.5 },
  { id: "cs_black_20", name: "CS Black 20", thicknessMil: 1.5 },
  { id: "cs_black_30", name: "CS Black 30", thicknessMil: 1.5 },
  { id: "cs_black_35", name: "CS Black 35", thicknessMil: 1.5 },
  { id: "cs_black_43", name: "CS Black 43", thicknessMil: 1.5 },
  { id: "cs_black_50", name: "CS Black 50", thicknessMil: 1.5 },
  { id: "cs_black_55", name: "CS Black 55", thicknessMil: 1.5 },
  { id: "cs_black_70", name: "CS Black 70", thicknessMil: 1.5 },
  { id: "cs_black_88", name: "CS Black 88", thicknessMil: 1.5 },
];

// ---- math helpers ---------------------------------------------------------

function milToInches(mil) {
  return mil / 1000;
}

// Given diameters in inches + thickness in mil, return remaining *linear* length in feet.
function calcRollLengthFeet(outerDiameterIn, coreDiameterIn, thicknessMil) {
  if (!outerDiameterIn || !coreDiameterIn || !thicknessMil) return 0;
  if (outerDiameterIn <= coreDiameterIn) return 0;

  const t = milToInches(thicknessMil); // inches
  const Do = outerDiameterIn;
  const Dc = coreDiameterIn;

  // L (inches) = π (Do^2 - Dc^2) / (4 t)
  const L_inches = Math.PI * (Do * Do - Dc * Dc) / (4 * t);
  return L_inches / 12; // feet
}

// Compute new-change payload (no side effects yet)
function computeUpdatePayload(film) {
  const action = document.getElementById("piAction").value || "add";

  const fullRolls = parseFloat(
    document.getElementById("piFullRolls").value
  );
  const outerDiameter = parseFloat(
    document.getElementById("piOuterDiameter").value
  );
  const coreDiameter = parseFloat(
    document.getElementById("piCoreDiameter").value
  );
  const rollLengthFt = parseFloat(
    document.getElementById("piOriginalLength").value
  );
  const widthIn = parseFloat(
    document.getElementById("piWidth").value
  );

  const safeFullRolls = Number.isFinite(fullRolls) ? Math.max(0, fullRolls) : 0;
  const safeRollLength = Number.isFinite(rollLengthFt) && rollLengthFt > 0
    ? rollLengthFt
    : 100;

  const widthFeet = widthIn && widthIn > 0 ? widthIn / 12 : 40 / 12;

  // linear length via pi tape
  let partialFeet = 0;
  if (outerDiameter && coreDiameter && outerDiameter > coreDiameter) {
    partialFeet = calcRollLengthFeet(
      outerDiameter,
      coreDiameter,
      film.thicknessMil
    );
  }

  const partialSqFt = partialFeet * widthFeet;
  const partialPercentOfRoll = safeRollLength > 0
    ? (partialFeet / safeRollLength) * 100
    : 0;

  const fullRollFeet = safeFullRolls * safeRollLength;
  const fullRollSqFt = fullRollFeet * widthFeet;

  const changeFeetRaw = fullRollFeet + partialFeet;
  const changeSqFtRaw = fullRollSqFt + partialSqFt;

  const signedChangeFeet = action === "remove" ? -changeFeetRaw : changeFeetRaw;
  const signedChangeSqFt = action === "remove" ? -changeSqFtRaw : changeSqFtRaw;

  return {
    action,
    safeFullRolls,
    safeRollLength,
    widthFeet,
    fullRollFeet,
    fullRollSqFt,
    partialFeet,
    partialSqFt,
    partialPercentOfRoll,
    changeFeetRaw,
    changeSqFtRaw,
    signedChangeFeet,
    signedChangeSqFt,
  };
}

// ---- inventory storage (localStorage demo) ------------------------

const STORAGE_KEY = "piTapeInventoryByFilm_sqft";
const REP_KEY = "piTapeRepName";

let inventoryByFilm = {};
// shape: { [filmId]: { filmId, squareFeet, lengthFeet, rollLengthFt, rollSqFt, lastUpdatedAt, lastUpdatedBy } }

function loadInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    inventoryByFilm = raw ? JSON.parse(raw) : {};
  } catch (err) {
    inventoryByFilm = {};
  }
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventoryByFilm));
}

// ---- UI helpers ---------------------------------------------------

function renderFilmOptions() {
  const select = document.getElementById("piFilm");
  if (!select) return;

  PI_FILMS.forEach((film) => {
    const opt = document.createElement("option");
    opt.value = film.id;
    opt.textContent = `${film.name} (${film.thicknessMil} mil)`;
    select.appendChild(opt);
  });

  if (select.options.length > 0) {
    select.selectedIndex = 0;
  }
}

function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function getRecordForFilm(filmId, rollLengthFallback, rollSqFtFallback) {
  let rec = inventoryByFilm[filmId];
  if (!rec) {
    rec = {
      filmId,
      squareFeet: 0,
      lengthFeet: 0,
      rollLengthFt: rollLengthFallback || 100,
      rollSqFt: rollSqFtFallback || (rollLengthFallback || 100) * (40 / 12),
      lastUpdatedAt: null,
      lastUpdatedBy: "",
    };
  }
  return rec;
}

// Render ALL films in fixed order, even if 0 sq ft.
function renderInventory() {
  const tbody = document.getElementById("inventoryBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  PI_FILMS.forEach((film) => {
    const rec = getRecordForFilm(film.id, 100, 100 * (40 / 12));

    const tr = document.createElement("tr");
    if (!rec.squareFeet) {
      tr.style.opacity = "0.6";
    }

    const rollSqFt = rec.rollSqFt || (rec.rollLengthFt || 100) * (40 / 12);
    const fullRollEquiv = rollSqFt > 0 ? rec.squareFeet / rollSqFt : 0;

    const cells = [
      film.name,
      `${rec.squareFeet.toFixed(1)} sq ft`,
      `${rec.lengthFeet.toFixed(1)} ft`,
      `${fullRollEquiv.toFixed(2)} rolls`,
      formatDateTime(rec.lastUpdatedAt),
      rec.lastUpdatedBy || "—",
    ];

    cells.forEach((text, idx) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (idx === 1 || idx === 2 || idx === 3) {
        td.style.textAlign = "right";
        td.style.fontVariantNumeric = "tabular-nums";
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

// Live preview of this change, in sq ft
function updatePreview() {
  const resultEl = document.getElementById("piResult");
  if (!resultEl) return;

  const filmId = document.getElementById("piFilm").value;
  const film = PI_FILMS.find((f) => f.id === filmId);
  if (!film) {
    resultEl.textContent = "Select a film.";
    return;
  }

  const payload = computeUpdatePayload(film);
  const {
    action,
    safeFullRolls,
    safeRollLength,
    widthFeet,
    fullRollFeet,
    fullRollSqFt,
    partialFeet,
    partialSqFt,
    partialPercentOfRoll,
    changeFeetRaw,
    changeSqFtRaw,
  } = payload;

  const rollSqFtFallback = safeRollLength * widthFeet;
  const rec = getRecordForFilm(film.id, safeRollLength, rollSqFtFallback);

  const previewNewSqFt = Math.max(0, rec.squareFeet + payload.signedChangeSqFt);
  const previewNewFeet = Math.max(0, rec.lengthFeet + payload.signedChangeFeet);
  const rollSqFt = rec.rollSqFt || rollSqFtFallback || (safeRollLength * widthFeet);
  const currentFullRollEquiv = rollSqFt > 0 ? rec.squareFeet / rollSqFt : 0;
  const previewFullRollEquiv = rollSqFt > 0 ? previewNewSqFt / rollSqFt : 0;

  const parts = [];
  if (safeFullRolls > 0) {
    parts.push(
      `${safeFullRolls} full roll(s) ≈ ${fullRollSqFt.toFixed(1)} sq ft (${fullRollFeet.toFixed(
        1
      )} ft)`
    );
  }
  if (partialFeet > 0) {
    parts.push(
      `pi-taped roll ≈ ${partialSqFt.toFixed(1)} sq ft (${partialFeet.toFixed(
        1
      )} ft ≈ ${partialPercentOfRoll.toFixed(0)}% of a ${safeRollLength} ft roll)`
    );
  }

  if (!parts.length) {
    resultEl.innerHTML = `
      <p><strong>${film.name}</strong></p>
      <p>No full rolls or pi-tape values entered yet.</p>
      <p><strong>Current total:</strong> ${rec.squareFeet.toFixed(
        1
      )} sq ft (${rec.lengthFeet.toFixed(1)} ft, ${currentFullRollEquiv.toFixed(
        2
      )} rolls)</p>
    `;
    return;
  }

  const directionLabel = action === "remove" ? "removed from" : "added to";
  const sign = action === "remove" ? "-" : "+";

  resultEl.innerHTML = `
    <p><strong>${film.name}</strong></p>
    <p><strong>This update (preview):</strong> ${parts.join(" + ")}</p>
    <p><strong>Change:</strong> ${sign}${changeSqFtRaw.toFixed(
      1
    )} sq ft (${sign}${changeFeetRaw.toFixed(1)} ft) ${directionLabel} inventory.</p>
    <hr />
    <p><strong>Current total:</strong> ${rec.squareFeet.toFixed(
      1
    )} sq ft (${rec.lengthFeet.toFixed(1)} ft, ${currentFullRollEquiv.toFixed(
      2
    )} rolls)</p>
    <p><strong>After update:</strong> ${previewNewSqFt.toFixed(
      1
    )} sq ft (${previewNewFeet.toFixed(1)} ft, ${previewFullRollEquiv.toFixed(
      2
    )} rolls)</p>
    ${
      partialFeet > 0
        ? `<p class="helper-text">Pi-taped roll area uses width ${widthFeet.toFixed(
            2
          )} ft (${(widthFeet * 12).toFixed(0)}").</p>`
        : ""
    }
  `;
}

// ---- form + buttons ------------------------------------------------

function initPiForm() {
  const form = document.getElementById("piForm");
  const repInput = document.getElementById("piRep");

  if (!form) return;

  // load stored rep
  const storedRep = localStorage.getItem(REP_KEY) || "";
  if (repInput) {
    repInput.value = storedRep;
    repInput.addEventListener("input", () => {
      localStorage.setItem(REP_KEY, repInput.value.trim());
    });
  }

  // Live preview on any change
  const liveInputs = [
    "piFilm",
    "piAction",
    "piFullRolls",
    "piOuterDiameter",
    "piCoreDiameter",
    "piOriginalLength",
    "piWidth",
  ];
  liveInputs.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, updatePreview);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const filmId = document.getElementById("piFilm").value;
    const film = PI_FILMS.find((f) => f.id === filmId);
    if (!film) return;

    const repName = repInput ? repInput.value.trim() : "";

    const payload = computeUpdatePayload(film);
    const {
      safeRollLength,
      widthFeet,
      signedChangeFeet,
      signedChangeSqFt,
    } = payload;

    const rollSqFtFallback = safeRollLength * widthFeet;
    const rec = getRecordForFilm(film.id, safeRollLength, rollSqFtFallback);

    rec.squareFeet = Math.max(0, rec.squareFeet + signedChangeSqFt);
    rec.lengthFeet = Math.max(0, rec.lengthFeet + signedChangeFeet);
    rec.rollLengthFt = safeRollLength;
    rec.rollSqFt = rollSqFtFallback;
    rec.lastUpdatedAt = new Date().toISOString();
    rec.lastUpdatedBy = repName;

    inventoryByFilm[film.id] = rec;
    saveInventory();
    renderInventory();
    updatePreview(); // refresh with new "current total"
  });

  updatePreview(); // initial
}

function initClearButton() {
  const clearBtn = document.getElementById("clearInventoryBtn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", () => {
    if (!Object.keys(inventoryByFilm).length) return;
    if (!confirm("Clear all demo inventory data from this browser?")) return;

    inventoryByFilm = {};
    saveInventory();
    renderInventory();
    updatePreview();
  });
}

// ---- init ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  loadInventory();
  renderFilmOptions();
  initPiForm();
  initClearButton();
  renderInventory();
});
