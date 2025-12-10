// pitape.js – Pi tape roll inventory (square-foot based) with live preview + modal

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

// ---- Defaults / thresholds -----------------------------------------------

const DEFAULT_ROLL_LENGTH_FT = 100; // typical full roll length
const DEFAULT_WIDTH_IN = 40;        // 40" film width
const DEFAULT_WIDTH_FEET = DEFAULT_WIDTH_IN / 12;
const DEFAULT_ROLL_SQFT = DEFAULT_ROLL_LENGTH_FT * DEFAULT_WIDTH_FEET;

// per-film minimum sq ft threshold (override a few, else 120)
const MIN_SQFT_BY_FILM = {
  xr_plus_5: 180,
  xr_plus_20: 150,
  cs_black_35: 160,
};

// FULL seed inventory for all films (in “roll equivalents”)
const SEED_INVENTORY = {
  // XR PLUS
  xr_plus_5:   { rolls: 2.3, updatedDaysAgo: 3,  rep: "Alex R." },
  xr_plus_15:  { rolls: 1.1, updatedDaysAgo: 12, rep: "Morgan T." },
  xr_plus_20:  { rolls: 0.8, updatedDaysAgo: 18, rep: "Morgan T." },
  xr_plus_30:  { rolls: 1.9, updatedDaysAgo: 7,  rep: "Jamie L." },
  xr_plus_35:  { rolls: 0.5, updatedDaysAgo: 30, rep: "Sam K." },
  xr_plus_45:  { rolls: 1.4, updatedDaysAgo: 15, rep: "Alex R." },
  xr_plus_55:  { rolls: 0.2, updatedDaysAgo: 40, rep: "Sam K." },
  xr_plus_70:  { rolls: 1.7, updatedDaysAgo: 2,  rep: "Jamie L." },

  // XR BLACK
  xr_black_5:  { rolls: 2.0, updatedDaysAgo: 10, rep: "Luis H." },
  xr_black_15: { rolls: 0.6, updatedDaysAgo: 25, rep: "Sam K." },
  xr_black_20: { rolls: 1.8, updatedDaysAgo: 6,  rep: "Morgan T." },
  xr_black_30: { rolls: 0.3, updatedDaysAgo: 27, rep: "Alex R." },
  xr_black_35: { rolls: 1.2, updatedDaysAgo: 13, rep: "Jamie L." },
  xr_black_45: { rolls: 1.9, updatedDaysAgo: 3,  rep: "Luis H." },
  xr_black_55: { rolls: 0.4, updatedDaysAgo: 22, rep: "Sam K." },
  xr_black_70: { rolls: 1.0, updatedDaysAgo: 19, rep: "Morgan T." },

  // XR BLUE
  xr_blue_70:  { rolls: 0.9, updatedDaysAgo: 9,  rep: "Jamie L." },
  xr_blue_80:  { rolls: 1.3, updatedDaysAgo: 4,  rep: "Luis H." },

  // HP BLACK
  hp_black_5:  { rolls: 0.7, updatedDaysAgo: 14, rep: "Alex R." },
  hp_black_15: { rolls: 0.3, updatedDaysAgo: 30, rep: "Sam K." },
  hp_black_20: { rolls: 1.5, updatedDaysAgo: 11, rep: "Morgan T." },
  hp_black_35: { rolls: 2.2, updatedDaysAgo: 1,  rep: "Jamie L." },
  hp_black_50: { rolls: 0.6, updatedDaysAgo: 20, rep: "Alex R." },

  // CS BLACK
  cs_black_5:  { rolls: 1.1, updatedDaysAgo: 16, rep: "Luis H." },
  cs_black_15: { rolls: 0.4, updatedDaysAgo: 35, rep: "Sam K." },
  cs_black_20: { rolls: 0.9, updatedDaysAgo: 8,  rep: "Morgan T." },
  cs_black_30: { rolls: 1.3, updatedDaysAgo: 5,  rep: "Jamie L." },
  cs_black_35: { rolls: 1.6, updatedDaysAgo: 5,  rep: "Jamie L." },
  cs_black_43: { rolls: 0.2, updatedDaysAgo: 42, rep: "Sam K." },
  cs_black_50: { rolls: 0.5, updatedDaysAgo: 11, rep: "Morgan T." },
  cs_black_55: { rolls: 1.0, updatedDaysAgo: 18, rep: "Alex R." },
  cs_black_70: { rolls: 0.7, updatedDaysAgo: 9,  rep: "Luis H." },
  cs_black_88: { rolls: 1.9, updatedDaysAgo: 3,  rep: "Jamie L." },
};

// ---- math helpers ---------------------------------------------------------

function milToInches(mil) {
  return mil / 1000;
}

// Pi tape calibration:
// Core 3.22", full roll 3.93" → 100 ft of film
// Solving the annulus formula gives an effective wound thickness ~3.32 mil.
const CALIBRATED_THICKNESS_MIL = 3.32;

