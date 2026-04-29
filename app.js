(function () {
  "use strict";

  var MARKETING_SECTIONS = ["home", "customers", "platform", "request-demo"];

  var CAT_LABEL = {
    company: "Company Documents",
    performance: "Performance Management",
    payroll: "Payroll & Compensation",
    legal: "Legal & Policy Documents",
    hiring: "Hiring Documents",
    employment: "Changes in Employment",
  };

  var DEFAULT_METHOD_FILE = {
    company: "Standard_Full_Time_Offer_Letter_US.pdf",
    performance: "Annual_Performance_Review_Manager_Worksheet.pdf",
    payroll: "Salary_Bands_by_Level_2026.pdf",
    legal: "Employee_Handbook_Master_2026.pdf",
    hiring: "Job_Posting_Customer_Success_Manager.pdf",
    employment: "Internal_Promotion_Notification_Letter.pdf",
  };

  var FILE_PAGE_COUNT = {
    "Standard_Full_Time_Offer_Letter_US.pdf": 4,
    "Executive_Compensation_Offer_Summary.pdf": 6,
    "Mutual_Nondisclosure_Agreement_2026.pdf": 8,
  };

  var DOC_TITLES = {
    "/about": "About — Workbench HR",
    "/contact": "Contact — Workbench HR",
    "/privacy": "Privacy Policy — Workbench HR",
    "/terms": "Terms of Service — Workbench HR",
    "/login": "Sign in — Workbench HR",
    "/signup": "Sign up — Workbench HR",
    "/forgot-password": "Forgot password — Workbench HR",
    "/onboarding/goal": "Get started — Workbench HR",
    "/onboarding/privacy": "Data & Privacy — Workbench HR",
    "/onboarding/learning": "Sync company DNA — Workbench HR",
    "/onboarding/opt-out-confirm": "Opt out — Workbench HR",
    "/onboarding/training": "Training — Workbench HR",
    "/onboarding/notifications": "Notifications — Workbench HR",
    "/design-reference": "Design reference — Workbench HR",
    "/dashboard": "Dashboard — Workbench HR",
    "/assistant": "AI Assistant — Workbench HR",
    "/dashboard/sign-documents": "Sign documents — Workbench HR",
    "/hiring": "Hiring — Workbench HR",
    "/documents": "Documents — Workbench HR",
    "/employees": "Employee Portal — Workbench HR",
    "/create-document/template": "Select category — Workbench HR",
    "/create-document/method": "Creation method — Workbench HR",
    "/settings/profile": "Profile — Settings",
    "/settings/company": "Company — Settings",
    "/settings/roles": "Roles — Settings",
    "/settings/billing": "Billing — Settings",
    "/settings/data": "Data — Settings",
    "/settings/trigger-notifications": "Triggers — Settings",
    "/settings/employees": "Employees — Settings",
    "/settings/security": "Security — Settings",
    "/settings/help": "Help — Settings",
  };

  function isDashboardHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)dashboard\.html$/i.test(path);
  }

  function isDashboardHubPath(pathname) {
    return (
      pathname === "/dashboard" ||
      pathname === "/assistant" ||
      pathname === "/dashboard/sign-documents"
    );
  }

  function isDocumentsHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)documents\.html$/i.test(path);
  }

  function isDocumentsPath(pathname) {
    return pathname === "/documents";
  }

  function isSettingsHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)settings\.html$/i.test(path);
  }

  function isSettingsHubPath(pathname) {
    return pathname === "/settings" || pathname === "/settings/" || pathname.indexOf("/settings/") === 0;
  }

  function isHiringHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)hiring\.html$/i.test(path);
  }

  function isHiringPath(pathname) {
    return pathname === "/hiring";
  }

  function isCreateDocumentHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)create-document\.html$/i.test(path);
  }

  function isCreateDocumentTemplateHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)create-document-template\.html$/i.test(path);
  }

  function isCreateDocumentShellDoc() {
    return isCreateDocumentHtmlDoc() || isCreateDocumentTemplateHtmlDoc();
  }

  function createDocumentShellFileForPath(pathname) {
    return pathname === "/create-document/template"
      ? "create-document-template.html"
      : "create-document.html";
  }

  function createDocumentPathHref(pathname, fallbackHash) {
    var file = createDocumentShellFileForPath(pathname);
    var h = window.location.hash;
    if (!h || h === "#" || h === "#/") {
      return file + (fallbackHash || "#/create-document/template");
    }
    return file + h;
  }

  function isCreateDocumentPath(pathname) {
    return pathname.indexOf("/create-document/") === 0;
  }

  function isEmployeesHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)employees\.html$/i.test(path);
  }

  function isEmployeesPath(pathname) {
    return pathname === "/employees";
  }

  function parseHash() {
    var raw = window.location.hash.replace(/^#/, "");
    if (raw.charAt(0) === "!") raw = raw.slice(1);
    if (!raw || raw === "/") return { kind: "marketing", section: "home" };
    if (raw.charAt(0) !== "/" && MARKETING_SECTIONS.indexOf(raw) !== -1) {
      return { kind: "marketing", section: raw };
    }
    if (raw.charAt(0) !== "/") return { kind: "marketing", section: "home" };
    var u = new URL(raw, "http://static.local");
    var pathname = u.pathname || "/";
    var search = u.search || "";
    return { kind: "path", pathname: pathname, search: search };
  }

  function hideAllRoots() {
    document.querySelectorAll("[data-static-view]").forEach(function (el) {
      el.hidden = true;
    });
  }

  function showRoot(view) {
    hideAllRoots();
    var el = document.querySelector('[data-static-view="' + view + '"]');
    if (el) el.hidden = false;
  }

  function normalizeSection(section) {
    if (section === "customers") return "home";
    return section || "home";
  }

  function getScrollSpySection() {
    var headerEl = document.querySelector(".wb-mkt-header");
    var headerH = headerEl ? headerEl.getBoundingClientRect().height : 68;
    var activationY = headerH + 20;
    var order = ["home", "platform", "request-demo"];
    var current = "home";
    for (var i = 0; i < order.length; i++) {
      var el = document.getElementById(order[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= activationY) current = order[i];
    }
    return current;
  }

  function setMarketingTabs(activeSection) {
    var sec = normalizeSection(activeSection);
    document.querySelectorAll("[data-mkt-tab]").forEach(function (tab) {
      var id = tab.getAttribute("data-mkt-tab");
      var isActive = id === sec;
      tab.classList.toggle("wb-mkt-tab--active", isActive);
      if (isActive) tab.setAttribute("aria-current", "location");
      else tab.removeAttribute("aria-current");
    });
  }

  function scrollPlatformCentered() {
    var el = document.getElementById("platform");
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    var base = window.location.pathname + window.location.search;
    window.history.replaceState(null, "", base + "#platform");
  }

  function scrollToId(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function setTitleForPath(pathname) {
    if (DOC_TITLES[pathname]) {
      document.title = DOC_TITLES[pathname];
      return;
    }
    var m = pathname.match(/^\/create-document\/templates\/([^/]+)$/);
    if (m) {
      document.title = (CAT_LABEL[m[1]] || "Templates") + " — Workbench HR";
      return;
    }
    if (pathname.indexOf("/create-document/") === 0) {
      document.title = "Create document — Workbench HR";
      return;
    }
    document.title = "Workbench HR";
  }

  function showOnboardingPage(path) {
    showRoot("onboarding");
    document.querySelectorAll("[data-ob-path]").forEach(function (el) {
      el.hidden = el.getAttribute("data-ob-path") !== path;
    });
    setTitleForPath(path);
  }

  function showSettingsPage(path) {
    showRoot("settings");
    document.querySelectorAll("[data-st-page]").forEach(function (el) {
      el.hidden = el.getAttribute("data-st-page") !== path;
    });
    document.querySelectorAll("[data-st-nav]").forEach(function (a) {
      var p = a.getAttribute("data-st-nav");
      a.classList.toggle("wb-settings-link--active", p === path);
    });
    setTitleForPath(path);
  }

  function workspaceMainKey(pathname, search) {
    if (isDashboardHtmlDoc()) {
      if (pathname === "/assistant") return "/assistant";
      if (pathname === "/dashboard/sign-documents") return "/dashboard/sign-documents";
      return "/dashboard";
    }
    if (isHiringHtmlDoc()) {
      return "/hiring";
    }
    if (isCreateDocumentTemplateHtmlDoc()) {
      return "/create-document/template";
    }
    if (isCreateDocumentHtmlDoc()) {
      if (/^\/create-document\/templates\/[^/]+\/review$/.test(pathname)) return "/create-document/template-review";
      if (/^\/create-document\/templates\/[^/]+$/.test(pathname)) return "/create-document/templates/browse";
      if (pathname === "/create-document/method") return "/create-document/method";
      if (pathname === "/create-document/draft") return "/create-document/draft";
      if (pathname === "/create-document/ai-preview") return "/create-document/ai-preview";
      if (pathname === "/create-document/manual-preview") return "/create-document/manual-preview";
      if (pathname === "/create-document/document-edit") return "/create-document/document-edit";
      return "/create-document/templates/browse";
    }
    if (isDocumentsHtmlDoc()) {
      return "/documents";
    }
    if (isEmployeesHtmlDoc()) {
      return "/employees";
    }
    if (pathname === "/documents") return "/documents";
    return "/documents";
  }

  var reviewState = { cat: "", file: "", count: 0, view: 0 };
  var templateReviewBound = false;

  function collectReviewPages() {
    var out = [];
    document.querySelectorAll(".ws-review-page-cb").forEach(function (cb) {
      if (cb.checked) out.push(parseInt(cb.getAttribute("data-review-p"), 10));
    });
    return out;
  }

  function syncTemplateReviewUi() {
    var meta = document.getElementById("ws-review-viewer-meta");
    if (meta) meta.textContent = "Page " + (reviewState.view + 1) + " of " + reviewState.count;
    var panel = document.getElementById("ws-review-viewer-panel");
    if (panel) panel.textContent = "Preview — page " + (reviewState.view + 1);
    document.querySelectorAll("[data-review-page-idx]").forEach(function (row) {
      var idx = parseInt(row.getAttribute("data-review-page-idx"), 10);
      row.classList.toggle("wb-template-review__page-row--active", idx === reviewState.view);
    });
    var pages = collectReviewPages();
    var cont = document.getElementById("ws-review-continue");
    if (cont) {
      if (!pages.length) {
        cont.setAttribute("href", "#");
      } else {
        cont.setAttribute(
          "href",
          "#/create-document/method?category=" +
            encodeURIComponent(reviewState.cat) +
            "&file=" +
            encodeURIComponent(reviewState.file) +
            "&pages=" +
            pages.join(",")
        );
      }
    }
  }

  function updateTemplateReviewPage(pathname, search) {
    var m = pathname.match(/^\/create-document\/templates\/([^/]+)\/review$/);
    if (!m) return;
    reviewState.cat = m[1];
    var params = new URLSearchParams(search.replace(/^\?/, ""));
    reviewState.file = params.get("file") || "";
    var ol = document.getElementById("ws-review-page-list");
    var fname = document.getElementById("ws-review-file-name");
    var panel = document.getElementById("ws-review-viewer-panel");
    var meta = document.getElementById("ws-review-viewer-meta");
    var prevBtn = document.getElementById("ws-review-prev-page");
    var nextBtn = document.getElementById("ws-review-next-page");
    var cont = document.getElementById("ws-review-continue");
    var back = document.getElementById("ws-review-back");

    if (!reviewState.file) {
      reviewState.count = 0;
      reviewState.view = 0;
      if (ol) ol.innerHTML = "";
      if (fname) fname.textContent = "";
      if (back) back.setAttribute("href", "#/create-document/templates/" + encodeURIComponent(reviewState.cat));
      if (panel) {
        panel.hidden = false;
        panel.innerHTML =
          '<div style="max-width:28rem;margin:0 auto 0.75rem;text-align:left">' +
          '<p style="margin:0 0 0.5rem;font-weight:800;font-size:1.02rem;color:var(--wb-forest)">Choose a template first</p>' +
          '<p style="margin:0 0 0.65rem;line-height:1.55;color:var(--wb-muted);font-size:0.9rem">Pick a PDF from your category so the URL includes <code style="font-size:0.85em;font-weight:700;padding:0.1em 0.35em;border-radius:4px;background:var(--wb-surface-muted)">?file=Name.pdf</code>. Then you can toggle Include per page.</p>' +
          '<ol style="margin:0 0 0.85rem;padding:0 0 0 1rem;font-size:0.84rem;line-height:1.5;color:var(--wb-muted)">' +
          "<li style=\"margin-bottom:0.35rem\">Open the category list for this folder.</li>" +
          "<li>Use the row action that opens review with a file in the address.</li>" +
          "<li>Continue to <strong>How to create</strong> after pages look right.</li>" +
          "</ol></div>" +
          '<div style="margin:0 auto 0.85rem;max-width:32rem;padding:0.65rem 0.75rem;border-radius:8px;background:rgba(5,33,22,0.04);border:1px solid var(--wb-border);text-align:left">' +
          '<span style="display:block;margin-bottom:0.35rem;font-size:0.62rem;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:var(--wb-muted-soft)">Example path</span>' +
          '<code style="font-size:0.72rem;font-weight:600;line-height:1.45;word-break:break-all;color:var(--wb-forest-mid)">/create-document/templates/' +
          encodeURIComponent(reviewState.cat) +
          "/review?file=Offer_Letter_Template.pdf</code></div>" +
          '<div class="wb-empty-mock-surface" style="margin:0 auto;max-width:36rem">' +
          '<p class="wb-empty-mock-eyebrow">Layout preview (placeholder)</p>' +
          '<div class="wb-template-review__wire">' +
          '<div class="wb-template-review__wire-sidebar">' +
          '<span class="wb-template-review__wire-line wb-template-review__wire-line--short"></span>' +
          '<span class="wb-template-review__wire-line"></span>' +
          '<span class="wb-template-review__wire-line"></span>' +
          '<span class="wb-template-review__wire-line wb-template-review__wire-line--mid"></span>' +
          "</div>" +
          '<div class="wb-template-review__wire-main">' +
          '<span class="wb-template-review__wire-sheet"></span>' +
          '<div class="wb-template-review__wire-pager">' +
          '<span class="wb-template-review__wire-chip"></span>' +
          '<span class="wb-template-review__wire-chip wb-template-review__wire-chip--wide"></span>' +
          '<span class="wb-template-review__wire-chip"></span>' +
          "</div></div></div></div>" +
          '<p style="margin:0.85rem 0 0;text-align:center"><a class="wb-btn wb-btn--primary" href="#/create-document/templates/' +
          encodeURIComponent(reviewState.cat) +
          '">Back to templates</a></p>';
      }
      if (meta) meta.textContent = "";
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      if (cont) cont.setAttribute("href", "#");
      return;
    }

    reviewState.count = (window.WB_FILE_PAGE_COUNT || {})[reviewState.file] || FILE_PAGE_COUNT[reviewState.file] || 4;
    reviewState.view = 0;
    if (back) back.setAttribute("href", "#/create-document/templates/" + encodeURIComponent(reviewState.cat));
    if (fname) fname.textContent = reviewState.file;
    if (panel) {
      panel.innerHTML = "";
      panel.textContent = "Preview — page 1";
    }
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
    if (!ol) return;
    ol.innerHTML = "";
    for (var i = 0; i < reviewState.count; i++) {
      var n = i + 1;
      var li = document.createElement("li");
      li.className = "wb-template-review__page-item";
      var row = document.createElement("button");
      row.type = "button";
      row.className =
        "wb-template-review__page-row" + (i === 0 ? " wb-template-review__page-row--active" : "");
      row.setAttribute("data-review-page-idx", String(i));
      row.innerHTML =
        '<span class="wb-template-review__page-thumb-wrap" aria-hidden="true"><span style="display:block;width:100%;min-height:2.5rem;background:#e4e8e6;border-radius:4px"></span></span>' +
        '<span class="wb-template-review__page-meta"><span class="wb-template-review__page-num">Page ' +
        n +
        '</span><label class="wb-template-review__check"><input type="checkbox" class="ws-review-page-cb" checked data-review-p="' +
        n +
        '" /> <span>Include</span></label></span>';
      li.appendChild(row);
      ol.appendChild(li);
    }
    if (!templateReviewBound) {
      templateReviewBound = true;
      var root = document.getElementById("ws-template-review-root");
      if (root) {
        root.addEventListener("click", function (ev) {
          var t = ev.target;
          if (t.id === "ws-review-prev-page") {
            reviewState.view = Math.max(0, reviewState.view - 1);
            syncTemplateReviewUi();
            return;
          }
          if (t.id === "ws-review-next-page") {
            reviewState.view = Math.min(reviewState.count - 1, reviewState.view + 1);
            syncTemplateReviewUi();
            return;
          }
          var row = t.closest && t.closest("[data-review-page-idx]");
          if (row && (!t.closest || !t.closest(".wb-template-review__check"))) {
            reviewState.view = parseInt(row.getAttribute("data-review-page-idx"), 10);
            syncTemplateReviewUi();
          }
        });
        root.addEventListener("change", function (ev) {
          if (ev.target.classList && ev.target.classList.contains("ws-review-page-cb")) {
            var pages = collectReviewPages();
            if (!pages.length) {
              ev.target.checked = true;
            }
            syncTemplateReviewUi();
          }
        });
      }
    }
    syncTemplateReviewUi();
  }

  var BROWSE_FILTER_CHIPS = ["All", "Policy", "Template", "Form", "Compliance", "General"];
  var browseUiBound = false;
  var browseLastCat = "";
  var browseLb = { file: "", pages: 1, page: 0, zoom: 1 };

  function escapeHtmlBrowse(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtmlAttrBrowse(s) {
    return escapeHtmlBrowse(s).replace(/"/g, "&quot;");
  }

  function getTemplateBrowsePrimaryTag(fileName, sectionTitle) {
    var blob = String(fileName + " " + sectionTitle)
      .toLowerCase()
      .replace(/_/g, " ");
    if (
      /\b(checklist|authorization|scorecard|worksheet|request list|calibration|email pack|summary form|assignment|agenda|script|deposit|correction|reference check|take home|360|structured interview|peer feedback|vendor dpa)\b/i.test(
        blob
      )
    )
      return "Form";
    if (
      /\b(handbook|policy|conduct|code of|privacy|acknowledgment|addendum|nda|confidentiality|equipment|leave|enrollment|rounding|device|harassment|social media|retention schedule|written warning|pip plan|final warning|voluntary|promotion|transfer|comp change|rif|cobra|intern offer|remote work|anti)\b/i.test(
        blob
      )
    )
      return "Policy";
    if (/\b(compliance|whistle|garnishment|background check|dpa|labor law)\b/i.test(blob)) return "Compliance";
    if (
      /\b(template|letter|agreement|overview|matrix|plan|posting|description|job posting|offer|contractor|services|okr|smart goals|quota|bonus|salary bands|overtime|hsa|fsa|direct deposit|payroll|state labor|employee privacy|mutual|visitor|executive compensation|independent contractor)\b/i.test(
        blob
      )
    )
      return "Template";
    return "General";
  }

  function humanizeBrowseTitle(name) {
    return String(name || "")
      .replace(/\.pdf$/i, "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function browseTagClass(tag) {
    var map = {
      Policy: "wb-create-templates__tag--policy",
      Template: "wb-create-templates__tag--template",
      Form: "wb-create-templates__tag--form",
      Compliance: "wb-create-templates__tag--compliance",
      General: "wb-create-templates__tag--general",
    };
    return map[tag] || "wb-create-templates__tag--general";
  }

  function flattenBrowseRows(catId) {
    var sections = (window.WB_CREATE_DOC_TEMPLATE_SECTIONS || {})[catId];
    if (!sections) return [];
    var rows = [];
    sections.forEach(function (sec) {
      sec.files.forEach(function (f) {
        rows.push({
          name: f.name,
          pageCount: f.pageCount,
          section: sec.sectionTitle,
          display: humanizeBrowseTitle(f.name),
          tag: getTemplateBrowsePrimaryTag(f.name, sec.sectionTitle),
        });
      });
    });
    return rows;
  }

  function filterBrowseRows(rows, filter, q) {
    var qq = (q || "").trim().toLowerCase();
    return rows.filter(function (r) {
      if (filter && filter !== "All" && r.tag !== filter) return false;
      if (!qq) return true;
      return (
        r.display.toLowerCase().indexOf(qq) !== -1 ||
        r.name.toLowerCase().indexOf(qq) !== -1 ||
        r.section.toLowerCase().indexOf(qq) !== -1 ||
        r.tag.toLowerCase().indexOf(qq) !== -1
      );
    });
  }

  function sortBrowseRows(rows, sort) {
    var list = rows.slice();
    function cmpName(a, b) {
      return a.display.localeCompare(b.display);
    }
    function cmpSection(a, b) {
      var c = a.section.localeCompare(b.section);
      return c !== 0 ? c : cmpName(a, b);
    }
    list.sort(function (a, b) {
      if (sort === "name-asc") return cmpName(a, b);
      if (sort === "name-desc") return cmpName(b, a);
      if (sort === "pages-asc") return a.pageCount - b.pageCount || cmpName(a, b);
      if (sort === "pages-desc") return b.pageCount - a.pageCount || cmpName(a, b);
      return cmpSection(a, b);
    });
    return list;
  }

  function getBrowseDomState() {
    var root = document.getElementById("ws-browse-root");
    var qEl = document.getElementById("ws-browse-q");
    var sortEl = document.getElementById("ws-browse-sort");
    var chipActive = document.querySelector("[data-browse-chip].wb-create-templates__browse-chip--active");
    return {
      root: root,
      cat: root ? root.getAttribute("data-browse-cat") || "company" : "company",
      q: qEl ? qEl.value : "",
      sort: sortEl && sortEl.value ? sortEl.value : "section-asc",
      filter: chipActive ? chipActive.getAttribute("data-browse-chip") || "All" : "All",
    };
  }

  function browseLbPagerUi() {
    var prev = document.getElementById("ws-browse-lb-prev");
    var next = document.getElementById("ws-browse-lb-next");
    var pos = document.getElementById("ws-browse-lb-pos");
    if (prev) prev.disabled = browseLb.page <= 0;
    if (next) next.disabled = browseLb.page >= browseLb.pages - 1;
    if (pos) pos.textContent = "Page " + (browseLb.page + 1) + " of " + browseLb.pages;
  }

  function syncBrowseLightboxImage() {
    if (typeof window.docPagePreviewDataUri !== "function") return;
    var lb = document.getElementById("ws-browse-lightbox");
    if (!lb || lb.hidden) return;
    var img = lb.querySelector(".ws-browse-lb-img");
    var meta = lb.querySelector(".ws-browse-lb-meta");
    if (img) img.src = window.docPagePreviewDataUri(browseLb.file, browseLb.page, browseLb.pages);
    if (meta)
      meta.textContent =
        browseLb.pages +
        " pages · Page " +
        (browseLb.page + 1) +
        " of " +
        browseLb.pages +
        " · SVG placeholder";
    var pct = Math.round(browseLb.zoom * 100);
    if (img) img.style.width = pct + "%";
    lb.querySelectorAll(".ws-browse-zoom").forEach(function (btn) {
      var z = parseFloat(btn.getAttribute("data-zoom") || "1");
      btn.classList.toggle("wb-doc-preview-lightbox__zoom-btn--active", Math.abs(z - browseLb.zoom) < 0.001);
    });
    browseLbPagerUi();
  }

  function closeBrowseLightbox() {
    var lb = document.getElementById("ws-browse-lightbox");
    if (lb) {
      lb.hidden = true;
      lb.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  }

  function ensureBrowseLightboxShell() {
    var lb = document.getElementById("ws-browse-lightbox");
    if (!lb || lb.getAttribute("data-built")) return;
    lb.innerHTML =
      '<button type="button" class="wb-doc-preview-lightbox__backdrop" aria-label="Close"></button>' +
      '<div class="wb-doc-preview-lightbox__panel wb-doc-preview-lightbox__panel--browse" role="dialog" aria-modal="true">' +
      '<button type="button" class="wb-doc-preview-lightbox__close" aria-label="Close">×</button>' +
      '<p class="wb-doc-preview-lightbox__meta ws-browse-lb-meta"></p>' +
      '<div class="wb-doc-preview-lightbox__zoom" role="group" aria-label="Preview zoom">' +
      '<span class="wb-doc-preview-lightbox__zoom-label">View size</span>' +
      '<button type="button" class="wb-doc-preview-lightbox__zoom-btn ws-browse-zoom" data-zoom="1">Fit</button>' +
      '<button type="button" class="wb-doc-preview-lightbox__zoom-btn ws-browse-zoom" data-zoom="1.25">125%</button>' +
      '<button type="button" class="wb-doc-preview-lightbox__zoom-btn ws-browse-zoom" data-zoom="1.5">150%</button>' +
      '<button type="button" class="wb-doc-preview-lightbox__zoom-btn ws-browse-zoom" data-zoom="2">200%</button></div>' +
      '<div class="wb-doc-preview-lightbox__img-wrap wb-doc-preview-lightbox__img-wrap--zoomable">' +
      '<img class="wb-doc-preview-lightbox__img wb-doc-preview-lightbox__img--zoomed ws-browse-lb-img" alt=""/></div>' +
      '<div class="wb-doc-preview-lightbox__pager">' +
      '<button type="button" class="wb-doc-preview-lightbox__nav wb-doc-preview-lightbox__nav--prev" id="ws-browse-lb-prev">← Previous</button>' +
      '<span class="wb-doc-preview-lightbox__position" id="ws-browse-lb-pos"></span>' +
      '<button type="button" class="wb-doc-preview-lightbox__nav wb-doc-preview-lightbox__nav--next" id="ws-browse-lb-next">Next →</button></div>' +
      '<p class="wb-doc-preview-lightbox__caption"></p>' +
      '<p class="wb-doc-preview-lightbox__subcaption"></p></div>';
    lb.setAttribute("data-built", "1");
    lb.querySelector(".wb-doc-preview-lightbox__backdrop").addEventListener("click", closeBrowseLightbox);
    lb.querySelector(".wb-doc-preview-lightbox__close").addEventListener("click", closeBrowseLightbox);
    lb.querySelectorAll(".ws-browse-zoom").forEach(function (btn) {
      btn.addEventListener("click", function () {
        browseLb.zoom = parseFloat(btn.getAttribute("data-zoom") || "1");
        syncBrowseLightboxImage();
      });
    });
    document.getElementById("ws-browse-lb-prev").addEventListener("click", function () {
      browseLb.page = Math.max(0, browseLb.page - 1);
      syncBrowseLightboxImage();
    });
    document.getElementById("ws-browse-lb-next").addEventListener("click", function () {
      browseLb.page = Math.min(browseLb.pages - 1, browseLb.page + 1);
      syncBrowseLightboxImage();
    });
  }

  function openBrowseLightbox(file, pages) {
    browseLb.file = file;
    browseLb.pages = Math.max(1, Math.min(99, pages | 0));
    browseLb.page = 0;
    browseLb.zoom = 1;
    ensureBrowseLightboxShell();
    var lb = document.getElementById("ws-browse-lightbox");
    if (!lb) return;
    lb.hidden = false;
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    var cap = lb.querySelector(".wb-doc-preview-lightbox__caption");
    var sub = lb.querySelector(".wb-doc-preview-lightbox__subcaption");
    if (cap) cap.textContent = humanizeBrowseTitle(file);
    if (sub) sub.textContent = file;
    syncBrowseLightboxImage();
  }

  function renderBrowseTemplates() {
    var st = getBrowseDomState();
    var root = st.root;
    if (!root || !window.WB_CREATE_DOC_TEMPLATE_SECTIONS) return;
    var flat = flattenBrowseRows(st.cat);
    var list = sortBrowseRows(filterBrowseRows(flat, st.filter, st.q), st.sort);
    var grid = document.getElementById("ws-browse-grid");
    var empty = document.getElementById("ws-browse-empty");
    var countEl = document.getElementById("ws-browse-count");
    if (countEl) {
      countEl.innerHTML =
        "Showing <strong>" +
        list.length +
        "</strong> of <strong>" +
        flat.length +
        "</strong> templates";
    }
    if (empty) {
      empty.hidden = list.length > 0;
    }
    if (!grid) return;
    grid.innerHTML = "";
    if (typeof window.docPagePreviewDataUri !== "function") return;
    list.forEach(function (r) {
      var thumb = window.docPagePreviewDataUri(r.name, 0, r.pageCount);
      var reviewHref =
        "#/create-document/templates/" + encodeURIComponent(st.cat) + "/review?file=" + encodeURIComponent(r.name);
      var li = document.createElement("li");
      li.className = "wb-create-templates__preview-item";
      li.innerHTML =
        '<div class="wb-create-templates__preview-card">' +
        '<button type="button" class="wb-create-templates__preview ws-browse-open-lb" data-file="' +
        escapeHtmlAttrBrowse(r.name) +
        '" data-pages="' +
        r.pageCount +
        '" aria-label="Enlarge preview of ' +
        escapeHtmlAttrBrowse(r.display) +
        '">' +
        '<span class="wb-create-templates__thumb-wrap"><img src="' +
        thumb +
        '" alt="" class="wb-create-templates__thumb" width="200" height="262" decoding="async"/></span>' +
        '<span class="wb-create-templates__preview-meta">' +
        '<span class="wb-create-templates__preview-section">' +
        escapeHtmlBrowse(r.section) +
        "</span>" +
        '<span class="wb-create-templates__preview-name">' +
        escapeHtmlBrowse(r.display) +
        "</span>" +
        '<span class="wb-create-templates__preview-filename">' +
        escapeHtmlBrowse(r.name) +
        "</span>" +
        '<span class="wb-create-templates__preview-row">' +
        '<span class="wb-create-templates__tag ' +
        browseTagClass(r.tag) +
        '">' +
        escapeHtmlBrowse(r.tag) +
        "</span>" +
        '<span class="wb-create-templates__preview-pages">' +
        r.pageCount +
        " pages</span></span></span></button>" +
        '<div class="wb-create-templates__card-actions">' +
        '<button type="button" class="wb-btn wb-btn--muted wb-create-templates__enlarge ws-browse-open-lb" data-file="' +
        escapeHtmlAttrBrowse(r.name) +
        '" data-pages="' +
        r.pageCount +
        '">Enlarge preview</button>' +
        '<a class="wb-btn wb-btn--primary wb-create-templates__use" href="' +
        reviewHref +
        '">Choose template</a>' +
        "</div></div>";
      grid.appendChild(li);
    });
  }

  function bindBrowseUiOnce() {
    if (browseUiBound) return;
    var root = document.getElementById("ws-browse-root");
    if (!root) return;
    browseUiBound = true;
    var chips = document.getElementById("ws-browse-chips");
    if (chips) {
      chips.innerHTML = "";
      BROWSE_FILTER_CHIPS.forEach(function (chip) {
        var b = document.createElement("button");
        b.type = "button";
        b.className =
          "wb-create-templates__browse-chip" +
          (chip === "All" ? " wb-create-templates__browse-chip--active" : "");
        b.setAttribute("data-browse-chip", chip);
        b.setAttribute("aria-pressed", chip === "All" ? "true" : "false");
        b.textContent = chip;
        chips.appendChild(b);
      });
      chips.addEventListener("click", function (e) {
        var t = e.target;
        if (!t.getAttribute || !t.getAttribute("data-browse-chip")) return;
        chips.querySelectorAll("[data-browse-chip]").forEach(function (c) {
          var on = c === t;
          c.classList.toggle("wb-create-templates__browse-chip--active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        renderBrowseTemplates();
      });
    }
    var qEl = document.getElementById("ws-browse-q");
    if (qEl) {
      qEl.addEventListener("input", function () {
        renderBrowseTemplates();
      });
    }
    var sEl = document.getElementById("ws-browse-sort");
    if (sEl) {
      sEl.addEventListener("change", function () {
        renderBrowseTemplates();
      });
    }
    var reset = document.getElementById("ws-browse-reset");
    if (reset) {
      reset.addEventListener("click", function () {
        if (qEl) qEl.value = "";
        if (sEl) sEl.value = "section-asc";
        if (chips) {
          chips.querySelectorAll("[data-browse-chip]").forEach(function (c) {
            var on = c.getAttribute("data-browse-chip") === "All";
            c.classList.toggle("wb-create-templates__browse-chip--active", on);
            c.setAttribute("aria-pressed", on ? "true" : "false");
          });
        }
        renderBrowseTemplates();
      });
    }
    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var btn = t.closest(".ws-browse-open-lb");
      if (!btn) return;
      var f = btn.getAttribute("data-file");
      var p = parseInt(btn.getAttribute("data-pages") || "1", 10);
      if (f) openBrowseLightbox(f, p);
    });
    document.addEventListener("keydown", function (e) {
      var lb = document.getElementById("ws-browse-lightbox");
      if (!lb || lb.hidden) return;
      if (e.key === "Escape") closeBrowseLightbox();
    });
  }

  function updateBrowsePage(pathname) {
    var m = pathname.match(/^\/create-document\/templates\/([^/]+)$/);
    var id = m ? m[1] : "company";
    var title = CAT_LABEL[id] || "Templates";
    var crumb = document.getElementById("ws-browse-crumb");
    var h = document.getElementById("ws-browse-title");
    var eyebrow = document.getElementById("ws-browse-eyebrow");
    if (crumb) crumb.textContent = title;
    if (h) h.textContent = title;
    if (eyebrow) eyebrow.textContent = title;
    var root = document.getElementById("ws-browse-root");
    if (root) {
      if (browseLastCat !== id) {
        browseLastCat = id;
        var qEl0 = document.getElementById("ws-browse-q");
        var sEl0 = document.getElementById("ws-browse-sort");
        if (qEl0) qEl0.value = "";
        if (sEl0) sEl0.value = "section-asc";
        var chips0 = document.getElementById("ws-browse-chips");
        if (chips0) {
          chips0.querySelectorAll("[data-browse-chip]").forEach(function (c) {
            var on = c.getAttribute("data-browse-chip") === "All";
            c.classList.toggle("wb-create-templates__browse-chip--active", on);
            c.setAttribute("aria-pressed", on ? "true" : "false");
          });
        }
      }
      root.setAttribute("data-browse-cat", id);
      bindBrowseUiOnce();
      renderBrowseTemplates();
    }
  }

  function humanizeMethodTemplateLabel(file) {
    var raw = (file || "").split("/").pop() || "";
    var lower = raw.toLowerCase();
    if (lower.indexOf("offer") !== -1 && lower.indexOf("letter") !== -1) return "Offer Letter";
    var s = raw.replace(/\.pdf$/i, "").replace(/\+/g, " ").replace(/_/g, " ").trim();
    return s.replace(/\s+Template$/i, "").trim();
  }

  function escapeHtmlStatic(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function updateMethodPage(search) {
    var params = new URLSearchParams(search.replace(/^\?/, ""));
    var category = params.get("category") || "company";
    var fileRaw = params.get("file");
    var file = fileRaw && fileRaw.trim() ? fileRaw.trim() : "";
    var pages = params.get("pages");
    var catTitle = CAT_LABEL[category] || category;
    var browseHash = "#/create-document/templates/" + encodeURIComponent(category);
    var sub = document.getElementById("ws-method-sub");
    if (sub) {
      if (file) {
        var lab = humanizeMethodTemplateLabel(file);
        sub.innerHTML =
          "You chose <strong>" +
          escapeHtmlStatic(lab) +
          " (" +
          escapeHtmlStatic(catTitle) +
          ")</strong>. Pick how you want to fill it in.";
      } else {
        sub.innerHTML =
          "You’re in <strong>" +
          escapeHtmlStatic(catTitle) +
          '</strong>. <a class="wb-link" href="' +
          browseHash +
          '">Choose a template</a> first, then pick how you want to fill it in.';
      }
    }
    var pick = document.getElementById("ws-method-pick-template");
    var pickWrap = document.querySelector(".wb-create-method__pick-wrap");
    if (pick) pick.setAttribute("href", browseHash);
    if (pick && pickWrap) {
      if (file) {
        pickWrap.hidden = false;
        pick.textContent = "Choose a different template";
      } else {
        pickWrap.hidden = true;
      }
    }
    var note = document.getElementById("ws-method-pages-note");
    if (note) {
      if (pages) {
        note.hidden = false;
        note.innerHTML =
          'Including pages: <strong>' + pages.replace(/,/g, ", ") + "</strong>";
      } else {
        note.hidden = true;
        note.textContent = "";
      }
    }
    var ai = document.getElementById("ws-method-ai");
    var mn = document.getElementById("ws-method-manual");
    if (!file) {
      if (ai) ai.setAttribute("href", browseHash);
      if (mn) mn.setAttribute("href", browseHash);
    } else {
      var q = new URLSearchParams({ file: file, category: category });
      if (pages) q.set("pages", pages);
      q.set("method", "ai");
      if (ai) ai.setAttribute("href", "#/create-document/draft?" + q.toString());
      q.set("method", "manual");
      if (mn) mn.setAttribute("href", "#/create-document/draft?" + q.toString());
    }
  }

  function updateDraftPage(search) {
    var params = new URLSearchParams(search.replace(/^\?/, ""));
    var method = params.get("method") || "ai";
    var pages = params.get("pages");
    var next = document.getElementById("ws-draft-next");
    if (!next) return;
    var qp = new URLSearchParams({
      file: params.get("file") || "",
      category: params.get("category") || "",
      method: method,
    });
    if (pages) qp.set("pages", pages);
    var qs = "?" + qp.toString();
    if (method === "manual") next.setAttribute("href", "#/create-document/manual-preview" + qs);
    else next.setAttribute("href", "#/create-document/ai-preview" + qs);
  }

  function showWorkspacePage(pathname, search) {
    showRoot("workspace");
    var key = workspaceMainKey(pathname, search);
    document.querySelectorAll("[data-ws-main]").forEach(function (main) {
      main.hidden = main.getAttribute("data-ws-main") !== key;
    });
    var mainClass = "wb-dash__main";
    document.querySelectorAll("[data-ws-main]").forEach(function (main) {
      if (main.hidden) return;
      main.className =
        mainClass +
        (key === "/dashboard" ? " wb-dash__main--dashboard" : "") +
        (key === "/documents" ? " wb-dash__main--documents" : "") +
        (key === "/create-document/templates/browse" || key === "/create-document/template-review"
          ? " wb-dash__main--sample-templates"
          : "");
    });
    if (key === "/create-document/templates/browse") updateBrowsePage(pathname);
    if (key === "/create-document/template-review") updateTemplateReviewPage(pathname, search);
    if (key === "/create-document/method") updateMethodPage(search);
    if (key === "/create-document/draft") updateDraftPage(search);

    document.querySelectorAll("[data-ws-nav]").forEach(function (a) {
      var p = a.getAttribute("data-ws-nav");
      a.classList.toggle("wb-dash__nav-link--active", pathname === p);
    });

    var inCreateDocFlow = pathname.indexOf("/create-document/") === 0;
    document.querySelectorAll('a.wb-dash__btn--primary[href*="create-document"]').forEach(function (a) {
      a.classList.toggle("wb-dash__btn--create-flow", inCreateDocFlow);
    });

    setTitleForPath(pathname);
  }

  function applyRoute() {
    if (isDashboardHtmlDoc()) {
      var raw0 = window.location.hash.replace(/^#/, "");
      if (raw0.charAt(0) === "!") raw0 = raw0.slice(1);
      var path0 = raw0.charAt(0) === "/";
      if (!raw0 || raw0 === "/" || !path0) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/dashboard"
        );
      }
    }

    if (isSettingsHtmlDoc()) {
      var rawS = window.location.hash.replace(/^#/, "");
      if (rawS.charAt(0) === "!") rawS = rawS.slice(1);
      var pathS = rawS.charAt(0) === "/";
      if (!rawS || rawS === "/" || !pathS || rawS === "/settings" || rawS === "/settings/") {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/settings/profile"
        );
      }
    }

    if (isHiringHtmlDoc()) {
      var rawH = window.location.hash.replace(/^#/, "");
      if (rawH.charAt(0) === "!") rawH = rawH.slice(1);
      var pathH = rawH.charAt(0) === "/";
      if (!rawH || rawH === "/" || !pathH) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/hiring"
        );
      }
    }

    if (isCreateDocumentHtmlDoc()) {
      var rawC = window.location.hash.replace(/^#/, "");
      if (rawC.charAt(0) === "!") rawC = rawC.slice(1);
      var pathC = rawC.charAt(0) === "/";
      if (!rawC || rawC === "/" || !pathC) {
        window.location.replace("create-document-template.html#/create-document/template");
        return;
      }
    }

    if (isCreateDocumentTemplateHtmlDoc()) {
      var rawT = window.location.hash.replace(/^#/, "");
      if (rawT.charAt(0) === "!") rawT = rawT.slice(1);
      var pathT = rawT.charAt(0) === "/";
      if (!rawT || rawT === "/" || !pathT) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/create-document/template"
        );
      }
    }

    if (isDocumentsHtmlDoc()) {
      var rawD = window.location.hash.replace(/^#/, "");
      if (rawD.charAt(0) === "!") rawD = rawD.slice(1);
      var pathD = rawD.charAt(0) === "/";
      if (!rawD || rawD === "/" || !pathD) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/documents"
        );
      }
    }

    if (isEmployeesHtmlDoc()) {
      var rawE = window.location.hash.replace(/^#/, "");
      if (rawE.charAt(0) === "!") rawE = rawE.slice(1);
      var pathE = rawE.charAt(0) === "/";
      if (!rawE || rawE === "/" || !pathE) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/employees"
        );
      }
    }

    var prev = window.__staticPrevView;
    var parsed = parseHash();

    if (isDashboardHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isHiringHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isSettingsHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isCreateDocumentShellDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isDocumentsHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isEmployeesHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (parsed.kind === "marketing") {
      hideAllRoots();
      var mkt = document.querySelector('[data-static-view="marketing"]');
      if (mkt) mkt.hidden = false;
      document.title = "Workbench HR";
      if (prev && prev !== "marketing") window.scrollTo(0, 0);
      window.__staticPrevView = "marketing";
      var sec = normalizeSection(parsed.section);
      setMarketingTabs(sec);
      if (parsed.section === "request-demo") setTimeout(function () { scrollToId("request-demo"); }, 80);
      else if (parsed.section === "platform") setTimeout(scrollPlatformCentered, 80);
      return;
    }

    if (parsed.kind !== "path") return;

    var pathname = parsed.pathname;
    var search = parsed.search || "";
    window.__staticPrevView = "path:" + pathname + search;

    if (isCreateDocumentHtmlDoc() && pathname === "/create-document/template") {
      window.location.replace(
        "create-document-template.html" + (window.location.hash || "#/create-document/template")
      );
      return;
    }

    if (isCreateDocumentTemplateHtmlDoc() && pathname !== "/create-document/template") {
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(
          "create-document.html" +
            (window.location.hash || "#/create-document/templates/company")
        );
        return;
      }
      if (isDashboardHubPath(pathname)) {
        window.location.replace(
          "dashboard.html" + (window.location.hash || "#/dashboard")
        );
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace(
          "settings.html" + (window.location.hash || "#/settings/profile")
        );
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isDocumentsPath(pathname)) {
        window.location.replace("documents.html" + (window.location.hash || "#/documents"));
        return;
      }
      if (isEmployeesPath(pathname)) {
        window.location.replace("employees.html" + (window.location.hash || "#/employees"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isCreateDocumentShellDoc() && isCreateDocumentPath(pathname)) {
      window.location.replace(createDocumentPathHref(pathname, "#/create-document/template"));
      return;
    }
    if (isCreateDocumentHtmlDoc() && !isCreateDocumentPath(pathname)) {
      if (isDashboardHubPath(pathname)) {
        window.location.replace(
          "dashboard.html" + (window.location.hash || "#/dashboard")
        );
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace(
          "settings.html" + (window.location.hash || "#/settings/profile")
        );
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isDocumentsPath(pathname)) {
        window.location.replace("documents.html" + (window.location.hash || "#/documents"));
        return;
      }
      if (isEmployeesPath(pathname)) {
        window.location.replace("employees.html" + (window.location.hash || "#/employees"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isDocumentsHtmlDoc() && isDocumentsPath(pathname)) {
      window.location.replace("documents.html" + (window.location.hash || "#/documents"));
      return;
    }
    if (isDocumentsHtmlDoc() && !isDocumentsPath(pathname)) {
      if (isDashboardHubPath(pathname)) {
        window.location.replace(
          "dashboard.html" + (window.location.hash || "#/dashboard")
        );
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace(
          "settings.html" + (window.location.hash || "#/settings/profile")
        );
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/template"));
        return;
      }
      if (isEmployeesPath(pathname)) {
        window.location.replace("employees.html" + (window.location.hash || "#/employees"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isEmployeesHtmlDoc() && isEmployeesPath(pathname)) {
      window.location.replace("employees.html" + (window.location.hash || "#/employees"));
      return;
    }
    if (isEmployeesHtmlDoc() && !isEmployeesPath(pathname)) {
      if (isDashboardHubPath(pathname)) {
        window.location.replace(
          "dashboard.html" + (window.location.hash || "#/dashboard")
        );
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace(
          "settings.html" + (window.location.hash || "#/settings/profile")
        );
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isDocumentsPath(pathname)) {
        window.location.replace("documents.html" + (window.location.hash || "#/documents"));
        return;
      }
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/template"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isHiringHtmlDoc() && isHiringPath(pathname)) {
      window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
      return;
    }
    if (isHiringHtmlDoc() && !isHiringPath(pathname)) {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isDocumentsPath(pathname)) {
        window.location.replace("documents.html" + (window.location.hash || "#/documents"));
        return;
      }
      if (isEmployeesPath(pathname)) {
        window.location.replace("employees.html" + (window.location.hash || "#/employees"));
        return;
      }
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/template"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isDashboardHtmlDoc() && isDashboardHubPath(pathname)) {
      window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
      return;
    }
    if (isDashboardHtmlDoc() && isSettingsHubPath(pathname)) {
      window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
      return;
    }
    if (isDashboardHtmlDoc() && isHiringPath(pathname)) {
      window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
      return;
    }
    if (isDashboardHtmlDoc() && isDocumentsPath(pathname)) {
      window.location.replace("documents.html" + (window.location.hash || "#/documents"));
      return;
    }
    if (isDashboardHtmlDoc() && isEmployeesPath(pathname)) {
      window.location.replace("employees.html" + (window.location.hash || "#/employees"));
      return;
    }
    if (isDashboardHtmlDoc() && isCreateDocumentPath(pathname)) {
      window.location.replace(createDocumentPathHref(pathname, "#/create-document/template"));
      return;
    }
    if (!isSettingsHtmlDoc() && isSettingsHubPath(pathname)) {
      window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
      return;
    }
    if (isSettingsHtmlDoc() && !isSettingsHubPath(pathname)) {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isDocumentsPath(pathname)) {
        window.location.replace("documents.html" + (window.location.hash || "#/documents"));
        return;
      }
      if (isEmployeesPath(pathname)) {
        window.location.replace("employees.html" + (window.location.hash || "#/employees"));
        return;
      }
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/template"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (pathname === "/about") {
      showRoot("about");
      document.title = DOC_TITLES["/about"];
    } else if (pathname === "/contact") {
      showRoot("contact");
      document.title = DOC_TITLES["/contact"];
    } else if (pathname === "/privacy") {
      showRoot("privacy");
      document.title = DOC_TITLES["/privacy"];
    } else if (pathname === "/terms") {
      showRoot("terms");
      document.title = DOC_TITLES["/terms"];
    } else if (pathname === "/login") {
      showRoot("login");
      document.title = DOC_TITLES["/login"];
    } else if (pathname === "/signup") {
      showRoot("signup");
      document.title = DOC_TITLES["/signup"];
    } else if (pathname === "/forgot-password") {
      showRoot("forgot-password");
      document.title = DOC_TITLES["/forgot-password"];
      resetForgot();
    } else if (pathname.indexOf("/onboarding/") === 0) {
      showOnboardingPage(pathname);
      window.scrollTo(0, 0);
    } else if (pathname === "/design-reference") {
      showRoot("design-reference");
      document.title = DOC_TITLES["/design-reference"];
      window.scrollTo(0, 0);
    } else if (pathname === "/settings" || pathname === "/settings/") {
      window.location.replace("settings.html#/settings/profile");
      return;
    } else if (pathname.indexOf("/settings/") === 0) {
      showSettingsPage(pathname);
      window.scrollTo(0, 0);
    } else if (pathname === "/create-document/template" && isCreateDocumentTemplateHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (isCreateDocumentPath(pathname) && isCreateDocumentHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (pathname === "/hiring" && isHiringHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (
      (pathname === "/assistant" ||
        pathname === "/dashboard" ||
        pathname === "/dashboard/sign-documents") &&
      isDashboardHtmlDoc()
    ) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (pathname === "/documents" && isDocumentsHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (pathname === "/employees" && isEmployeesHtmlDoc()) {
      showWorkspacePage(pathname, search);
      syncEmployeePortalView();
      window.scrollTo(0, 0);
    } else {
      window.location.hash = "#/";
    }
  }

  function resetForgot() {
    var ff = document.getElementById("forgot-form");
    var ft = document.getElementById("forgot-tagline");
    var fa = document.getElementById("forgot-after");
    if (ff) {
      ff.hidden = false;
      ff.reset();
    }
    if (ft) ft.hidden = false;
    if (fa) fa.hidden = true;
  }

  function onScrollMarketing() {
    if (parseHash().kind !== "marketing") return;
    var h = window.location.hash.replace(/^#/, "");
    if (h.charAt(0) === "/" || h.charAt(0) === "!") return;
    if (h === "platform" || h === "request-demo") return;
    setMarketingTabs(getScrollSpySection());
  }

  function bindMarketingNav() {
    document.querySelectorAll("[data-mkt-tab-link]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        var target = a.getAttribute("data-mkt-tab-link");
        if (target === "platform" && a.getAttribute("data-platform-center") === "1") {
          e.preventDefault();
          scrollPlatformCentered();
          setMarketingTabs("platform");
        } else if (target) {
          setMarketingTabs(target === "customers" ? "home" : target);
        }
      });
    });
  }

  function bindDemoForm() {
    var form = document.getElementById("demo-request-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var thanks = document.getElementById("demo-request-thanks");
      form.hidden = true;
      if (thanks) thanks.hidden = false;
    });
  }

  function bindContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var thanks = document.getElementById("contact-thanks");
      form.hidden = true;
      if (thanks) thanks.hidden = false;
    });
  }

  function bindAuthForms() {
    document.querySelectorAll("[data-static-auth-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        if (form.closest('[data-static-view="signup"]')) {
          e.preventDefault();
          window.location.hash = "#/onboarding/goal";
          return;
        }
        if (form.closest('[data-static-view="login"]')) {
          e.preventDefault();
          window.location.replace("dashboard.html#/dashboard");
          return;
        }
        e.preventDefault();
        var msg = form.querySelector("[data-static-auth-msg]");
        if (msg) msg.hidden = false;
      });
    });
  }

  function bindForgotForm() {
    var form = document.getElementById("forgot-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.hidden = true;
      var tag = document.getElementById("forgot-tagline");
      if (tag) tag.hidden = true;
      var after = document.getElementById("forgot-after");
      if (after) after.hidden = false;
    });
  }

  function bindGoals() {
    var selected = null;
    var grid = document.getElementById("goals-grid");
    var btn = document.getElementById("goals-continue");
    if (!grid || !btn) return;
    grid.querySelectorAll("[data-goal]").forEach(function (b) {
      b.addEventListener("click", function () {
        selected = b.getAttribute("data-goal");
        grid.querySelectorAll("[data-goal]").forEach(function (x) {
          var on = x.getAttribute("data-goal") === selected;
          x.classList.toggle("wb-goals-card--selected", on);
          x.setAttribute("aria-pressed", on ? "true" : "false");
        });
        btn.disabled = !selected;
      });
    });
    btn.addEventListener("click", function () {
      if (!selected) return;
      if (selected === "notifications") window.location.hash = "#/onboarding/notifications";
      else if (selected === "dashboard") window.location.replace("dashboard.html#/dashboard");
      else window.location.hash = "#/onboarding/privacy";
    });
  }

  function bindNotifyToggle() {
    var t = document.getElementById("notify-master-toggle");
    var wrap = document.getElementById("notify-master-wrap");
    if (!t || !wrap) return;
    t.addEventListener("click", function () {
      var on = !t.classList.contains("wb-toggle--on");
      t.classList.toggle("wb-toggle--on", on);
      t.setAttribute("aria-pressed", on ? "true" : "false");
      wrap.classList.toggle("wb-notify-feature--on", on);
    });
  }

  function closeProfileDeleteModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var modal = document.getElementById("profile-delete-modal");
    if (!modal) return;
    modal.setAttribute("hidden", "");
    modal.hidden = true;
    var form = document.getElementById("profile-delete-form");
    var err = document.getElementById("profile-delete-pass-err");
    var pw = document.getElementById("profile-delete-password");
    if (form) form.reset();
    if (err) {
      err.hidden = true;
      err.textContent = "";
    }
    if (pw) pw.removeAttribute("aria-invalid");
  }

  function openProfileDeleteModal(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    var modal = document.getElementById("profile-delete-modal");
    if (!modal) return;
    modal.removeAttribute("hidden");
    modal.hidden = false;
  }

  function bindEditableFieldsIn(root) {
    if (!root) return;
    root.querySelectorAll("[data-profile-editable]").forEach(function (label) {
      var btn = label.querySelector(".wb-profile-field__edit");
      var row = label.querySelector(".wb-profile-field__input-row");
      var input = row ? row.querySelector("input") : null;
      if (!btn || !row || !input) return;
      btn.addEventListener("click", function () {
        var on = btn.getAttribute("aria-pressed") === "true";
        if (!on) {
          input.readOnly = false;
          row.classList.add("wb-profile-field__input-row--editing");
          btn.textContent = "Done ✎";
          btn.setAttribute("aria-pressed", "true");
        } else {
          input.readOnly = true;
          row.classList.remove("wb-profile-field__input-row--editing");
          btn.textContent = "Edit ✎";
          btn.setAttribute("aria-pressed", "false");
        }
      });
    });
  }

  function bindPhoneFieldIn(phoneRoot, displayId, countryId, nationalId) {
    if (!phoneRoot) return;
    var ptoggle = phoneRoot.querySelector("[data-profile-phone-toggle]");
    var pview = phoneRoot.querySelector("[data-profile-phone-view]");
    var pedit = phoneRoot.querySelector("[data-profile-phone-edit]");
    var dis = document.getElementById(displayId);
    var sel = document.getElementById(countryId);
    var nat = document.getElementById(nationalId);
    if (!ptoggle || !pview || !pedit || !dis || !sel || !nat) return;
    ptoggle.addEventListener("click", function () {
      var on = ptoggle.getAttribute("aria-pressed") === "true";
      if (!on) {
        pview.hidden = true;
        pedit.hidden = false;
        ptoggle.textContent = "Done ✎";
        ptoggle.setAttribute("aria-pressed", "true");
      } else {
        var optLabel = sel.options[sel.selectedIndex].textContent.trim();
        dis.value = optLabel + " " + nat.value.trim();
        pedit.hidden = true;
        pview.hidden = false;
        ptoggle.textContent = "Edit ✎";
        ptoggle.setAttribute("aria-pressed", "false");
      }
    });
  }

  function bindSettingsProfile() {
    var modal = document.getElementById("profile-delete-modal");
    var openBtn = document.getElementById("profile-open-delete");
    if (openBtn && modal) {
      openBtn.addEventListener("click", openProfileDeleteModal);
    }
    if (modal) {
      modal.querySelectorAll("[data-profile-delete-close],[data-profile-delete-backdrop],[data-profile-delete-cancel]").forEach(function (el) {
        el.addEventListener("click", closeProfileDeleteModal);
      });
    }
    var delForm = document.getElementById("profile-delete-form");
    if (delForm) {
      delForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var pw = document.getElementById("profile-delete-password");
        var err = document.getElementById("profile-delete-pass-err");
        var v = pw ? pw.value.trim() : "";
        if (!v) {
          if (err) {
            err.textContent = "Enter your password to confirm account deletion.";
            err.hidden = false;
          }
          if (pw) pw.setAttribute("aria-invalid", "true");
          return;
        }
        if (err) err.hidden = true;
        if (pw) pw.removeAttribute("aria-invalid");
        closeProfileDeleteModal();
        window.location.replace("index.html#/login");
      });
    }
    if (!window.__wbProfileDeleteEscBound) {
      window.__wbProfileDeleteEscBound = true;
      window.addEventListener("keydown", function (e) {
        if (e.key !== "Escape") return;
        var m = document.getElementById("profile-delete-modal");
        if (m && !m.hidden) closeProfileDeleteModal(e);
      });
    }

    bindEditableFieldsIn(document.querySelector('[data-st-page="/settings/profile"]'));
    bindPhoneFieldIn(
      document.querySelector('[data-st-page="/settings/profile"] [data-profile-phone]'),
      "profile-phone-display",
      "profile-phone-country",
      "profile-phone-national",
    );
  }

  function bindCompanyInformation() {
    bindEditableFieldsIn(document.querySelector('[data-st-page="/settings/company"]'));
    bindPhoneFieldIn(
      document.querySelector('[data-st-page="/settings/company"] [data-profile-phone]'),
      "company-phone-display",
      "company-phone-country",
      "company-phone-national",
    );
    var uploadBtn = document.getElementById("company-logo-upload-btn");
    var fileInput = document.getElementById("company-logo-file");
    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener("click", function () {
        fileInput.click();
      });
    }
  }

  function bindDataManagementSync() {
    var root = document.querySelector('[data-st-page="/settings/data"]');
    if (!root) return;

    var toggleLabels = {
      slack: { on: "Slack sync on", off: "Slack sync off" },
      google: { on: "Google Calendar sync on", off: "Google Calendar sync off" },
    };

    root.querySelectorAll("[data-data-integration-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var key = btn.getAttribute("data-data-integration-toggle") || "";
        var on = btn.classList.toggle("wb-toggle--on");
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        var L = toggleLabels[key];
        if (L) btn.setAttribute("aria-label", on ? L.on : L.off);
      });
    });

    var drop = root.querySelector("[data-data-drop-zone]");
    var fileInput = root.querySelector("[data-data-file-input]");
    var browse = root.querySelector("[data-data-drop-browse]");
    var nameEl = root.querySelector("[data-data-file-name]");

    function setUploadedFileName(name) {
      if (!name || !nameEl) return;
      nameEl.textContent = name;
    }

    if (browse && fileInput) {
      browse.addEventListener("click", function () {
        fileInput.click();
      });
    }

    if (fileInput) {
      fileInput.addEventListener("change", function () {
        var f = fileInput.files && fileInput.files[0];
        if (f && f.name) setUploadedFileName(f.name);
        fileInput.value = "";
      });
    }

    if (drop) {
      var dragDepth = 0;
      drop.addEventListener("dragenter", function (e) {
        e.preventDefault();
        dragDepth++;
        drop.classList.add("wb-data-drop--active");
      });
      drop.addEventListener("dragleave", function (e) {
        e.preventDefault();
        dragDepth--;
        if (dragDepth <= 0) {
          dragDepth = 0;
          drop.classList.remove("wb-data-drop--active");
        }
      });
      drop.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      drop.addEventListener("drop", function (e) {
        e.preventDefault();
        dragDepth = 0;
        drop.classList.remove("wb-data-drop--active");
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f && f.name) setUploadedFileName(f.name);
      });
    }
  }

  function bindSettingsTriggerNotifications() {
    var TRIGGER_RULES_KEY = "workbench_hr_trigger_notification_rules";
    var DEFAULT_TRIGGER_RULES = [
      {
        id: "tn-seed-1",
        title: "Certification expiring — kitchen leads",
        taskKey: "compliance",
        taskLabel: "Compliance / training renewal",
        assigneeId: "e2",
        assigneeName: "Adam Benson",
        channels: { push: true, email: true, googleCalendar: false },
        updatedAt: "Apr 20, 2026",
      },
      {
        id: "tn-seed-2",
        title: "New hire packet incomplete",
        taskKey: "onboarding",
        taskLabel: "Onboarding documents",
        assigneeId: "e3",
        assigneeName: "Pauline Thomas",
        channels: { push: true, email: false, googleCalendar: true },
        updatedAt: "Apr 18, 2026",
      },
    ];
    var ASSIGNEE_PHOTOS = {
      e1: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face",
      e2: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face",
      e3: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face",
      e4: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face",
      e5: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face",
    };
    var DEFAULT_ASSIGNEE_PHOTO =
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&crop=face";
    var HR_TASK_LABELS = {
      review: "Performance review deadline",
      compliance: "Compliance / training renewal",
      onboarding: "Onboarding documents",
      timeoff: "Time off & scheduling",
      payroll: "Payroll & approvals",
      policy: "Policy acknowledgment",
    };

    var root = document.querySelector('[data-st-page="/settings/trigger-notifications"]');
    if (!root) return;

    var countEl = root.querySelector("[data-st-trigger-count]");
    var emptyEl = root.querySelector("[data-st-trigger-empty]");
    var listEl = root.querySelector("[data-st-trigger-list]");
    var welcomeEl = root.querySelector("[data-st-trigger-welcome]");
    var titleInput = root.querySelector("[data-st-trigger-title]");
    var taskSelect = root.querySelector("[data-st-trigger-task]");
    var assigneeSelect = root.querySelector("[data-st-trigger-assignee]");
    var chPush = root.querySelector("[data-st-trigger-ch-push]");
    var chEmail = root.querySelector("[data-st-trigger-ch-email]");
    var chCal = root.querySelector("[data-st-trigger-ch-cal]");
    var errorEl = root.querySelector("[data-st-trigger-error]");
    var saveBtn = root.querySelector("[data-st-trigger-save]");

    function parseTriggerRules(raw) {
      if (!Array.isArray(raw)) return [];
      return raw.filter(function (r) {
        if (!r || typeof r !== "object") return false;
        var ch = r.channels;
        return (
          typeof r.id === "string" &&
          typeof r.title === "string" &&
          typeof r.taskKey === "string" &&
          typeof r.taskLabel === "string" &&
          typeof r.assigneeId === "string" &&
          typeof r.assigneeName === "string" &&
          typeof r.updatedAt === "string" &&
          ch &&
          typeof ch === "object" &&
          typeof ch.push === "boolean" &&
          typeof ch.email === "boolean" &&
          typeof ch.googleCalendar === "boolean"
        );
      });
    }

    function getTriggerRules() {
      try {
        var raw = sessionStorage.getItem(TRIGGER_RULES_KEY);
        if (raw == null) {
          return JSON.parse(JSON.stringify(DEFAULT_TRIGGER_RULES));
        }
        var parsed = JSON.parse(raw);
        return parseTriggerRules(parsed);
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_TRIGGER_RULES));
      }
    }

    function saveTriggerRules(rules) {
      try {
        sessionStorage.setItem(TRIGGER_RULES_KEY, JSON.stringify(rules));
      } catch (e2) {
        /* private mode */
      }
    }

    function photoForAssigneeId(id) {
      return ASSIGNEE_PHOTOS[id] || DEFAULT_ASSIGNEE_PHOTO;
    }

    function channelSummary(ch) {
      var out = [];
      if (ch.push) out.push("Push");
      if (ch.email) out.push("Email");
      if (ch.googleCalendar) out.push("Calendar");
      return out.length ? out : ["None"];
    }

    function formatTriggerUpdated() {
      return new Date().toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    function createTriggerRuleId() {
      return "tn-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function setFormError(msg) {
      if (!errorEl) return;
      if (msg) {
        errorEl.textContent = msg;
        errorEl.removeAttribute("hidden");
      } else {
        errorEl.textContent = "";
        errorEl.setAttribute("hidden", "");
      }
    }

    function renderTriggerRules() {
      var rules = getTriggerRules();
      if (countEl) countEl.textContent = String(rules.length);
      if (!listEl || !emptyEl) return;
      while (listEl.firstChild) listEl.removeChild(listEl.firstChild);
      if (rules.length === 0) {
        emptyEl.removeAttribute("hidden");
        listEl.setAttribute("hidden", "");
      } else {
        emptyEl.setAttribute("hidden", "");
        listEl.removeAttribute("hidden");
        rules.forEach(function (r) {
          var li = document.createElement("li");
          li.className = "wb-settings-triggers__card";
          var img = document.createElement("img");
          img.className = "wb-settings-triggers__avatar";
          img.src = photoForAssigneeId(r.assigneeId);
          img.alt = "";
          img.width = 48;
          img.height = 48;
          img.decoding = "async";
          var main = document.createElement("div");
          main.className = "wb-settings-triggers__card-main";
          var t = document.createElement("p");
          t.className = "wb-settings-triggers__card-title";
          t.textContent = r.title;
          var m1 = document.createElement("p");
          m1.className = "wb-settings-triggers__card-meta";
          m1.appendChild(document.createElement("span")).className = "wb-settings-triggers__meta-label";
          m1.lastChild.textContent = "Task";
          m1.appendChild(document.createTextNode(" " + r.taskLabel));
          var m2 = document.createElement("p");
          m2.className = "wb-settings-triggers__card-meta wb-settings-triggers__card-meta--assignee";
          var sl = document.createElement("span");
          sl.className = "wb-settings-triggers__meta-label";
          sl.textContent = "Assignee";
          var an = document.createElement("span");
          an.className = "wb-settings-triggers__assignee-name";
          an.textContent = r.assigneeName;
          m2.appendChild(sl);
          m2.appendChild(document.createTextNode(" "));
          m2.appendChild(an);
          var m3 = document.createElement("p");
          m3.className = "wb-settings-triggers__card-meta";
          m3.appendChild(document.createElement("span")).className = "wb-settings-triggers__meta-label";
          m3.lastChild.textContent = "Deliver via";
          m3.appendChild(document.createTextNode(" " + channelSummary(r.channels).join(" · ")));
          var mu = document.createElement("p");
          mu.className = "wb-settings-triggers__card-updated";
          mu.textContent = "Updated " + r.updatedAt;
          main.appendChild(t);
          main.appendChild(m1);
          main.appendChild(m2);
          main.appendChild(m3);
          main.appendChild(mu);
          var del = document.createElement("button");
          del.type = "button";
          del.className = "wb-btn wb-btn--danger-outline wb-settings-triggers__delete";
          del.setAttribute("data-st-trigger-delete", r.id);
          del.textContent = "Delete";
          li.appendChild(img);
          li.appendChild(main);
          li.appendChild(del);
          listEl.appendChild(li);
        });
      }
    }

    function getSettingsTriggersPathname() {
      var raw = window.location.hash.replace(/^#/, "");
      if (raw.charAt(0) === "!") raw = raw.slice(1);
      if (!raw || raw.charAt(0) !== "/") return "";
      try {
        var u = new URL(raw, "http://static.local");
        return u.pathname || "";
      } catch (e3) {
        return "";
      }
    }

    function consumeTriggerWelcomeQuery() {
      var raw = window.location.hash.replace(/^#/, "");
      if (raw.charAt(0) === "!") raw = raw.slice(1);
      try {
        var u = new URL(raw, "http://static.local");
        if (u.pathname !== "/settings/trigger-notifications") return;
        var params = new URLSearchParams(u.search.replace(/^\?/, ""));
        if (params.get("welcome") !== "1") return;
        if (welcomeEl) welcomeEl.removeAttribute("hidden");
        var base = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", base + "#/settings/trigger-notifications");
      } catch (e4) {
        /* ignore */
      }
    }

    function refreshTriggersIfOnPage() {
      if (getSettingsTriggersPathname() !== "/settings/trigger-notifications") return;
      consumeTriggerWelcomeQuery();
      renderTriggerRules();
    }

    if (welcomeEl) {
      var dismiss = root.querySelector("[data-st-trigger-welcome-dismiss]");
      if (dismiss) {
        dismiss.addEventListener("click", function () {
          welcomeEl.setAttribute("hidden", "");
        });
      }
    }

    if (listEl) {
      listEl.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest && e.target.closest("[data-st-trigger-delete]");
        if (!btn) return;
        var id = btn.getAttribute("data-st-trigger-delete");
        if (!id) return;
        var rules = getTriggerRules();
        var row = rules.find(function (x) {
          return x.id === id;
        });
        if (!row) return;
        if (!window.confirm('Remove notification "' + row.title + '"?')) return;
        saveTriggerRules(
          rules.filter(function (x) {
            return x.id !== id;
          }),
        );
        renderTriggerRules();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        var t = titleInput ? titleInput.value.trim() : "";
        if (!t) {
          setFormError("Add a short name for this notification.");
          return;
        }
        var pushOn = chPush && chPush.checked;
        var emailOn = chEmail && chEmail.checked;
        var calOn = chCal && chCal.checked;
        if (!pushOn && !emailOn && !calOn) {
          setFormError("Choose at least one delivery option: push, email, or Google Calendar.");
          return;
        }
        setFormError(null);
        var tk = taskSelect ? taskSelect.value : "review";
        var taskLabel = HR_TASK_LABELS[tk] || tk;
        var aid = assigneeSelect ? assigneeSelect.value : "e1";
        var opt = assigneeSelect && assigneeSelect.selectedOptions && assigneeSelect.selectedOptions[0];
        var assigneeName = opt ? opt.textContent.trim() : "";
        var row = {
          id: createTriggerRuleId(),
          title: t,
          taskKey: tk,
          taskLabel: taskLabel,
          assigneeId: aid,
          assigneeName: assigneeName,
          channels: { push: pushOn, email: emailOn, googleCalendar: calOn },
          updatedAt: formatTriggerUpdated(),
        };
        saveTriggerRules([row].concat(getTriggerRules()));
        renderTriggerRules();
        if (titleInput) titleInput.value = "";
        if (chPush) chPush.checked = true;
        if (chEmail) chEmail.checked = true;
        if (chCal) chCal.checked = false;
      });
    }

    window.addEventListener("hashchange", refreshTriggersIfOnPage);
    refreshTriggersIfOnPage();
  }

  function bindManageEmployees() {
    var root = document.querySelector('[data-st-page="/settings/employees"]');
    if (!root) return;

    var INITIAL_ROWS = [
      {
        id: "1",
        name: "Jessica Christie",
        email: "j.christie@eatunique.com",
        role: "Team Member",
        department: "Front of House",
        status: "Active",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face",
      },
      {
        id: "2",
        name: "Marcus Lee",
        email: "m.lee@eatunique.com",
        role: "Supervisor",
        department: "Kitchen",
        status: "Active",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face",
      },
      {
        id: "3",
        name: "Priya Patel",
        email: "p.patel@eatunique.com",
        role: "Team Member",
        department: "Operations",
        status: "Invited",
        photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face",
      },
    ];

    var rows = JSON.parse(JSON.stringify(INITIAL_ROWS));
    var NEW_EMPLOYEE_PHOTO =
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&fit=crop&crop=face";

    var queryInput = root.querySelector("[data-st-emp-query]");
    var toggleAddBtn = root.querySelector("[data-st-emp-toggle-add]");
    var addPanel = root.querySelector("[data-st-emp-add-panel]");
    var nameInput = root.querySelector("[data-st-emp-name]");
    var emailInput = root.querySelector("[data-st-emp-email]");
    var roleSelect = root.querySelector("[data-st-emp-role]");
    var deptInput = root.querySelector("[data-st-emp-dept]");
    var cancelAddBtn = root.querySelector("[data-st-emp-cancel-add]");
    var sendInviteBtn = root.querySelector("[data-st-emp-send-invite]");
    var noMatchesEl = root.querySelector("[data-st-emp-no-matches]");
    var tableWrap = root.querySelector("[data-st-emp-table-wrap]");
    var tbody = root.querySelector("[data-st-emp-tbody]");

    function createEmpId() {
      if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
      return "emp-" + Date.now() + "-" + Math.random().toString(16).slice(2);
    }

    function statusClassSuffix(status) {
      if (status === "Active") return "synced";
      if (status === "Invited") return "draft";
      return "indexed";
    }

    function getFiltered() {
      var q = (queryInput && queryInput.value ? queryInput.value : "").trim().toLowerCase();
      if (!q) return rows.slice();
      return rows.filter(function (r) {
        return (
          r.name.toLowerCase().indexOf(q) !== -1 ||
          r.email.toLowerCase().indexOf(q) !== -1 ||
          r.department.toLowerCase().indexOf(q) !== -1 ||
          r.role.toLowerCase().indexOf(q) !== -1
        );
      });
    }

    function setAddPanelOpen(open) {
      if (!addPanel || !toggleAddBtn) return;
      if (open) {
        addPanel.removeAttribute("hidden");
        toggleAddBtn.setAttribute("aria-expanded", "true");
      } else {
        addPanel.setAttribute("hidden", "");
        toggleAddBtn.setAttribute("aria-expanded", "false");
      }
    }

    function renderEmployeeTable() {
      if (!tbody || !noMatchesEl || !tableWrap) return;
      var filtered = getFiltered();
      if (filtered.length === 0) {
        noMatchesEl.removeAttribute("hidden");
        tableWrap.setAttribute("hidden", "");
        return;
      }
      noMatchesEl.setAttribute("hidden", "");
      tableWrap.removeAttribute("hidden");
      while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
      filtered.forEach(function (r) {
        var tr = document.createElement("tr");
        var tdName = document.createElement("td");
        tdName.className = "wb-docs-table__cell-name";
        var nameInner = document.createElement("div");
        nameInner.className = "wb-docs-table__name-inner wb-employees-page__name-inner";
        var img = document.createElement("img");
        img.className = "wb-employees-page__avatar";
        img.src = r.photo;
        img.width = 36;
        img.height = 36;
        img.alt = "";
        var nameStack = document.createElement("span");
        nameStack.className = "wb-docs-table__name wb-employees-page__name-stack";
        var nameText = document.createElement("span");
        nameText.className = "wb-employees-page__name-text";
        nameText.textContent = r.name;
        var emailSpan = document.createElement("span");
        emailSpan.className = "wb-employees-page__email";
        emailSpan.textContent = r.email;
        nameStack.appendChild(nameText);
        nameStack.appendChild(emailSpan);
        nameInner.appendChild(img);
        nameInner.appendChild(nameStack);
        tdName.appendChild(nameInner);

        var tdRole = document.createElement("td");
        tdRole.textContent = r.role;

        var tdDept = document.createElement("td");
        tdDept.textContent = r.department;

        var tdStatus = document.createElement("td");
        var statusSpan = document.createElement("span");
        statusSpan.className =
          "wb-docs-table__status wb-employees-page__status--" + statusClassSuffix(r.status);
        statusSpan.textContent = r.status;
        tdStatus.appendChild(statusSpan);

        var tdActions = document.createElement("td");
        tdActions.className = "wb-docs-table__actions";
        var removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "wb-docs-table__action wb-docs-table__action--danger";
        removeBtn.setAttribute("data-st-emp-remove", r.id);
        removeBtn.textContent = "Remove";

        tdActions.appendChild(removeBtn);
        tr.appendChild(tdName);
        tr.appendChild(tdRole);
        tr.appendChild(tdDept);
        tr.appendChild(tdStatus);
        tr.appendChild(tdActions);
        tbody.appendChild(tr);
      });
    }

    if (toggleAddBtn && addPanel) {
      toggleAddBtn.addEventListener("click", function () {
        var open = addPanel.hasAttribute("hidden");
        setAddPanelOpen(open);
      });
    }

    if (cancelAddBtn) {
      cancelAddBtn.addEventListener("click", function () {
        setAddPanelOpen(false);
      });
    }

    if (sendInviteBtn) {
      sendInviteBtn.addEventListener("click", function () {
        var name = nameInput ? nameInput.value.trim() : "";
        var email = emailInput ? emailInput.value.trim() : "";
        if (!name || !email) return;
        var role = roleSelect && roleSelect.value ? roleSelect.value : "Team Member";
        var dept = deptInput ? deptInput.value.trim() : "";
        rows.unshift({
          id: createEmpId(),
          name: name,
          email: email,
          role: role,
          department: dept || "General",
          status: "Invited",
          photo: NEW_EMPLOYEE_PHOTO,
        });
        if (nameInput) nameInput.value = "";
        if (emailInput) emailInput.value = "";
        if (roleSelect) roleSelect.value = "Team Member";
        if (deptInput) deptInput.value = "";
        setAddPanelOpen(false);
        renderEmployeeTable();
      });
    }

    if (tbody) {
      tbody.addEventListener("click", function (e) {
        var btn = e.target && e.target.closest && e.target.closest("[data-st-emp-remove]");
        if (!btn) return;
        var id = btn.getAttribute("data-st-emp-remove");
        if (!id) return;
        var row = rows.find(function (x) {
          return x.id === id;
        });
        if (!row) return;
        if (!window.confirm("Remove " + row.name + " from the roster?")) return;
        rows = rows.filter(function (x) {
          return x.id !== id;
        });
        renderEmployeeTable();
      });
    }

    if (queryInput) {
      queryInput.addEventListener("input", function () {
        renderEmployeeTable();
      });
    }

    renderEmployeeTable();
  }

  function bindSettingsSecurity() {
    var root = document.querySelector('[data-st-page="/settings/security"]');
    if (!root) return;

    var cur = root.querySelector("[data-st-sec-current]");
    var next = root.querySelector("[data-st-sec-new]");
    var conf = root.querySelector("[data-st-sec-confirm]");
    var pwMsg = root.querySelector("[data-st-sec-password-msg]");
    var updateBtn = root.querySelector("[data-st-sec-update-password]");
    var twoFa = root.querySelector("[data-st-sec-2fa]");
    var signout = root.querySelector("[data-st-sec-signout-all]");
    var sessMsg = root.querySelector("[data-st-sec-sessions-msg]");

    function setPwFeedback(text, tone) {
      if (!pwMsg) return;
      if (!text) {
        pwMsg.textContent = "";
        pwMsg.setAttribute("hidden", "");
        pwMsg.className = "wb-security-page__feedback";
        return;
      }
      pwMsg.textContent = text;
      pwMsg.removeAttribute("hidden");
      pwMsg.className = "wb-security-page__feedback wb-security-page__feedback--" + (tone || "error");
    }

    if (updateBtn) {
      updateBtn.addEventListener("click", function () {
        var c = cur && cur.value.trim();
        var n = next && next.value.trim();
        var f = conf && conf.value.trim();
        if (!c || !n || !f) {
          setPwFeedback("Enter your current password, a new password, and confirmation.", "error");
          return;
        }
        if (n !== f) {
          setPwFeedback("New password and confirmation do not match.", "error");
          return;
        }
        setPwFeedback("Preview only — your password was not changed.", "success");
        if (cur) cur.value = "";
        if (next) next.value = "";
        if (conf) conf.value = "";
      });
    }

    [cur, next, conf].forEach(function (el) {
      if (!el) return;
      el.addEventListener("input", function () {
        setPwFeedback("", "");
      });
    });

    if (twoFa) {
      twoFa.addEventListener("click", function () {
        var on = twoFa.classList.toggle("wb-toggle--on");
        twoFa.setAttribute("aria-pressed", on ? "true" : "false");
        twoFa.setAttribute("aria-label", on ? "Two-factor authentication on" : "Two-factor authentication off");
      });
    }

    if (signout && sessMsg) {
      signout.addEventListener("click", function () {
        if (!window.confirm("Sign out all other sessions? You will stay signed in on this device.")) return;
        sessMsg.textContent = "Preview only — sessions were not ended.";
        sessMsg.removeAttribute("hidden");
      });
    }
  }

  function bindSettingsBilling() {
    var root = document.querySelector('[data-st-page="/settings/billing"]');
    if (!root) return;

    var mainEl = root.querySelector("[data-st-billing-main]");
    var subEl = root.querySelector("[data-st-billing-sub]");
    var feedback = root.querySelector("[data-st-billing-feedback]");
    var PRICES = {
      monthly: { main: "$249", sub: "per month · plus applicable tax" },
      annual: { main: "$2,388", sub: "per year (about $199/mo) · plus applicable tax" },
    };

    function showFeedback(text) {
      if (!feedback) return;
      feedback.textContent = text;
      feedback.removeAttribute("hidden");
    }

    function setCycle(cycle) {
      root.querySelectorAll("[data-st-billing-cycle]").forEach(function (btn) {
        var on = btn.getAttribute("data-st-billing-cycle") === cycle;
        btn.classList.toggle("wb-billing-page__cycle-btn--on", on);
      });
      var p = PRICES[cycle] || PRICES.monthly;
      if (mainEl) mainEl.textContent = p.main;
      if (subEl) subEl.textContent = p.sub;
    }

    root.querySelectorAll("[data-st-billing-cycle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cycle = btn.getAttribute("data-st-billing-cycle");
        if (!cycle) return;
        setCycle(cycle);
      });
    });

    var changePlan = root.querySelector("[data-st-billing-change-plan]");
    if (changePlan) {
      changePlan.addEventListener("click", function () {
        showFeedback("Preview only — plan changes are not submitted.");
      });
    }

    var upd = root.querySelector("[data-st-billing-update-pay]");
    if (upd) {
      upd.addEventListener("click", function () {
        showFeedback("Preview only — payment details were not updated.");
      });
    }

    var addB = root.querySelector("[data-st-billing-add-backup]");
    if (addB) {
      addB.addEventListener("click", function () {
        showFeedback("Preview only — backup cards are not saved here.");
      });
    }

    root.querySelectorAll("[data-st-billing-download]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        showFeedback("Preview only — no file was downloaded.");
      });
    });
  }

  function bindSettingsHelp() {
    var root = document.querySelector('[data-st-page="/settings/help"]');
    if (!root) return;
    var feedback = root.querySelector("[data-st-help-feedback]");
    root.querySelectorAll("[data-st-help-msg]").forEach(function (el) {
      el.addEventListener("click", function () {
        var msg = el.getAttribute("data-st-help-msg");
        if (!msg || !feedback) return;
        feedback.textContent = msg;
        feedback.removeAttribute("hidden");
      });
    });
  }

  function parseEmpJoined(attr) {
    var t = Date.parse(attr || "");
    return isNaN(t) ? 0 : t;
  }

  function getEmployeePortalSortModeFromDom(root) {
    var pill = root.querySelector("[data-emp-sort].wb-hiring__sort-pill--active");
    var m = pill ? pill.getAttribute("data-emp-sort") : "";
    return m === "date" ? "date" : "name";
  }

  function applyEmployeePortalSort(root, sortMode) {
    if (!root) return;
    var byName = sortMode !== "date";
    function cmp(a, b) {
      var an = (a.getAttribute("data-emp-name") || "").toLowerCase();
      var bn = (b.getAttribute("data-emp-name") || "").toLowerCase();
      if (byName) {
        if (an < bn) return -1;
        if (an > bn) return 1;
        return 0;
      }
      var ad = parseEmpJoined(a.getAttribute("data-emp-joined"));
      var bd = parseEmpJoined(b.getAttribute("data-emp-joined"));
      if (ad !== bd) return bd - ad;
      if (an < bn) return -1;
      if (an > bn) return 1;
      return 0;
    }
    function collectTeamRows(ul) {
      var out = [];
      for (var i = 0; i < ul.children.length; i++) {
        var el = ul.children[i];
        if (el.tagName === "LI" && el.classList.contains("wb-emp-team__row")) out.push(el);
      }
      return out;
    }
    function collectGridCards(grid) {
      var out = [];
      for (var j = 0; j < grid.children.length; j++) {
        var c = grid.children[j];
        if (c.tagName === "ARTICLE" && c.classList.contains("wb-emp-card")) out.push(c);
      }
      return out;
    }
    root.querySelectorAll(".wb-emp-team__list").forEach(function (ul) {
      var rows = collectTeamRows(ul);
      rows.sort(cmp);
      rows.forEach(function (li) {
        ul.appendChild(li);
      });
    });
    var grid = root.querySelector(".wb-emp-grid");
    if (grid) {
      var cards = collectGridCards(grid);
      cards.sort(cmp);
      cards.forEach(function (art) {
        grid.appendChild(art);
      });
    }
  }

  function applyEmployeePortalView(mode) {
    var root = document.querySelector("[data-emp-portal]");
    if (!root) return;
    var teams = root.querySelector('[data-emp-panel="teams"]');
    var grid = root.querySelector('[data-emp-panel="grid"]');
    var isGrid = mode === "grid";
    root.setAttribute("data-emp-view", isGrid ? "grid" : "teams");
    if (teams) teams.hidden = isGrid;
    if (grid) grid.hidden = !isGrid;
    root.querySelectorAll("[data-emp-view-toggle]").forEach(function (btn) {
      var on = (btn.getAttribute("data-emp-view-toggle") || "") === mode;
      btn.classList.toggle("wb-hiring__view-btn--active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    applyEmployeePortalSort(root, getEmployeePortalSortModeFromDom(root));
  }

  function syncEmployeePortalView() {
    if (!isEmployeesHtmlDoc()) return;
    var p = parseHash();
    if (p.kind !== "path" || p.pathname !== "/employees") return;
    var q = new URLSearchParams((p.search || "").replace(/^\?/, ""));
    applyEmployeePortalView(q.get("view") === "grid" ? "grid" : "teams");
  }

  function bindCreateDocumentTemplateStep() {
    var root = document.querySelector('[data-ws-main="/create-document/template"]');
    if (!root) return;
    var grid = root.querySelector(".wb-create-doc__grid");
    var next = document.getElementById("ws-create-template-next");
    if (!grid || !next) return;
    var buttons = grid.querySelectorAll("[data-create-category]");
    if (!buttons.length) return;
    function setSelected(id) {
      buttons.forEach(function (btn) {
        var cid = btn.getAttribute("data-create-category") || "";
        var on = cid === id;
        btn.classList.toggle("wb-create-doc__card--selected", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
      next.setAttribute(
        "href",
        "create-document.html#/create-document/method?category=" + encodeURIComponent(id)
      );
    }
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-create-category");
        if (!id) return;
        setSelected(id);
      });
    });
    var initial = grid.querySelector(".wb-create-doc__card--selected[data-create-category]");
    setSelected((initial && initial.getAttribute("data-create-category")) || "company");
  }

  function bindEmployeePortalView() {
    var root = document.querySelector("[data-emp-portal]");
    if (!root) return;
    applyEmployeePortalSort(root, getEmployeePortalSortModeFromDom(root));
    root.querySelectorAll("[data-emp-sort]").forEach(function (pill) {
      pill.addEventListener("click", function () {
        var mode = pill.getAttribute("data-emp-sort") || "name";
        root.querySelectorAll("[data-emp-sort]").forEach(function (p) {
          var on = p === pill;
          p.classList.toggle("wb-hiring__sort-pill--active", on);
          p.setAttribute("aria-pressed", on ? "true" : "false");
        });
        applyEmployeePortalSort(root, mode === "date" ? "date" : "name");
      });
    });
    root.querySelectorAll("[data-emp-view-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-emp-view-toggle") || "teams";
        applyEmployeePortalView(mode);
        var base = window.location.pathname + window.location.search;
        window.history.replaceState(
          null,
          "",
          base + (mode === "grid" ? "#/employees?view=grid" : "#/employees")
        );
      });
    });
  }

  function init() {
    bindMarketingNav();
    bindDemoForm();
    bindContactForm();
    bindAuthForms();
    bindForgotForm();
    bindGoals();
    bindNotifyToggle();
    bindSettingsProfile();
    bindCompanyInformation();
    bindDataManagementSync();
    bindSettingsTriggerNotifications();
    bindManageEmployees();
    bindSettingsSecurity();
    bindSettingsBilling();
    bindSettingsHelp();
    bindCreateDocumentTemplateStep();
    bindEmployeePortalView();

    window.addEventListener("hashchange", function () {
      closeProfileDeleteModal();
      applyRoute();
      if (parseHash().kind === "marketing") setTimeout(onScrollMarketing, 400);
    });
    window.addEventListener("scroll", onScrollMarketing, { passive: true });
    window.addEventListener("resize", onScrollMarketing);

    applyRoute();
    if (parseHash().kind === "marketing") {
      var h = window.location.hash.replace(/^#/, "");
      var hasSection = MARKETING_SECTIONS.indexOf(h) !== -1;
      if (!hasSection || h === "home" || h === "customers") onScrollMarketing();
    }

    var yEl = document.getElementById("footer-year");
    if (yEl) yEl.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
