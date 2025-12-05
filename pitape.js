// pitape.js – Pi tape roll length + aggregated inventory by film

// XPEL PRIME style catalog used for Pi-tape inventory.
// (You can expand this list as needed; order here = order in inventory table.)
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
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function renderInventory() {
  const tbody = document.getElementById("inventoryBody");
  if (!tbody) return;

  tbody.innerHTML = "";

  // Build rows from PI_FILMS order, but only show films with >0 length.
  const rows = PI_FILMS.map((film) => {
    const inv = inventoryByFilm[film.id];
    return inv && inv.lengthFeet > 0
      ? { film, inv }
      : null;
  }).filter(Boolean);

  if (!rows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "No inventory yet. Use the form to add rolls.";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  rows.forEach(({ film, inv }) => {
    const tr = document.createElement("tr");

    const rollLengthFt = inv.rollLengthFt || 100;
    const fullRollEquiv = rollLengthFt > 0 ? inv.lengthFeet / rollLengthFt : 0;

    const cells = [
      film.name,
      `${inv.lengthFeet.toFixed(1)} ft`,
      `${fullRollEquiv.toFixed(2)} rolls`,
      formatDateTime(inv.lastUpdatedAt),
      inv.lastUpdatedBy || "—",
    ];

    cells.forEach((text, idx) => {
      const td = document.createElement("td");
      td.textContent = text;
      if (idx === 1 || idx === 2) {
        td.style.textAlign = "right";
        td.style.fontVariantNumeric = "tabular-nums";
      }
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function initPiForm() {
  const form = document.getElementById("piForm");
  const resultEl = document.getElementById("piResult");
  const repInput = document.getElementById("piRep");

  if (!form || !resultEl) return;

  // Load stored rep name if present
  const storedRep = localStorage.getItem(REP_KEY) || "";
  if (repInput) {
    repInput.value = storedRep;
    repInput.addEventListener("input", () => {
      localStorage.setItem(REP_KEY, repInput.value.trim());
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const filmId = document.getElementById("piFilm").value;
    const film = PI_FILMS.find((f) => f.id === filmId);
    if (!film) {
      resultEl.textContent = "Select a film.";
      return;
    }

    const action = document.getElementById("piAction").value || "add";
    const repName = repInput ? repInput.value.trim() : "";

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

    // Calculate partial via pi tape (if provided)
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
    const changeFeet = action === "remove" ? -changeFeetRaw : changeFeetRaw;

    // Update inventory record for this film
    let rec = inventoryByFilm[film.id];
    if (!rec) {
      rec = {
        filmId: film.id,
        lengthFeet: 0,
        rollLengthFt: safeRollLength,
        lastUpdatedAt: null,
        lastUpdatedBy: "",
      };
    }

    rec.lengthFeet = Math.max(0, rec.lengthFeet + changeFeet);
    rec.rollLengthFt = safeRollLength;
    rec.lastUpdatedAt = new Date().toISOString();
    rec.lastUpdatedBy = repName;

    inventoryByFilm[film.id] = rec;
    saveInventory();
    renderInventory();

    const newFullRollEquiv = rec.rollLengthFt > 0
      ? rec.lengthFeet / rec.rollLengthFt
      : 0;

    // Build human-readable summary of this update
    const directionLabel = action === "remove" ? "removed from" : "added to";
    const parts = [];
    if (safeFullRolls > 0) {
      parts.push(`${safeFullRolls} full roll(s) = ${fullRollFeet.toFixed(1)} ft`);
    }
    if (partialFeet > 0) {
      parts.push(
        `pi-taped roll ≈ ${partialFeet.toFixed(1)} ft (${partialPercentOfRoll.toFixed(
          0
        )}% of a ${safeRollLength} ft roll)`
      );
    }
    if (!parts.length) {
      parts.push("0 ft (no full rolls or pi-tape entered)");
    }

    resultEl.innerHTML = `
      <p><strong>${film.name}</strong></p>
      <p><strong>This update:</strong> ${parts.join(" + ")}</p>
      <p><strong>Change:</strong> ${action === "remove" ? "-" : "+"}${changeFeetRaw.toFixed(
        1
      )} ft ${directionLabel} inventory.</p>
      <hr />
      <p><strong>New total for ${film.name}:</strong> ${rec.lengthFeet.toFixed(
        1
      )} ft (${newFullRollEquiv.toFixed(2)} rolls)</p>
      <p><strong>Last updated by:</strong> ${
        rec.lastUpdatedBy || "—"
      } on ${formatDateTime(rec.lastUpdatedAt)}</p>
      ${
        partialFeet > 0
          ? `<p class="helper-text">Approx area for this pi-taped roll: ${partialSqFt.toFixed(
              0
            )} sq ft (width ${widthFeet.toFixed(2)} ft).</p>`
          : ""
      }
    `;
  });
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