// Given diameters in inches, return remaining *linear* length in feet,
// using calibrated thickness so that 3.93" over 3.22" core ≈ 100 ft.
function calcRollLengthFeet(outerDiameterIn, coreDiameterIn) {
  if (!outerDiameterIn || !coreDiameterIn) return 0;
  if (outerDiameterIn <= coreDiameterIn) return 0;

  const t = milToInches(CALIBRATED_THICKNESS_MIL); // inches
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
    : DEFAULT_ROLL_LENGTH_FT;

  const widthFeet = widthIn && widthIn > 0 ? widthIn / 12 : DEFAULT_WIDTH_FEET;

  // linear length via pi tape (calibrated thickness)
  let partialFeet = 0;
  if (outerDiameter && coreDiameter && outerDiameter > coreDiameter) {
    partialFeet = calcRollLengthFeet(
      outerDiameter,
      coreDiameter
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

const STORAGE_KEY = "piTapeInventoryByFilm_sqft_v2"; // v2 so seeding works clean on new key
const REP_KEY = "piTapeRepName";

let inventoryByFilm = {};
// shape: { [filmId]: { filmId, squareFeet, lengthFeet, rollLengthFt, rollSqFt, lastUpdatedAt, lastUpdatedBy } }

function seedInventoryFromRolls() {
  const now = new Date();
  const seeded = {};

  Object.entries(SEED_INVENTORY).forEach(([filmId, seed]) => {
    const rolls = seed.rolls ?? 0;
    const rollSqFt = DEFAULT_ROLL_SQFT;
    const squareFeet = rolls * rollSqFt;
    const lengthFeet = rolls * DEFAULT_ROLL_LENGTH_FT;

    const daysAgo = seed.updatedDaysAgo ?? 7;
    const lastUpdatedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

    seeded[filmId] = {
      filmId,
      squareFeet,
      lengthFeet,
      rollLengthFt: DEFAULT_ROLL_LENGTH_FT,
      rollSqFt,
      lastUpdatedAt,
      lastUpdatedBy: seed.rep || "",
    };
  });

  return seeded;
}

function loadInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      inventoryByFilm = JSON.parse(raw);
    } else {
      inventoryByFilm = seedInventoryFromRolls();
      saveInventory();
    }
  } catch (err) {
    inventoryByFilm = seedInventoryFromRolls();
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
      rollLengthFt: rollLengthFallback || DEFAULT_ROLL_LENGTH_FT,
      rollSqFt: rollSqFtFallback || (rollLengthFallback || DEFAULT_ROLL_LENGTH_FT) * DEFAULT_WIDTH_FEET,
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

  const now = new Date();
  const TWO_WEEKS_MS = 14 * 24 * 60 * 60 * 1000;

  PI_FILMS.forEach((film) => {
    const rec = getRecordForFilm(film.id, DEFAULT_ROLL_LENGTH_FT, DEFAULT_ROLL_SQFT);

    const tr = document.createElement("tr");
    tr.dataset.filmId = film.id;

    if (!rec.squareFeet) {
      tr.style.opacity = "0.6";
    }

    const rollSqFt = rec.rollSqFt || (rec.rollLengthFt || DEFAULT_ROLL_LENGTH_FT) * DEFAULT_WIDTH_FEET;
    const fullRollEquiv = rollSqFt > 0 ? rec.squareFeet / rollSqFt : 0;

    const minSqFt = MIN_SQFT_BY_FILM[film.id] ?? 120;

    // Name
    const nameTd = document.createElement("td");
    nameTd.textContent = film.name;
    tr.appendChild(nameTd);

    // Sq ft (with low-inventory highlight)
    const sqFtTd = document.createElement("td");
    sqFtTd.textContent = `${rec.squareFeet.toFixed(1)} sq ft`;
    sqFtTd.style.textAlign = "right";
    sqFtTd.style.fontVariantNumeric = "tabular-nums";
    if (rec.squareFeet < minSqFt) {
      sqFtTd.classList.add("cell-low-inventory");
    }
    tr.appendChild(sqFtTd);

    // Length ft
    const lengthTd = document.createElement("td");
    lengthTd.textContent = `${rec.lengthFeet.toFixed(1)} ft`;
    lengthTd.style.textAlign = "right";
    lengthTd.style.fontVariantNumeric = "tabular-nums";
    tr.appendChild(lengthTd);

    // Rolls
    const rollsTd = document.createElement("td");
    rollsTd.textContent = `${fullRollEquiv.toFixed(2)} rolls`;
    rollsTd.style.textAlign = "right";
    rollsTd.style.fontVariantNumeric = "tabular-nums";
    tr.appendChild(rollsTd);

    // Last updated
    const dateTd = document.createElement("td");
    dateTd.textContent = formatDateTime(rec.lastUpdatedAt);

    if (rec.lastUpdatedAt) {
      const d = new Date(rec.lastUpdatedAt);
      if (!Number.isNaN(d.getTime())) {
        const ageMs = now - d;
        if (ageMs > TWO_WEEKS_MS) {
          dateTd.classList.add("cell-stale-date");
        }
      }
    }

    tr.appendChild(dateTd);

    // Rep
    const byTd = document.createElement("td");
    byTd.textContent = rec.lastUpdatedBy || "—";
    tr.appendChild(byTd);

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

  const payload = computeUpdatePayload(f
