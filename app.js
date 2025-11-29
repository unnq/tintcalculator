// app.js - Window Tint Estimate + Quote

// ---- Film-to-glass data ------------------------------------

const GLASS_TYPES = [
  {
    id: "single_pane_clear",
    label: "Single pane (1–60 sq ft) – Clear"
  },
  {
    id: "single_pane_tinted",
    label: "Single pane (1–60 sq ft) – Tinted"
  },
  {
    id: "single_dual_pane_laminated",
    label: "Single & dual pane (1–40 sq ft) – Laminated"
  },
  {
    id: "dual_pane_clear",
    label: "Dual pane (1–40 sq ft) – Clear"
  },
  {
    id: "dual_pane_tinted",
    label: "Dual pane (1–40 sq ft) – Tinted"
  },
  {
    id: "dual_pane_low_e_surface_2",
    label: "Dual pane Low E (1–40 sq ft) – Surface 2"
  },
  {
    id: "dual_pane_low_e_surface_3",
    label: "Dual pane Low E (1–40 sq ft) – Surface 3"
  },
  {
    id: "triple_pane_clear",
    label: "Triple pane (1–40 sq ft) – Clear"
  },
  {
    id: "tempered_heat_strengthened",
    label: "All panes tempered or heat strengthened – glass breakage safe"
  }
];

