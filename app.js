// app.js - Window Tint Estimate Calculator (row-level price per sq ft)

document.addEventListener("DOMContentLoaded", () => {
  const windowsTbody = document.getElementById("windowsTbody");
  const addWindowBtn = document.getElementById("addWindowBtn");

  const jobNameInput = document.getElementById("jobName");
  const defaultPricePerSqFtInput = document.getElementById("defaultPricePerSqFt");
  const taxRateInput = document.getElementById("taxRate");

  const summaryJobName = document.getElementById("summaryJobName");
  const summaryPricePerSqFt = document.getElementById("summaryPricePerSqFt");

  const totalWindowsEl = document.getElementById("totalWindows");
  const totalSqFtEl = document.getElementById("totalSqFt");
  const subtotalEl = document.getElementById("subtotal");
  const taxAmountEl = document.getElementById("taxAmount");
  const grandTotalEl = document.getElementById("grandTotal");

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

  function recalcAll() {
    const taxRate = parseNumber(taxRateInput.value);

    let totalWindows = 0;
    let totalSqFt = 0;
    let subtotal = 0;

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

      const qtyInput = qtyTd.querySelector("input");
      const widthInput = widthTd.querySelector("input");
      const heightInput = heightTd.querySelector("input");
      const priceInput = priceTd.querySelector("input");

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
  }

  function initDefaults() {
    // Starter rows
    createWindowRow({ label: "Front windows", qty: 4 });
    createWindowRow({ label: "Living room", qty: 2 });
    createWindowRow({ label: "Rear sliders", qty: 1 });

    // Hook listeners
    [jobNameInput, defaultPricePerSqFtInput, taxRateInput].forEach((input) => {
      input.addEventListener("input", recalcAll);
    });

    addWindowBtn.addEventListener("click", () => {
      createWindowRow();
      recalcAll();
    });

    // Initial calc
    recalcAll();
  }

  initDefaults();
});
