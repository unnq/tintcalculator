// portal.js – login, sidebar toggles, panel switching, sections, user menu + logout

document.addEventListener("DOMContentLoaded", () => {
  // Views
  const loginView = document.getElementById("loginView");
  const portalView = document.getElementById("portalView");

  // Login
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const portalUserName = document.getElementById("portalUserName");
  const userMenuHeaderName = document.getElementById("userMenuHeaderName");

  // Sidebar & toggles
  const sidebar = document.getElementById("portalSidebar");
  const sidebarToggle = document.getElementById("sidebarToggle");      // in sidebar header
  const sidebarToggleTop = document.getElementById("sidebarToggleTop"); // in topbar (mobile)
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");

  // Panel links (only tools)
  const panelLinks = document.querySelectorAll(".sidebar-link[data-panel]");
  const panels = document.querySelectorAll(".portal-panel");

  // Section toggles
  const sectionToggles = document.querySelectorAll(".sidebar-section-toggle");

  // User menu
  const userMenuToggle = document.getElementById("userMenuToggle");
  const userMenu = document.getElementById("userMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  // ---- LOGIN (demo) ----
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emailVal = (loginEmail.value || "").trim();
      const displayName = emailVal || "Demo Rep";

      loginView.classList.add("hidden");
      portalView.classList.remove("hidden");

      if (portalUserName) portalUserName.textContent = displayName;
      if (userMenuHeaderName) userMenuHeaderName.textContent = displayName;
    });
  }

  // ---- SIDEBAR TOGGLE (desktop rail + mobile drawer) ----
  function toggleSidebar() {
    if (!sidebar) return;
    const nowCollapsed = sidebar.classList.toggle("collapsed");

    // For mobile, this controls the backdrop; harmless on desktop
    if (nowCollapsed) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }
  }

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", toggleSidebar);
  }
  if (sidebarToggleTop) {
    sidebarToggleTop.addEventListener("click", toggleSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", () => {
      if (!sidebar) return;
      sidebar.classList.remove("collapsed");
      document.body.classList.remove("sidebar-open");
    });
  }

  // ---- SECTION EXPAND / COLLAPSE ----
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

  // ---- PANEL SWITCHING (TOOLS) ----
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

      // On mobile, hide drawer after navigation
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove("collapsed");
        document.body.classList.remove("sidebar-open");
      }
    });
  });

  // ---- USER MENU + LOGOUT ----
  if (userMenuToggle && userMenu) {
    userMenuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = userMenu.classList.toggle("open");
      userMenu.classList.toggle("hidden", !isOpen);
    });

    // Click outside closes menu
    document.addEventListener("click", (e) => {
      if (!userMenu.classList.contains("open")) return;
      const withinTrigger = userMenuToggle.contains(e.target);
      const withinMenu = userMenu.contains(e.target);
      if (!withinTrigger && !withinMenu) {
        userMenu.classList.remove("open");
        userMenu.classList.add("hidden");
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Close menu
      if (userMenu) {
        userMenu.classList.remove("open");
        userMenu.classList.add("hidden");
      }

      // Reset to login view
      portalView.classList.add("hidden");
      loginView.classList.remove("hidden");

      // Clear sidebar overlay if mobile
      document.body.classList.remove("sidebar-open");
      if (sidebar) sidebar.classList.remove("collapsed");
    });
  }

  // ---- INITIAL STATE ----
  showPanel("overview");
});
