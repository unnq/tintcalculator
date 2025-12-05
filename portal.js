// portal.js – handles login, sidebar toggle, and switching between dashboard panels

document.addEventListener("DOMContentLoaded", () => {
  const loginView = document.getElementById("loginView");
  const portalView = document.getElementById("portalView");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const portalUserName = document.getElementById("portalUserName");

  const sidebar = document.getElementById("portalSidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const panels = document.querySelectorAll(".portal-panel");

  // ---- Demo login ----
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailVal = (loginEmail.value || "").trim();
      const displayName = emailVal || "Demo Rep";

      // simple demo: no auth, just show dashboard
      loginView.classList.add("hidden");
      portalView.classList.remove("hidden");

      if (portalUserName) {
        portalUserName.textContent = displayName;
      }
    });
  }

  // ---- Sidebar toggle ----
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  // ---- Panel switching ----
  function showPanel(name) {
    panels.forEach((panel) => {
      panel.classList.toggle(
        "active",
        panel.id === `panel-${name}`
      );
    });

    sidebarLinks.forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.dataset.panel === name
      );
    });
  }

  sidebarLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const panelName = btn.dataset.panel;
      if (!panelName) return;
      showPanel(panelName);
    });
  });

  // default: overview is active
  showPanel("overview");
});

