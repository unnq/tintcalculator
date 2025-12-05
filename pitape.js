// pitape.js – Pi tape roll length + inventory demo

// XPEL PRIME style roll catalog (simplified)
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

// ---- math helpers -------------------------------------------------

function milToInches(mil) {
  return mil / 1000;
}

// Given diameters in inches + thickness in mil,
// return remaining length in feet.
function calcRollLengthFeet(outerDiameterIn, coreDiameterIn, thicknessMil) {
  if (!outerDiameterIn || !coreDiameterIn || !thicknessMil) return 0;
  if (outerDiameterIn <= coreDiameterIn) return 0;

  const t = milToInches(thicknessMil); // inches
  const Do = outerDiameterIn;
  const Dc = coreDiameterIn;

  // L (inches) = π (Do^2 - Dc^2) / (4 t)
  const L_inches = Math.PI * (Do * Do - Dc * Dc) / (4 * t);
  const L_feet = L_inches / 12;
  return L_feet;
}

// ---- inventory storage (localStorage demo) ------------------------

const STORAGE_KEY = "piTapeInventory";

let inventory = [];
let lastCalcRoll = null;

function loadInventory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    inventory = raw ? JSON.parse(raw) : [];
  } catch (err) {
    inventory = [];
  }
}

function saveInventory() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
}

// ---- UI wiring ----------------------------------------------------

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

function renderInventory() {
  const tbody = document.getElementById("inventoryBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!inventory.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.textContent = "No rolls saved yet. Calculate a roll, add a label, and save it.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  inventory.forEach((roll) => {
    const tr = document.createElement("tr");

    const cells = [
      roll.label || "—",
      roll.filmName,
      `${roll.lengthFeet.toFixed(1)} ft`,
      `${roll.squareFeet.toFixed(0)} sq ft`,
      `${roll.percentOfRoll.toFixed(0)}%`,
      new Date(roll.updatedAt).toLocaleString(),
    ];

    cells.forEach((text) => {
      const td = document.createElement("td");
      td.textContent = text;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function initPiForm() {
  const form = document.getElementById("piForm");
  const resultEl = document.getElementById("piResult");
  const saveBtn = document.getElementById("saveRollBtn");

  if (!form || !resultEl || !saveBtn) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const filmId = document.getElementById("piFilm").value;
    const film = PI_FILMS.find((f) => f.id === filmId);
    if (!film) {
      resultEl.textContent = "Select a film.";
      return;
    }

    const outerDiameter = parseFloat(
      document.getElementById("piOuterDiameter").value
    );
    const coreDiameter = parseFloat(
      document.getElementById("piCoreDiameter").value
    );
    const originalLength = parseFloat(
      document.getElementById("piOriginalLength").value
    );
    const widthIn = parseFloat(
      document.getElementById("piWidth").value
    );

    if (!outerDiameter || !coreDiameter || !originalLength) {
      resultEl.textContent = "Enter outer diameter, core diameter, and original length.";
      saveBtn.disabled = true;
      lastCalcRoll = null;
      return;
    }

    const lengthFeet = calcRollLengthFeet(
      outerDiameter,
      coreDiameter,
      film.thicknessMil
    );

    const widthFeet = widthIn ? widthIn / 12 : 40 / 12;
    const squareFeet = lengthFeet * widthFeet;
    const percentOfRoll = (lengthFeet / originalLength) * 100;

    lastCalcRoll = {
      filmId: film.id,
      filmName: film.name,
      outerDiameter,
      coreDiameter,
      originalLength,
      lengthFeet,
      squareFeet,
      percentOfRoll,
    };

    resultEl.innerHTML = `
      <p><strong>Film:</strong> ${film.name} (${film.thicknessMil} mil)</p>
      <p><strong>Approx length:</strong> ${lengthFeet.toFixed(1)} ft remaining</p>
      <p><strong>Approx area:</strong> ${squareFeet.toFixed(0)} sq ft</p>
      <p><strong>Remaining:</strong> ${percentOfRoll.toFixed(0)}% of a ${originalLength} ft roll</p>
    `;

    saveBtn.disabled = false;
  });

  saveBtn.addEventListener("click", () => {
    if (!lastCalcRoll) return;

    const labelInput = document.getElementById("piRollLabel");
    const label = labelInput.value.trim();

    const rollToSave = {
      ...lastCalcRoll,
      label,
      updatedAt: new Date().toISOString(),
    };

    inventory.push(rollToSave);
    saveInventory();
    renderInventory();

    saveBtn.disabled = true;
  });
}

function initClearButton() {
  const clearBtn = document.getElementById("clearInventoryBtn");
  if (!clearBtn) return;

  clearBtn.addEventListener("click", () => {
    if (!inventory.length) return;
    if (!confirm("Clear all demo inventory from this browser?")) return;

    inventory = [];
    saveInventory();
    renderInventory();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadInventory();
  renderFilmOptions();
  initPiForm();
  initClearButton();
  renderInventory();
});
