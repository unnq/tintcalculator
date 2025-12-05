// portal.js – handles login, sidebar toggle, panel switching, and section collapse

document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const portalView = document.getElementById("portalView");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const portalUserName = document.getElementById("portalUserName");

  const sidebar = document.getElementById("portalSidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");

  // Only links that actually map to a panel
  const panelLinks = document.querySelectorAll(".sidebar-link[data-panel]");
  const panels = document.querySelectorAll(".portal-panel");

  const sectionToggles = document.querySelectorAll(".sidebar-section-toggle");

  // ---- Demo login ----
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailVal = (loginEmail.value || "").trim();
      const displayName = emailVal || "Demo Rep";

      loginView.classList.add("hidden");
      portalView.classList.remove("hidden");

      if (portalUserName) {
        portalUserName.textContent = displayName;
      }
    });
  }

  // ---- Sidebar collapse toggle ----
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // ---- Section expand / collapse ----
  sectionToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sectionName = btn.getAttribute("data-section-toggle");
      if (!sectionName) return;

      const sectionEl = document.querySelector(
        `.sidebar-section[data-section="${sectionName}"]`
      );
      if (!sectionEl) return;

      sectionEl.classList.toggle("collapsed");
    });
  });

  // ---- Panel switching (Tools section items) ----
  function showPanel(name) {
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.id === `panel-${name}`);
    });

    panelLinks.forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-panel") === name
      );
    });
  }

  panelLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelName = btn.getAttribute("data-panel");
      if (!panelName) return;
      showPanel(panelName);
    });
  });

  // Default: show overview, expand Tools; Projects/Leads start expanded too
  showPanel("overview");
});