// NOTE: For now compatibility objects are mostly empty. You’ll fill these from
// the XPEL chart: use "safe", "conditional", or "not_warranted" per glass type.
const FILMS = [
  // SPECIALTY SERIES
  {
    id: "all_season_intell_65_ps",
    name: "All Season Intell 65 PS",
    category: "Specialty Series",
    defaultPricePerSqFt: 14,
    compatibility: {
      // Example of how to encode (replace with your real chart values):
      // single_pane_clear: "safe",
      // dual_pane_low_e_surface_3: "conditional",
    }
  },
  {
    id: "all_season_45_ps",
    name: "All Season 45 PS",
    category: "Specialty Series",
    defaultPricePerSqFt: 13,
    compatibility: {}
  },

  // CLEAR VIEW
  { id: "clear_view_plus_70_ps", name: "Clear View Plus 70% PS", category: "Clear View", defaultPricePerSqFt: 13, compatibility: {} },
  { id: "clear_view_plus_55_ps", name: "Clear View Plus 55% PS", category: "Clear View", defaultPricePerSqFt: 13, compatibility: {} },
  { id: "clear_view_plus_40_ps", name: "Clear View Plus 40% PS", category: "Clear View", defaultPricePerSqFt: 13, compatibility: {} },
  { id: "clear_view_plus_20_ps", name: "Clear View Plus 20% PS", category: "Clear View", defaultPricePerSqFt: 13, compatibility: {} },
  { id: "clear_view_alloy_65_ps", name: "Clear View Alloy 65 PS", category: "Clear View", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "clear_view_alloy_50_ps", name: "Clear View Alloy 50 PS", category: "Clear View", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "clear_view_alloy_40_ps", name: "Clear View Alloy 40 PS", category: "Clear View", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "clear_view_alloy_25_ps", name: "Clear View Alloy 25 PS", category: "Clear View", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "clear_view_ceramic_60_ps", name: "Clear View Ceramic 60 PS", category: "Clear View", defaultPricePerSqFt: 15, compatibility: {} },
  { id: "clear_view_ceramic_50_ps", name: "Clear View Ceramic 50 PS", category: "Clear View", defaultPricePerSqFt: 15, compatibility: {} },
  { id: "clear_view_ceramic_35_ps", name: "Clear View Ceramic 35 PS", category: "Clear View", defaultPricePerSqFt: 15, compatibility: {} },

  // NEUTRAL
  { id: "daylight_50_ps", name: "Daylight 50 PS", category: "Neutral", defaultPricePerSqFt: 11, compatibility: {} },
  { id: "daylight_28_ps", name: "Daylight 28 PS", category: "Neutral", defaultPricePerSqFt: 11, compatibility: {} },
  { id: "dark_neutral_25_da", name: "Dark Neutral 25 DA", category: "Neutral", defaultPricePerSqFt: 11, compatibility: {} },
  { id: "dark_neutral_15_da", name: "Dark Neutral 15 DA", category: "Neutral", defaultPricePerSqFt: 11, compatibility: {} },

  // METALLIC
  { id: "evening_view_45_da", name: "Evening View 45 DA", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "evening_view_35_da", name: "Evening View 35 DA", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "evening_view_25_da", name: "Evening View 25 DA", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "evening_view_15_da", name: "Evening View 15 DA", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "evening_view_5_da", name: "Evening View 5 DA", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "blend_dr_37_ps", name: "Blend DR 37 PS", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "blend_dr_27_ps", name: "Blend DR 27 PS", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "blend_dr_17_ps", name: "Blend DR 17 PS", category: "Metallic", defaultPricePerSqFt: 10, compatibility: {} },
  { id: "silver_50_ps", name: "Silver 50 PS", category: "Metallic", defaultPricePerSqFt: 9, compatibility: {} },
  { id: "silver_15_ps", name: "Silver 15 PS", category: "Metallic", defaultPricePerSqFt: 9, compatibility: {} },

  // METALLIC (Cont.)
  { id: "bronze_40_ps", name: "Bronze 40 PS", category: "Metallic (Cont.)", defaultPricePerSqFt: 9, compatibility: {} },
  { id: "bronze_25_ps", name: "Bronze 25 PS", category: "Metallic (Cont.)", defaultPricePerSqFt: 9, compatibility: {} },

  // EXTERIOR
  { id: "exterior_clear_perf_75_ps", name: "Exterior Clear Perf 75 PS", category: "Exterior", defaultPricePerSqFt: 16, compatibility: {} },
  { id: "exterior_neutral_40_ps", name: "Exterior Neutral 40 PS", category: "Exterior", defaultPricePerSqFt: 16, compatibility: {} },
  { id: "exterior_neutral_20_ps", name: "Exterior Neutral 20 PS", category: "Exterior", defaultPricePerSqFt: 16, compatibility: {} },
  { id: "exterior_silver_15_ps", name: "Exterior Silver 15 PS", category: "Exterior", defaultPricePerSqFt: 16, compatibility: {} },
  { id: "exterior_blend_dr_7_ps", name: "Exterior Blend DR 7 PS", category: "Exterior", defaultPricePerSqFt: 16, compatibility: {} },

  // SECURITY CLEAR
  { id: "security_clear_4mil_ps", name: "Security Clear 4mil PS", category: "Security Clear", defaultPricePerSqFt: 18, compatibility: {} },
  { id: "security_clear_8mil_ps", name: "Security Clear 8mil PS", category: "Security Clear", defaultPricePerSqFt: 18, compatibility: {} },
  { id: "security_clear_14mil_ps", name: "Security Clear 14mil PS", category: "Security Clear", defaultPricePerSqFt: 18, compatibility: {} },
  { id: "exterior_security_clear_7mil", name: "Exterior Security Clear 7mil", category: "Security Clear", defaultPricePerSqFt: 18, compatibility: {} },
  { id: "security_8mil_clear_view_plus_70", name: "Security 8mil Clear View Plus 70", category: "Security Clear", defaultPricePerSqFt: 19, compatibility: {} },
  { id: "security_8mil_neutral_50_ps", name: "Security 8mil Neutral 50 PS", category: "Security Clear", defaultPricePerSqFt: 19, compatibility: {} },
  { id: "security_8mil_neutral_35_ps", name: "Security 8mil Neutral 35 PS", category: "Security Clear", defaultPricePerSqFt: 19, compatibility: {} },
  { id: "security_8mil_silver_15_ps", name: "Security 8mil Silver 15 PS", category: "Security Clear", defaultPricePerSqFt: 19, compatibility: {} },

  // ANTI-GRAFFITI
  { id: "anti_graffiti_4mil_ps", name: "Anti-Graffiti 4mil PS", category: "Anti-Graffiti", defaultPricePerSqFt: 20, compatibility: {} },
  { id: "anti_graffiti_6mil_ps", name: "Anti-Graffiti 6mil PS", category: "Anti-Graffiti", defaultPricePerSqFt: 20, compatibility: {} },

  // DECORATIVE
  { id: "white_frost", name: "White Frost", category: "Decorative", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "black_out", name: "Black Out", category: "Decorative", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "white_out", name: "White Out", category: "Decorative", defaultPricePerSqFt: 14, compatibility: {} },
  { id: "bird_safe_dotted", name: "Bird Safe Dotted", category: "Decorative", defaultPricePerSqFt: 15, compatibility: {} },
  { id: "blister_prevention", name: "Blister Prevention", category: "Decorative", defaultPricePerSqFt: 15, compatibility: {} },
  { id: "dusted_crystal", name: "Dusted Crystal", category: "Decorative", defaultPricePerSqFt: 15, compatibility: {} }
];




