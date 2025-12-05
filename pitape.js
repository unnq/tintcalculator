// pitape.js – Pi tape roll length + aggregated inventory by film with LIVE preview

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

// Given diameters in inches + thickness in mil, return remaining length in feet.
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

// Compute everything from current form values for a given film (no side effects)
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

  let partialFeet = 0;
  if (outerDiameter && coreDiameter && outerDiameter > coreDiameter) {
    partialFeet = calcRollLengthFeet(
      outerDiameter,
      coreDiameter,
      film.thicknessMil
    );
  }

  const widthFeet = widthIn && widthIn > 0 ? widthIn / 12 : 40 / 12;
  const partialSqFt = partialFeet * widthFeet;
  const partialPercentOfRoll = safeRollLength > 0
    ? (partialFeet / safeRollLength) * 100
    : 0;

  const fullRollFeet = safeFullRolls * safeRollLength;
  const changeFeetRaw = fullRollFeet + partialFeet;
  const signedChangeFeet = action === "remove" ? -changeFeetRaw : changeFeetRaw;

  return {
    action,
    safeFullRolls,
    safeRollLength,
    fullRollFeet,
    partialFeet,
    partialSqFt,
    partialPercentOfRoll,
    changeFeetRaw,
    signedChangeFeet,
    widthFeet,
  };
}

// ---- inventory storage (localStorage demo) ------------------------

const STORAGE_KEY = "piTapeInventoryByFilm";
const REP_KEY = "piTapeRepName";

let inventoryByFilm = {}; // { [filmId]: { filmId, lengthFeet, rollLengthFt, lastUpdatedAt, lastUpdatedBy } }

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