document.addEventListener("DOMContentLoaded", () => {
  const windowsTbody = document.getElementById("windowsTbody");
  const addWindowBtn = document.getElementById("addWindowBtn");

  const filmSelect = document.getElementById("filmSelect");
  const glassTypeSelect = document.getElementById("glassTypeSelect");
  const filmGlassStatus = document.getElementById("filmGlassStatus");
  const filmGlassStatusText = document.getElementById("filmGlassStatusText");


  const jobNameInput = document.getElementById("jobName");
  const customerEmailInput = document.getElementById("customerEmail");
  const customerPhoneInput = document.getElementById("customerPhone");
  const customerAddressInput = document.getElementById("customerAddress");
  const defaultPricePerSqFtInput = document.getElementById("defaultPricePerSqFt");
  const taxRateInput = document.getElementById("taxRate");

  const summaryJobName = document.getElementById("summaryJobName");
  const summaryPricePerSqFt = document.getElementById("summaryPricePerSqFt");

  const totalWindowsEl = document.getElementById("totalWindows");
  const totalSqFtEl = document.getElementById("totalSqFt");
  const subtotalEl = document.getElementById("subtotal");
  const taxAmountEl = document.getElementById("taxAmount");
  const grandTotalEl = document.getElementById("grandTotal");

  // Quote DOM refs
  const quoteJobName = document.getElementById("quoteJobName");
  const quoteCustomerEmail = document.getElementById("quoteCustomerEmail");
  const quoteCustomerPhone = document.getElementById("quoteCustomerPhone");
  const quoteCustomerAddress = document.getElementById("quoteCustomerAddress");
  const quoteIdEl = document.getElementById("quoteId");
  const quoteDateEl = document.getElementById("quoteDate");
  const quoteTotalSqFtEl = document.getElementById("quoteTotalSqFt");
  const quoteTotalWindowsEl = document.getElementById("quoteTotalWindows");
  const quoteSubtotalEl = document.getElementById("quoteSubtotal");
  const quoteTaxEl = document.getElementById("quoteTax");
  const quoteGrandTotalEl = document.getElementById("quoteGrandTotal");
  const quoteAvgPriceEl = document.getElementById("quoteAvgPrice");
  const quoteTbody = document.getElementById("quoteTbody");
  const quoteFilmEl = document.getElementById("quoteFilm");
  const quoteGlassTypeEl = document.getElementById("quoteGlassType");
  const quoteCompatEl = document.getElementById("quoteCompat");


  const printQuoteBtn = document.getElementById("printQuoteBtn");

  // Tabs
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanels = document.querySelectorAll(".tab-panel");

  const currencyFmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });

  const numberFmt = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  let rowCounter = 0;

  function parseNumber(value) {
    if (value === null || value === undefined) return 0;
    const num = parseFloat(String(value).replace(/,/g, ""));
    return isNaN(num) ? 0 : num;
  }

  function createWindowRow(preset = {}) {
    rowCounter += 1;
    const tr = document.createElement("tr");
    tr.dataset.rowId = `row-${rowCounter}`;

    // Cells
    const labelTd = document.createElement("td");
    const qtyTd = document.createElement("td");
    const widthTd = document.createElement("td");
    const heightTd = document.createElement("td");
    const perSqFtTd = document.createElement("td");
    const rowSqFtTd = document.createElement("td");
    const priceTd = document.createElement("td");
    const rowCostTd = document.createElement("td");
    const actionsTd = document.createElement("td");

    // Inputs
    const labelInput = document.createElement("input");
    labelInput.type = "text";
    labelInput.placeholder = "e.g. Front window";
    labelInput.value = preset.label || "";

    const qtyInput = document.createElement("input");
    qtyInput.type = "number";
    qtyInput.min = "0";
    qtyInput.step = "1";
    qtyInput.value = preset.qty != null ? preset.qty : "1";

    const widthInput = document.createElement("input");
    widthInput.type = "number";
    widthInput.min = "0";
    widthInput.step = "0.01";
    widthInput.value = preset.widthIn != null ? preset.widthIn : "";

    const heightInput = document.createElement("input");
    heightInput.type = "number";
    heightInput.min = "0";
    heightInput.step = "0.01";
    heightInput.value = preset.heightIn != null ? preset.heightIn : "";

    const priceInput = document.createElement("input");
    priceInput.type = "number";
    priceInput.min = "0";
    priceInput.step = "0.25";
    priceInput.value =
      preset.pricePerSqFt != null
        ? preset.pricePerSqFt
        : defaultPricePerSqFtInput.value || "0";

    // Numeric display cells
    perSqFtTd.classList.add("numeric-cell");
    rowSqFtTd.classList.add("numeric-cell");
    rowCostTd.classList.add("numeric-cell");

    perSqFtTd.textContent = "0.00";
    rowSqFtTd.textContent = "0.00";
    rowCostTd.textContent = "$0.00";

    // Remove button
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn-icon danger";
    removeBtn.innerHTML = "×";
    actionsTd.appendChild(removeBtn);

    // Assemble
    labelTd.appendChild(labelInput);
    qtyTd.appendChild(qtyInput);
    widthTd.appendChild(widthInput);
    heightTd.appendChild(heightInput);
    priceTd.appendChild(priceInput);

    tr.appendChild(labelTd);
    tr.appendChild(qtyTd);
    tr.appendChild(widthTd);
    tr.appendChild(heightTd);
    tr.appendChild(perSqFtTd);
    tr.appendChild(rowSqFtTd);
    tr.appendChild(priceTd);
    tr.appendChild(rowCostTd);
    tr.appendChild(actionsTd);

    // Listeners
    [labelInput, qtyInput, widthInput, heightInput, priceInput].forEach((input) => {
      input.addEventListener("input", recalcAll);
    });

    removeBtn.addEventListener("click", () => {
      if (windowsTbody.children.length > 1) {
        tr.remove();
        recalcAll();
      }
    });

    windowsTbody.appendChild(tr);
  }

  function updateQuotePreview(rows, totals) {
    const {
      totalWindows,
      totalSqFt,
      subtotal,
      taxAmount,
      grandTotal,
      avgPricePerSqFt
    } = totals;

    // Customer details
    const jobNameVal = jobNameInput.value.trim();
    const emailVal = customerEmailInput.value.trim();
    const phoneVal = customerPhoneInput.value.trim();
    const addressVal = customerAddressInput.value.trim();

        // Film / glass / compat into quote box
    const filmId = filmSelect.value;
    const glassId = glassTypeSelect.value;
    const film = findFilmById(filmId);
    const glass = findGlassById(glassId);
    const status = getCompatibilityStatus(filmId, glassId);

    quoteFilmEl.textContent = film ? film.name : "–";
    quoteGlassTypeEl.textContent = glass ? glass.label : "–";
    quoteCompatEl.textContent = statusLabelFor(status);


    quoteJobName.textContent = jobNameVal || "Window tint installation";
    quoteCustomerEmail.textContent = emailVal || "–";
    quoteCustomerPhone.textContent = phoneVal || "–";
    quoteCustomerAddress.textContent = addressVal || "–";

    // High-level stats
    quoteTotalSqFtEl.textContent = `${numberFmt.format(totalSqFt)} sq ft`;
    quoteTotalWindowsEl.textContent = totalWindows;
    quoteSubtotalEl.textContent = currencyFmt.format(subtotal);
    quoteTaxEl.textContent = currencyFmt.format(taxAmount);
    quoteGrandTotalEl.textContent = currencyFmt.format(grandTotal);
    quoteAvgPriceEl.textContent = currencyFmt.format(avgPricePerSqFt || 0);

    // Line items table
    quoteTbody.innerHTML = "";

    rows.forEach((row) => {
      const tr = document.createElement("tr");

      const labelTd = document.createElement("td");
      labelTd.textContent = row.label || "Window";

      const qtyTd = document.createElement("td");
      qtyTd.textContent = row.qty.toString();

      const sizeTd = document.createElement("td");
      if (row.widthIn > 0 && row.heightIn > 0) {
        sizeTd.textContent =
          `${numberFmt.format(row.widthIn)}" × ${numberFmt.format(row.heightIn)}"`;
      } else {
        sizeTd.textContent = "–";
      }

      const rowSqFtTd = document.createElement("td");
      rowSqFtTd.textContent = numberFmt.format(row.rowSqFt);
      rowSqFtTd.classList.add("numeric-cell");

      const priceTd = document.createElement("td");
      priceTd.textContent = currencyFmt.format(row.pricePerSqFt || 0);
      priceTd.classList.add("numeric-cell");

      const rowCostTd = document.createElement("td");
      rowCostTd.textContent = currencyFmt.format(row.rowCost || 0);
      rowCostTd.classList.add("numeric-cell");

      tr.appendChild(labelTd);
      tr.appendChild(qtyTd);
      tr.appendChild(sizeTd);
      tr.appendChild(rowSqFtTd);
      tr.appendChild(priceTd);
      tr.appendChild(rowCostTd);

      quoteTbody.appendChild(tr);
    });
  }


    function findFilmById(id) {
    return FILMS.find((f) => f.id === id) || null;
  }

  function findGlassById(id) {
    return GLASS_TYPES.find((g) => g.id === id) || null;
  }

  function getCompatibilityStatus(filmId, glassId) {
    const film = findFilmById(filmId);
    if (!film || !glassId) return "unknown";
    if (!film.compatibility) return "unknown";
    return film.compatibility[glassId] || "unknown";
  }

  function statusLabelFor(status) {
    switch (status) {
      case "safe":
        return "SAFE – warranted by manufacturer";
      case "conditional":
        return "CONDITIONAL – preapproval / special conditions";
      case "not_warranted":
        return "NOT WARRANTED – do not install on this glass";
      default:
        return "Unknown – check film-to-glass chart";
    }
  }

  function updateFilmGlassStatus() {
    const filmId = filmSelect.value;
    const glassId = glassTypeSelect.value;
    const status = getCompatibilityStatus(filmId, glassId);

    filmGlassStatus.classList.remove(
      "status-safe",
      "status-conditional",
      "status-not",
      "status-unknown"
    );

    let className;
    switch (status) {
      case "safe":
        className = "status-safe";
        break;
      case "conditional":
        className = "status-conditional";
        break;
      case "not_warranted":
        className = "status-not";
        break;
      default:
        className = "status-unknown";
        break;
    }

    filmGlassStatus.classList.add(className);
    filmGlassStatusText.textContent = statusLabelFor(status);
  }

  function populateFilmAndGlassSelects() {
    // Film select with optgroups by category
    const byCategory = {};
    FILMS.forEach((film) => {
      if (!byCategory[film.category]) byCategory[film.category] = [];
      byCategory[film.category].push(film);
    });

    Object.entries(byCategory).forEach(([category, films]) => {
      const group = document.createElement("optgroup");
      group.label = category;
      films.forEach((film) => {
        const opt = document.createElement("option");
        opt.value = film.id;
        opt.textContent = film.name;
        group.appendChild(opt);
      });
      filmSelect.appendChild(group);
    });

    // Glass types
    GLASS_TYPES.forEach((glass) => {
      const opt = document.createElement("option");
      opt.value = glass.id;
      opt.textContent = glass.label;
      glassTypeSelect.appendChild(opt);
    });

    // Default selections
    if (filmSelect.options.length > 0) {
      filmSelect.selectedIndex = 0;
    }
    if (glassTypeSelect.options.length > 0) {
      glassTypeSelect.selectedIndex = 0;
    }
  }

  
  
  function recalcAll() {
    const taxRate = parseNumber(taxRateInput.value);

    let totalWindows = 0;
    let totalSqFt = 0;
    let subtotal = 0;

    const rowsForQuote = [];

    Array.from(windowsTbody.children).forEach((tr) => {
      const [
        labelTd,
        qtyTd,
        widthTd,
        heightTd,
        perSqFtTd,
        rowSqFtTd,
        priceTd,
        rowCostTd
      ] = tr.children;

      const labelInput = labelTd.querySelector("input");
      const qtyInput = qtyTd.querySelector("input");
      const widthInput = widthTd.querySelector("input");
      const heightInput = heightTd.querySelector("input");
      const priceInput = priceTd.querySelector("input");

      const label = (labelInput.value || "").trim() || "Window";

      const qty = Math.max(0, parseNumber(qtyInput.value));
      const widthIn = Math.max(0, parseNumber(widthInput.value));
      const heightIn = Math.max(0, parseNumber(heightInput.value));
      const rowPricePerSqFt = Math.max(0, parseNumber(priceInput.value));

      // Convert inches to feet
      const widthFt = widthIn / 12;
      const heightFt = heightIn / 12;

      const sqFtPerWindow = widthFt * heightFt;
      const rowSqFt = sqFtPerWindow * qty;
      const rowCost = rowSqFt * rowPricePerSqFt;

      if (qty > 0 && sqFtPerWindow > 0) {
        totalWindows += qty;
      }

      totalSqFt += rowSqFt;
      subtotal += rowCost;

      perSqFtTd.textContent = numberFmt.format(sqFtPerWindow || 0);
      rowSqFtTd.textContent = numberFmt.format(rowSqFt || 0);
      rowCostTd.textContent = currencyFmt.format(rowCost || 0);

      rowsForQuote.push({
        label,
        qty,
        widthIn,
        heightIn,
        sqFtPerWindow,
        rowSqFt,
        pricePerSqFt: rowPricePerSqFt,
        rowCost
      });
    });

    const taxAmount = subtotal * (taxRate / 100);
    const grandTotal = subtotal + taxAmount;

    // Summary UI
    totalWindowsEl.textContent = totalWindows;
    totalSqFtEl.textContent = `${numberFmt.format(totalSqFt)} sq ft`;
    subtotalEl.textContent = currencyFmt.format(subtotal);
    taxAmountEl.textContent = currencyFmt.format(taxAmount);
    grandTotalEl.textContent = currencyFmt.format(grandTotal);

    const avgPricePerSqFt =
      totalSqFt > 0 ? subtotal / totalSqFt : 0;
    summaryPricePerSqFt.textContent = currencyFmt.format(avgPricePerSqFt || 0);

    const jobNameVal = jobNameInput.value.trim();
    summaryJobName.textContent = jobNameVal || "–";
    summaryJobName.classList.toggle("summary-value-muted", !jobNameVal);

    // Update quote preview mirror
    updateQuotePreview(rowsForQuote, {
      totalWindows,
      totalSqFt,
      subtotal,
      taxAmount,
      grandTotal,
      avgPricePerSqFt
    });
  }

  function initTabs() {
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const tabName = btn.dataset.tab;

        tabButtons.forEach((b) => b.classList.remove("active"));
        tabPanels.forEach((panel) => panel.classList.remove("active"));

        btn.classList.add("active");
        const panel = document.getElementById(`tab-${tabName}`);
        if (panel) panel.classList.add("active");
      });
    });
  }

  function initQuoteMeta() {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US");
    const quoteId =
      "QT-" +
      now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      "-" +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0");

    quoteDateEl.textContent = dateStr;
    quoteIdEl.textContent = quoteId;
  }

    function initDefaults() {
    populateFilmAndGlassSelects();    // <-- NEW

    // Starter rows
    createWindowRow({ label: "Front windows", qty: 4 });
    createWindowRow({ label: "Living room", qty: 2 });
    createWindowRow({ label: "Rear sliders", qty: 1 });

    [
      jobNameInput,
      customerEmailInput,
      customerPhoneInput,
      customerAddressInput,
      defaultPricePerSqFtInput,
      taxRateInput
    ].forEach((input) => {
      input.addEventListener("input", recalcAll);
    });

    addWindowBtn.addEventListener("click", () => {
      createWindowRow();
      recalcAll();
    });

    // Film + glass change handlers
    filmSelect.addEventListener("change", () => {
      const film = findFilmById(filmSelect.value);
      if (film && typeof film.defaultPricePerSqFt === "number") {
        defaultPricePerSqFtInput.value = film.defaultPricePerSqFt;
      }
      updateFilmGlassStatus();
      recalcAll();
    });

    glassTypeSelect.addEventListener("change", () => {
      updateFilmGlassStatus();
      recalcAll();
    });

    // Print button
    if (printQuoteBtn) {
      printQuoteBtn.addEventListener("click", () => {
        window.print();
      });
    }

    initTabs();
    initQuoteMeta();

    updateFilmGlassStatus();
    recalcAll();
  });


    // Print button
    if (printQuoteBtn) {
      printQuoteBtn.addEventListener("click", () => {
        window.print();
      });
    }

    initTabs();
    initQuoteMeta();

    // Initial calc
    recalcAll();
  }

  initDefaults();
});
