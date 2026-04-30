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

  var TEMPLATE_BROWSE_LIST = {
    company: [
      { file: "Standard_Full_Time_Offer_Letter_US.pdf", title: "Standard full-time offer letter" },
      { file: "Mutual_Nondisclosure_Agreement_2026.pdf", title: "Mutual NDA (standard)" },
      { file: "Contractor_Services_Agreement.pdf", title: "Contractor services agreement" },
      { file: "Employment_Amendment_Template.docx", title: "Employment amendment" },
      { file: "Board_Resolution_Template.pdf", title: "Board resolution (HR matters)" },
      { file: "Vendor_MSA_Standard.pdf", title: "Vendor master services agreement" },
    ],
    performance: [
      { file: "Annual_Performance_Review_Manager_Worksheet.pdf", title: "Annual performance review" },
      { file: "PIP_Checklist_draft.docx", title: "Performance improvement plan" },
      { file: "Goals_Q4_Worksheet.docx", title: "Goals & OKRs worksheet" },
      { file: "Feedback_360_Summary.docx", title: "360° feedback summary" },
      { file: "Mid_Year_Check_In.docx", title: "Mid-year check-in" },
      { file: "Calibration_Notes_Template.docx", title: "Calibration session notes" },
    ],
    payroll: [
      { file: "Salary_Bands_by_Level_2026.pdf", title: "Salary bands by level" },
      { file: "Bonus_Letter_Template.docx", title: "Bonus notification letter" },
      { file: "Benefits_Summary_2026.pdf", title: "Benefits enrollment summary" },
      { file: "Equity_Offer_Summary.pdf", title: "Equity grant summary" },
      { file: "Commission_Plan_Overview.pdf", title: "Commission plan overview" },
      { file: "PTO_Policy_Summary.pdf", title: "PTO & leave policy summary" },
    ],
    legal: [
      { file: "Employee_Handbook_Master_2026.pdf", title: "Employee handbook (excerpt)" },
      { file: "Remote_Work_Policy_v3.pdf", title: "Remote work policy" },
      { file: "Code_of_Conduct_2026.pdf", title: "Code of conduct" },
      { file: "Anti_Harassment_Policy.pdf", title: "Anti-harassment policy" },
      { file: "Data_Retention_Policy.pdf", title: "Data retention policy" },
      { file: "Whistleblower_Policy.pdf", title: "Whistleblower policy" },
    ],
    hiring: [
      { file: "Job_Posting_Customer_Success_Manager.pdf", title: "Job posting — CS Manager" },
      { file: "Interview_Scorecard_Template.docx", title: "Interview scorecard" },
      { file: "Offer_Checklist_HR.docx", title: "Pre-offer checklist" },
      { file: "Phone_Screen_Guide.docx", title: "Phone screen guide" },
      { file: "Reference_Check_Form.docx", title: "Reference check form" },
      { file: "Rejection_Letter_Template.docx", title: "Candidate rejection letter" },
    ],
    employment: [
      { file: "Internal_Promotion_Notification_Letter.pdf", title: "Internal promotion letter" },
      { file: "Transfer_Notification_Template.docx", title: "Transfer notification" },
      { file: "Separation_Checklist.docx", title: "Separation checklist" },
      { file: "Leave_Request_Form.docx", title: "Leave of absence request" },
      { file: "Salary_Change_Notice.pdf", title: "Salary change notice" },
      { file: "Remote_Work_Agreement_Addendum.pdf", title: "Remote work agreement addendum" },
    ],
  };

  var WB_MANUAL_REVIEW_STORAGE_KEY = "wbManualReviewDraft";
  var WB_DOCS_PENDING_ROW_KEY = "wbDocsPendingLibraryRow";

  var VA_SAMPLE_PDF_SRC = "assets/sample.pdf";

  var APPLICANT_SAMPLE_DOCS = {
    olivia: [
      { file: "Olivia_Thompson_Resume.pdf", kind: "resume", typeLabel: "Resume", date: "01/18/2026" },
      { file: "Thompson_CoverLetter_FOH.pdf", kind: "cover", typeLabel: "Cover Letter", date: "01/17/2026" },
      { file: "FOH_Portfolio_OThompson.pdf", kind: "portfolio", typeLabel: "Portfolio", date: "01/16/2026" },
      { file: "ServSafe_Food_Handler_2025.pdf", kind: "other", typeLabel: "Certification", date: "05/02/2025" },
      { file: "Professional_References_Olivia_T.pdf", kind: "other", typeLabel: "References", date: "01/15/2026" },
    ],
    marcus: [
      { file: "Marcus_Chen_Resume.pdf", kind: "resume", typeLabel: "Resume", date: "02/02/2026" },
      { file: "Chen_Cover_Letter_Hospitality.pdf", kind: "cover", typeLabel: "Cover Letter", date: "02/01/2026" },
      { file: "Chen_Work_Samples_Menu_Event.pdf", kind: "portfolio", typeLabel: "Portfolio", date: "01/30/2026" },
      { file: "Schedule_Availability_Winter2026.pdf", kind: "other", typeLabel: "Availability", date: "01/28/2026" },
    ],
    priya: [
      { file: "Priya_Nair_Resume.pdf", kind: "resume", typeLabel: "Resume", date: "01/22/2026" },
      { file: "Nair_CoverLetter_Restaurant.pdf", kind: "cover", typeLabel: "Cover Letter", date: "01/21/2026" },
      { file: "Priya_Nair_Portfolio.pdf", kind: "portfolio", typeLabel: "Portfolio", date: "01/20/2026" },
      { file: "TIPS_Certification_2024.pdf", kind: "other", typeLabel: "Certification", date: "08/10/2024" },
      { file: "Prior_Employer_LOR.pdf", kind: "other", typeLabel: "References", date: "01/19/2026" },
    ],
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
    "/applicants": "Applicants — Workbench HR",
    "/view-applicant": "Applicant profile — Workbench HR",
    "/documents": "Documents — Workbench HR",
    "/sign-documents": "Sign documents — Workbench HR",
    "/employees": "Employee Portal — Workbench HR",
    "/employees/add": "Add employee — Workbench HR",
    "/employees/teams/new": "Create team — Workbench HR",
    "/create-document/category": "Document category — Workbench HR",
    "/document-category": "Document category — Workbench HR",
    "/document-templates": "Choose template — Workbench HR",
    "/document-method": "Document method — Workbench HR",
    "/document-manual-fill": "Fill document — Workbench HR",
    "/generate-ai": "AI document draft — Workbench HR",
    "/document-review": "Review document — Workbench HR",
    "/create-document/template": "Document category — Workbench HR",
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

  function isSignDocumentsHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)sign-documents\.html$/i.test(path);
  }

  function isSignDocumentsPath(pathname) {
    return pathname === "/sign-documents";
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

  function isApplicantsHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)applicants\.html$/i.test(path);
  }

  function isApplicantsPath(pathname) {
    return pathname === "/applicants";
  }

  function isViewApplicantHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)viewapplicant\.html$/i.test(path);
  }

  function isViewApplicantPath(pathname) {
    return pathname === "/view-applicant";
  }

  function isCreateDocumentHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)create-document\.html$/i.test(path);
  }

  function isCreateDocumentTemplateHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)create-document-template\.html$/i.test(path);
  }

  function isDocumentCategoryHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)document-category\.html$/i.test(path);
  }

  function isDocumentTemplatesHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)document-templates\.html$/i.test(path);
  }

  function isDocumentMethodHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)document-method\.html$/i.test(path);
  }

  function isDocumentManualFillHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)document-manual-fill\.html$/i.test(path);
  }

  function isGenerateAiHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)generate-ai\.html$/i.test(path);
  }

  function isDocumentReviewHtmlDoc() {
    var path = (window.location.pathname || "").split("?")[0];
    return /(^|\/)document-review\.html$/i.test(path);
  }

  function isCreateDocumentShellDoc() {
    return isCreateDocumentHtmlDoc() || isCreateDocumentTemplateHtmlDoc();
  }

  function createDocumentShellFileForPath(pathname) {
    if (
      pathname === "/create-document/category" ||
      pathname === "/create-document/template" ||
      pathname === "/document-category"
    ) {
      return "document-category.html";
    }
    return "create-document.html";
  }

  function createDocumentPathHref(pathname, fallbackHash) {
    if (
      pathname === "/create-document/category" ||
      pathname === "/create-document/template" ||
      pathname === "/document-category"
    ) {
      return "document-category.html";
    }
    var file = createDocumentShellFileForPath(pathname);
    var h = window.location.hash;
    if (!h || h === "#" || h === "#/") {
      return file + (fallbackHash || "");
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
    return (
      pathname === "/employees" ||
      pathname === "/employees/add" ||
      pathname === "/employees/teams/new"
    );
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
    if (isViewApplicantHtmlDoc()) {
      return "/view-applicant";
    }
    if (isApplicantsHtmlDoc()) {
      return "/applicants";
    }
    if (isHiringHtmlDoc()) {
      return "/hiring";
    }
    if (isDocumentTemplatesHtmlDoc()) {
      return "/document-templates";
    }
    if (isDocumentMethodHtmlDoc()) {
      return "/document-method";
    }
    if (isDocumentManualFillHtmlDoc()) {
      return "/document-manual-fill";
    }
    if (isGenerateAiHtmlDoc()) {
      return "/generate-ai";
    }
    if (isDocumentReviewHtmlDoc()) {
      return "/document-review";
    }
    if (isDocumentCategoryHtmlDoc()) {
      return "/document-category";
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
    if (isSignDocumentsHtmlDoc()) {
      return "/sign-documents";
    }
    if (isDocumentsHtmlDoc()) {
      return "/documents";
    }
    if (isEmployeesHtmlDoc()) {
      if (pathname === "/employees/add") return "/employees/add";
      if (pathname === "/employees/teams/new") return "/employees/teams/new";
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
          "document-method.html?category=" +
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

  function fillDocumentMethodPage(search) {
    var params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
    var category = params.get("category") || "company";
    var fileRaw = params.get("file");
    var file = fileRaw && fileRaw.trim() ? fileRaw.trim() : "";
    var pages = params.get("pages");
    var catTitle = CAT_LABEL[category] || category;
    var templatesBrowseHref = "document-templates.html?category=" + encodeURIComponent(category);
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
          templatesBrowseHref +
          '">Choose a template</a> first, then pick how you want to fill it in.';
      }
    }
    var pick = document.getElementById("ws-method-pick-template");
    var pickWrap = document.querySelector(".wb-create-method__pick-wrap");
    if (pick) pick.setAttribute("href", templatesBrowseHref);
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
      if (ai) ai.setAttribute("href", templatesBrowseHref);
      if (mn) mn.setAttribute("href", templatesBrowseHref);
    } else {
      var manualParams = new URLSearchParams();
      manualParams.set("category", category);
      manualParams.set("file", file);
      if (pages) manualParams.set("pages", pages);
      if (ai) ai.setAttribute("href", "generate-ai.html?" + manualParams.toString());
      if (mn) mn.setAttribute("href", "document-manual-fill.html?" + manualParams.toString());
    }
  }

  function updateMethodPage(search) {
    fillDocumentMethodPage(search);
  }

  function bindDocumentMethodPage() {
    var root = document.querySelector("[data-doc-method-root]");
    if (!root || root.getAttribute("data-doc-method-ready") === "1") return;
    root.setAttribute("data-doc-method-ready", "1");
    var params = new URLSearchParams(window.location.search.replace(/^\?/, ""));
    var cat = params.get("category");
    if (!cat || !String(cat).trim()) {
      window.location.replace("document-category.html");
      return;
    }
    fillDocumentMethodPage(window.location.search);
    var crumb = document.querySelector("[data-doc-method-crumb-templates]");
    if (crumb) {
      crumb.setAttribute("href", "document-templates.html?category=" + encodeURIComponent(cat));
    }
    var back = root.querySelector("[data-doc-method-back]");
    if (back) {
      back.setAttribute("href", "document-templates.html?category=" + encodeURIComponent(cat));
    }
  }

  function collectManualFillPayload(root, cat, file, pages) {
    var fields = {};
    root.querySelectorAll("[data-manual-field]").forEach(function (inp) {
      var k = inp.getAttribute("data-manual-field");
      if (k) fields[k] = inp.value || "";
    });
    var bodyEl = root.querySelector("[data-manual-body]");
    return {
      version: 1,
      category: cat,
      file: file,
      pages: pages || "",
      fields: fields,
      body: bodyEl ? bodyEl.value || "" : "",
      savedAt: new Date().toISOString(),
    };
  }

  function persistManualFillDraft(payload) {
    try {
      sessionStorage.setItem(WB_MANUAL_REVIEW_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {}
  }

  function loadManualFillDraft() {
    try {
      var raw = sessionStorage.getItem(WB_MANUAL_REVIEW_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function restoreManualFillFromStorage(root, cat, file) {
    var draft = loadManualFillDraft();
    if (!draft || draft.category !== cat || draft.file !== file) return;
    if (draft.fields) {
      Object.keys(draft.fields).forEach(function (k) {
        var inp = root.querySelector('[data-manual-field="' + k + '"]');
        if (inp) inp.value = draft.fields[k];
      });
    }
    var bodyEl = root.querySelector("[data-manual-body]");
    if (bodyEl && draft.body) bodyEl.value = draft.body;
  }

  /**
   * Absolute origin for POST /documents/generate (FastAPI). Returns null when the site is
   * deployed but no public API is configured (GitHub Pages cannot reach localhost).
   */
  function getDocGenApiBase() {
    function normalize(raw) {
      if (typeof raw !== "string") return null;
      var t = raw.trim().replace(/\/$/, "");
      if (!t || t === "/") return null;
      return t;
    }

    var hNow = window.location.hostname || "";
    var isLocalDev =
      hNow === "localhost" || hNow === "127.0.0.1" || hNow === "[::1]";

    function rejectLoopbackOnDeploy(urlStr) {
      if (isLocalDev) return false;
      return /^http:\/\/(localhost|127\.0\.0\.1)\b/i.test(urlStr);
    }

    var w = normalize(typeof window.__WB_DOC_GEN_API__ === "string" ? window.__WB_DOC_GEN_API__ : "");
    if (w) {
      if (rejectLoopbackOnDeploy(w)) return null;
      if (/^https?:\/\//i.test(w)) return w;
      try {
        var uw = new URL(w, window.location.href);
        return uw.origin + uw.pathname.replace(/\/$/, "") + (uw.search || "");
      } catch (e1) {
        return null;
      }
    }

    var m = document.querySelector('meta[name="wb-doc-gen-api"]');
    var fromMeta = normalize(m ? m.getAttribute("content") || "" : "");
    if (fromMeta) {
      if (rejectLoopbackOnDeploy(fromMeta)) return null;
      if (/^https?:\/\//i.test(fromMeta)) return fromMeta;
      try {
        var u = new URL(fromMeta, window.location.href);
        return u.origin + u.pathname.replace(/\/$/, "") + (u.search || "");
      } catch (e2) {
        return null;
      }
    }

    if (isLocalDev) return "http://localhost:8000";
    return null;
  }

  function inferDocumentTypeForTemplate(category, file) {
    var f = (file || "").toLowerCase();
    if (/offer|full[_\s-]?time[_\s-]?offer/.test(f)) return "offer_letter";
    if (/separation|layoff|downsiz|riff|redundan/.test(f)) return "termination_layoff";
    if (/misconduct|disciplin/.test(f)) return "termination_misconduct";
    if (/pip|poor[_\s-]?performance|performance[_\s-]?termin/.test(f)) return "termination_poor_performance";
    if (/termin/.test(f)) return "termination_layoff";
    if ((category || "").toLowerCase() === "company" && /standard_full_time_offer/.test(f.replace(/[^a-z0-9]+/gi, "_"))) {
      return "offer_letter";
    }
    return "offer_letter";
  }

  function stringField(v) {
    if (v == null) return "";
    return String(v).slice(0, 2000);
  }

  function buildEmployeeForDocGen(docType, fields) {
    var f = fields || {};
    var out = {};
    if (docType === "offer_letter") {
      out.employee_name = stringField(f.candidateName);
      out.employee_address = stringField(f.employeeAddress);
      out.job_title = stringField(f.roleTitle);
      out.company_name = stringField(f.companyName);
      out.salary = stringField(f.compensation);
      out.pay_frequency = stringField(f.payFrequency) || "annual";
      out.employment_type = stringField(f.employmentType) || "full-time";
      out.location = stringField(f.location) || stringField(f.department);
      out.benefits = stringField(f.benefits);
      if (!out.benefits && f.internalNotes) out.benefits = stringField(f.internalNotes).slice(0, 500);
      out.offer_expiry_date = stringField(f.offerExpiry);
      out.manager_name = stringField(f.hiringManager);
      out.current_date = stringField(f.letterDate);
      return out;
    }

    out.employee_name = stringField(f.candidateName);
    out.employee_address = stringField(f.employeeAddress);
    out.job_title = stringField(f.roleTitle);
    out.department = stringField(f.department);
    out.company_name = stringField(f.companyName);
    out.manager_name = stringField(f.hiringManager);
    out.manager_title = stringField(f.managerTitle) || "HR Manager";
    out.termination_date = stringField(f.terminationDate) || stringField(f.startDate);
    out.final_pay_date = stringField(f.finalPayDate);
    out.company_property = stringField(f.companyProperty) || "keys, badge, and laptop";
    out.hr_contact = stringField(f.hrContact) || "HR";
    out.hr_email = stringField(f.hrEmail) || "hr@company.com";
    out.current_date = stringField(f.letterDate);

    if (docType === "termination_layoff") {
      out.layoff_reason = stringField(f.internalNotes) || "organizational restructuring";
      out.severance_amount = stringField(f.compensation) || "per company policy";
      out.severance_details = stringField(f.severanceDetails) || "per separation agreement";
      out.return_date = stringField(f.returnDate) || out.termination_date;
      out.benefits_end_date = stringField(f.benefitsEndDate);
    }
    if (docType === "termination_misconduct") {
      out.termination_reason = stringField(f.internalNotes) || "policy violations";
      out.misconduct_issues = stringField(f.misconductIssues) || "workplace conduct standards";
      out.counseling_dates = stringField(f.counselingDates) || "prior meetings";
      out.warning_date = stringField(f.warningDate) || "recent";
      out.misconduct_detail = stringField(f.misconductDetail) || "documented concerns";
    }
    if (docType === "termination_poor_performance") {
      out.warning_dates = stringField(f.warningDates) || "prior discussions";
      var notes = stringField(f.internalNotes);
      var lines = notes ? notes.split(/\r?\n/).filter(Boolean) : [];
      out.performance_issue_1 = stringField(f.performanceIssue1) || lines[0] || "performance expectations";
      out.performance_issue_2 = stringField(f.performanceIssue2) || lines[1] || "ongoing improvement goals";
      out.performance_issue_3 = stringField(f.performanceIssue3) || lines[2] || "feedback sessions";
      out.benefits_end_date = stringField(f.benefitsEndDate);
    }
    return out;
  }

  function fetchDocGenConfig(base) {
    return fetch(base + "/documents/config", { credentials: "omit" }).then(function (r) {
      return r.text().then(function (t) {
        var data = {};
        try {
          data = t ? JSON.parse(t) : {};
        } catch (e) {
          if (!r.ok) throw new Error(t ? t.slice(0, 240) : "Config request failed");
          return {};
        }
        if (!r.ok) {
          var msg = "Config failed";
          if (data.detail) {
            if (typeof data.detail === "string") msg = data.detail;
            else if (Array.isArray(data.detail))
              msg = data.detail
                .map(function (x) {
                  return x && x.msg ? x.msg : "";
                })
                .filter(Boolean)
                .join("; ");
          }
          throw new Error(msg);
        }
        return data;
      });
    });
  }

  /** Mirrors backend routes/documents.py when /documents/config is unreachable. */
  var DOC_GEN_FALLBACK_TYPES = [
    { value: "offer_letter", label: "Offer Letter" },
    { value: "termination_misconduct", label: "Termination — Misconduct" },
    { value: "termination_poor_performance", label: "Termination — Poor Performance" },
    { value: "termination_layoff", label: "Termination — Layoff" },
  ];

  function fillDocGenTypeSelect(aiSelect, types, inferred) {
    aiSelect.innerHTML = "";
    for (var i = 0; i < types.length; i++) {
      var dt = types[i];
      var opt = document.createElement("option");
      opt.value = dt.value;
      opt.textContent = dt.label || dt.value;
      if (dt.value === inferred) opt.selected = true;
      aiSelect.appendChild(opt);
    }
    if (!aiSelect.value && types.length) aiSelect.selectedIndex = 0;
  }

  function postDocGenGenerate(base, document_type, employee) {
    return fetch(base + "/documents/generate", {
      method: "POST",
      credentials: "omit",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document_type: document_type, employee: employee }),
    }).then(function (r) {
      return r.text().then(function (t) {
        var data = {};
        try {
          data = t ? JSON.parse(t) : {};
        } catch (e) {
          if (!r.ok) throw new Error(t ? t.slice(0, 240) : "Generation failed");
          return {};
        }
        if (!r.ok) {
          var msg = "Generation failed";
          if (data.detail) {
            if (typeof data.detail === "string") msg = data.detail;
            else if (Array.isArray(data.detail))
              msg = data.detail
                .map(function (x) {
                  return x && x.msg ? x.msg : "";
                })
                .filter(Boolean)
                .join("; ");
          }
          throw new Error(msg);
        }
        return data;
      });
    });
  }

  function bindDocumentManualFillPage() {
    var root = document.querySelector("[data-manual-fill-root]");
    if (!root || root.getAttribute("data-manual-fill-ready") === "1") return;
    root.setAttribute("data-manual-fill-ready", "1");
    var params = new URLSearchParams(window.location.search.replace(/^\?/, ""));
    var cat = (params.get("category") || "").trim();
    var file = (params.get("file") || "").trim();
    var pages = params.get("pages");
    if (!cat || !file) {
      window.location.replace(
        cat ? "document-method.html?category=" + encodeURIComponent(cat) : "document-category.html"
      );
      return;
    }
    var shortName = humanizeMethodTemplateLabel(file);
    var titleEl = root.querySelector("[data-manual-fill-title]");
    var ledeEl = root.querySelector("[data-manual-fill-lede]");
    var fileEl = root.querySelector("[data-manual-fill-file]");
    if (titleEl) titleEl.textContent = "Fill template manually";
    if (ledeEl) {
      ledeEl.textContent =
        "Edit the letter in plain text on the page. Short answers on the right fill the header.";
    }
    if (fileEl) fileEl.textContent = file;
    document.title = shortName + " — Fill document — Workbench HR";

    var methodParams = new URLSearchParams();
    methodParams.set("category", cat);
    methodParams.set("file", file);
    if (pages) methodParams.set("pages", pages);
    var methodQs = methodParams.toString();
    var methodCrumb = document.querySelector("[data-manual-crumb-method]");
    var tplCrumb = document.querySelector("[data-manual-crumb-templates]");
    if (methodCrumb) methodCrumb.setAttribute("href", "document-method.html?" + methodQs);
    if (tplCrumb) tplCrumb.setAttribute("href", "document-templates.html?category=" + encodeURIComponent(cat));

    var back = root.querySelector("[data-manual-back]");
    if (back) back.setAttribute("href", "document-method.html?" + methodQs);

    restoreManualFillFromStorage(root, cat, file);

    var toast = root.querySelector("[data-manual-toast]");
    var saveBtn = root.querySelector("[data-manual-save-draft]");
    if (saveBtn && toast) {
      saveBtn.addEventListener("click", function () {
        persistManualFillDraft(collectManualFillPayload(root, cat, file, pages));
        toast.textContent = "Draft saved locally for this session.";
        toast.hidden = false;
        window.setTimeout(function () {
          toast.hidden = true;
        }, 3200);
      });
    }

    function formatLetterDate(raw) {
      if (!raw || !String(raw).trim()) return "—";
      var d = new Date(raw + "T12:00:00");
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    function syncSlots() {
      root.querySelectorAll("[data-manual-field]").forEach(function (input) {
        var key = input.getAttribute("data-manual-field") || "";
        var val = input.value || "";
        root.querySelectorAll('[data-manual-slot="' + key + '"]').forEach(function (slot) {
          if (key === "letterDate") {
            slot.textContent = formatLetterDate(val);
          } else {
            slot.textContent = val.trim() ? val : "—";
          }
        });
      });
    }

    root.querySelectorAll("[data-manual-field]").forEach(function (el) {
      el.addEventListener("input", syncSlots);
      el.addEventListener("change", syncSlots);
    });
    syncSlots();

    var dateInput = root.querySelector('[data-manual-field="letterDate"]');
    if (dateInput && !dateInput.value) {
      var today = new Date();
      var m = today.getMonth() + 1;
      var d = today.getDate();
      dateInput.value =
        today.getFullYear() +
        "-" +
        (m < 10 ? "0" : "") +
        m +
        "-" +
        (d < 10 ? "0" : "") +
        d;
      syncSlots();
    }

    var reviewBtn = root.querySelector("[data-manual-review]");
    if (reviewBtn) {
      reviewBtn.addEventListener("click", function () {
        persistManualFillDraft(collectManualFillPayload(root, cat, file, pages));
        window.location.href =
          "document-review.html?category=" +
          encodeURIComponent(cat) +
          "&file=" +
          encodeURIComponent(file) +
          (pages ? "&pages=" + encodeURIComponent(pages) : "");
      });
    }
  }

  function bindGenerateAiPage() {
    var root = document.querySelector("[data-gen-ai-root]");
    if (!root || root.getAttribute("data-gen-ai-ready") === "1") return;
    root.setAttribute("data-gen-ai-ready", "1");
    var params = new URLSearchParams(window.location.search.replace(/^\?/, ""));
    var cat = (params.get("category") || "").trim();
    var file = (params.get("file") || "").trim();
    var pages = params.get("pages");
    if (!cat || !file) {
      window.location.replace(
        cat ? "document-method.html?category=" + encodeURIComponent(cat) : "document-category.html"
      );
      return;
    }

    var shortName = humanizeMethodTemplateLabel(file);
    var fileEl = root.querySelector("[data-gen-ai-file]");
    if (fileEl) fileEl.textContent = file;
    document.title = shortName + " — AI draft — Workbench HR";

    var lede = root.querySelector("[data-gen-ai-lede]");
    if (lede) {
      lede.textContent =
        "Template selected: " +
        file +
        ". Use the assistant to describe what you want in the document (demonstration — no live model).";
    }

    var methodParams = new URLSearchParams();
    methodParams.set("category", cat);
    methodParams.set("file", file);
    if (pages) methodParams.set("pages", pages);
    var qs = methodParams.toString();

    var tplCrumb = document.querySelector("[data-gen-ai-crumb-templates]");
    var methodCrumb = document.querySelector("[data-gen-ai-crumb-method]");
    if (tplCrumb) tplCrumb.setAttribute("href", "document-templates.html?category=" + encodeURIComponent(cat));
    if (methodCrumb) methodCrumb.setAttribute("href", "document-method.html?" + qs);

    var back = root.querySelector("[data-gen-ai-back]");
    if (back) back.setAttribute("href", "document-method.html?" + qs);

    var manualAlt = root.querySelector("[data-gen-ai-manual-alt]");
    if (manualAlt) manualAlt.setAttribute("href", "document-manual-fill.html?" + qs);

    var messagesEl = root.querySelector("[data-gen-ai-messages]");
    var inputEl = root.querySelector("[data-gen-ai-input]");
    var formEl = root.querySelector("[data-gen-ai-form]");

    function appendBubble(role, text) {
      if (!messagesEl) return;
      var wrap = document.createElement("div");
      wrap.className =
        "wb-gen-ai__msg wb-gen-ai__msg--" + (role === "user" ? "user" : "bot");
      var p = document.createElement("p");
      p.className = "wb-gen-ai__msg-text";
      p.textContent = text;
      wrap.appendChild(p);
      messagesEl.appendChild(wrap);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function demoReply(userText) {
      var lower = (userText || "").toLowerCase();
      if (/offer|hire|salary|comp|start date/.test(lower)) {
        return "I can structure this as an offer letter: start date, compensation, benefits summary, and reporting line. In production, this would fill the preview on the left. Want a more formal or conversational tone?";
      }
      if (/termin|lay off|separation|let go|fire/.test(lower)) {
        return "For a separation notice, I’d confirm last day, final pay timing, and return of equipment. Share jurisdiction or policy constraints if you need them reflected (demo only).";
      }
      if (/thanks|ok|yes|sounds good/.test(lower)) {
        return "Great. Add any must-have phrases or names, and we’ll shape the next draft (preview only in this demo).";
      }
      return "Got it. Give a bit more context — audience, dates, and what outcome you want from this document — and I’ll mirror that in a real integrated flow.";
    }

    function send() {
      var text = (inputEl && inputEl.value) || "";
      text = text.trim();
      if (!text) return;
      appendBubble("user", text);
      if (inputEl) inputEl.value = "";
      window.setTimeout(function () {
        appendBubble("bot", demoReply(text));
      }, 450);
    }

    if (formEl) {
      formEl.addEventListener("submit", function (e) {
        e.preventDefault();
        send();
      });
    }
  }

  function bindDocumentReviewPage() {
    var root = document.querySelector("[data-doc-review-root]");
    if (!root || root.getAttribute("data-doc-review-ready") === "1") return;
    root.setAttribute("data-doc-review-ready", "1");
    var params = new URLSearchParams(window.location.search.replace(/^\?/, ""));
    var cat = (params.get("category") || "").trim();
    var file = (params.get("file") || "").trim();
    var pages = params.get("pages");
    if (!cat || !file) {
      window.location.replace("document-category.html");
      return;
    }
    var draft = loadManualFillDraft();
    if (!draft || draft.category !== cat || draft.file !== file) {
      window.location.replace(
        "document-manual-fill.html?category=" + encodeURIComponent(cat) + "&file=" + encodeURIComponent(file)
      );
      return;
    }

    function formatLetterDate(raw) {
      if (!raw || !String(raw).trim()) return "—";
      var d = new Date(raw + "T12:00:00");
      if (isNaN(d.getTime())) return raw;
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    function slotText(key, fields) {
      var val = (fields && fields[key]) || "";
      if (key === "letterDate") return formatLetterDate(val);
      return val.trim() ? val : "—";
    }

    var fields = draft.fields || {};
    root.querySelectorAll("[data-review-slot]").forEach(function (slot) {
      var key = slot.getAttribute("data-review-slot");
      if (!key) return;
      slot.textContent = slotText(key, fields);
    });

    var bodyOut = root.querySelector("[data-review-body]");
    if (bodyOut) bodyOut.textContent = draft.body || "";

    var shortName = humanizeMethodTemplateLabel(file);
    var fileEl = root.querySelector("[data-review-file]");
    if (fileEl) fileEl.textContent = file;
    document.title = shortName + " — Review — Workbench HR";

    var lede = root.querySelector("[data-review-lede]");
    if (lede) {
      lede.textContent =
        "Your short answers appear in the header. The body matches your manual fill text.";
    }

    var methodParams = new URLSearchParams();
    methodParams.set("category", cat);
    methodParams.set("file", file);
    if (pages) methodParams.set("pages", pages);
    var qs = methodParams.toString();
    var manualHref = "document-manual-fill.html?" + qs;

    var tplCrumb = document.querySelector("[data-review-crumb-templates]");
    var methodCrumb = document.querySelector("[data-review-crumb-method]");
    var fillCrumb = document.querySelector("[data-review-crumb-fill]");
    if (tplCrumb) tplCrumb.setAttribute("href", "document-templates.html?category=" + encodeURIComponent(cat));
    if (methodCrumb) methodCrumb.setAttribute("href", "document-method.html?" + qs);
    if (fillCrumb) fillCrumb.setAttribute("href", manualHref);

    var back = root.querySelector("[data-review-back]");
    if (back) back.setAttribute("href", manualHref);

    var toast = root.querySelector("[data-review-toast]");
    function showReviewToast(msg) {
      if (!toast) return;
      toast.textContent = msg;
      toast.hidden = false;
      window.setTimeout(function () {
        toast.hidden = true;
      }, 4200);
    }

    var saveBtn = root.querySelector("[data-review-save]");
    if (saveBtn) {
      saveBtn.addEventListener("click", function () {
        draft.savedAt = new Date().toISOString();
        persistManualFillDraft(draft);
        try {
          sessionStorage.setItem(
            WB_DOCS_PENDING_ROW_KEY,
            JSON.stringify({
              fileName: file,
              categoryKey: cat,
              categoryLabel: CAT_LABEL[cat] || cat,
              title: shortName,
              savedAt: draft.savedAt,
            })
          );
        } catch (err) {}
        window.location.href = "documents.html#/documents?saved=1";
      });
    }

    var shareBtn = root.querySelector("[data-review-share]");
    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var title = shortName + " — Workbench HR";
        var text = draft.body || "";
        if (navigator.share) {
          navigator
            .share({ title: title, text: text.slice(0, 4000) })
            .catch(function () {});
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text || title).then(
            function () {
              showReviewToast("Copied document text to clipboard.");
            },
            function () {
              showReviewToast("Unable to copy automatically — select text in the preview.");
            }
          );
        } else {
          showReviewToast("Sharing isn’t available in this browser.");
        }
      });
    }

    var apiBase = getDocGenApiBase();
    var aiPanel = root.querySelector("[data-review-ai-panel]");
    var aiSelect = root.querySelector("[data-review-ai-doctype-select]");
    var aiBtn = root.querySelector("[data-review-ai-generate]");
    var aiStatus = root.querySelector("[data-review-ai-status]");
    var aiErr = root.querySelector("[data-review-ai-error]");
    var aiHint = root.querySelector("[data-review-ai-hint]");
    var capEl = root.querySelector("[data-review-viewer-caption]");

    function showAiError(msg) {
      if (!aiErr) return;
      aiErr.textContent = msg || "";
      aiErr.hidden = !msg;
    }

    if (aiPanel && aiSelect && aiBtn) {
      var inferred = inferDocumentTypeForTemplate(cat, file);
      var aiGenReady = false;

      function setHint(text) {
        if (aiHint) aiHint.textContent = text;
      }

      function setAiLoading(on) {
        if (aiBtn) {
          if (on) aiBtn.disabled = true;
          else aiBtn.disabled = !aiGenReady;
        }
        if (aiStatus) {
          aiStatus.hidden = !on;
          aiStatus.textContent = on ? "Generating…" : "";
        }
      }

      aiBtn.disabled = true;

      if (!apiBase) {
        fillDocGenTypeSelect(aiSelect, DOC_GEN_FALLBACK_TYPES, inferred);
        aiGenReady = false;
        aiBtn.disabled = true;
        showAiError(
          "Document API URL is not set for this deployment. GitHub Pages cannot call localhost. Add " +
            '<meta name="wb-doc-gen-api" content="https://YOUR-API.example.com"> ' +
            "(your deployed FastAPI origin, no trailing slash), or set window.__WB_DOC_GEN_API__. " +
            "Then allow this site in the API CORS ALLOWED_ORIGINS."
        );
        setHint("Example: https://workbench-ai.onrender.com — same URL you use for https://…/health.");
      } else {
        fetchDocGenConfig(apiBase)
        .then(function (cfg) {
          showAiError("");
          var types = (cfg && cfg.doc_types) || [];
          fillDocGenTypeSelect(aiSelect, types, inferred);
          setHint(
            'Mapped from template to "' +
              (aiSelect.options[aiSelect.selectedIndex] &&
                aiSelect.options[aiSelect.selectedIndex].textContent) +
              '". Choose another type if needed.'
          );
          if (!types.length) {
            fillDocGenTypeSelect(aiSelect, DOC_GEN_FALLBACK_TYPES, inferred);
            aiGenReady = true;
            aiBtn.disabled = false;
            setHint("API returned no types — using built-in list. Try Generate or check Pinecone indexing.");
          } else {
            aiGenReady = true;
            aiBtn.disabled = false;
          }
        })
        .catch(function () {
          fillDocGenTypeSelect(aiSelect, DOC_GEN_FALLBACK_TYPES, inferred);
          aiGenReady = true;
          aiBtn.disabled = false;
          showAiError(
            "Could not reach /documents/config at " +
              apiBase +
              " — using built-in document types. " +
              "If the API is on another host, set CORS ALLOWED_ORIGINS to include " +
              (window.location.origin || "this site") +
              (window.location.host && window.location.host.indexOf("github.io") !== -1
                ? " (project pages: https://user.github.io and https://user.github.io/repo-name)."
                : ".")
          );
          setHint(
            "Config request failed (often CORS or wrong API URL in meta wb-doc-gen-api). You can still try Generate."
          );
        });

      }

      aiBtn.addEventListener("click", function () {
        showAiError("");
        if (!apiBase) {
          showAiError(
            "Set your deployed API URL in meta wb-doc-gen-api (HTTPS). GitHub Pages cannot use localhost."
          );
          return;
        }
        var docType = aiSelect.value;
        if (!docType) return;
        var employee = buildEmployeeForDocGen(docType, fields);
        setAiLoading(true);
        postDocGenGenerate(apiBase, docType, employee).then(
          function (res) {
            var text = (res && res.document) || "";
            if (bodyOut) bodyOut.textContent = text;
            draft.body = text;
            persistManualFillDraft(draft);
            if (capEl) capEl.textContent = "AI-generated draft — review before saving";
            showReviewToast("Document body updated from AI.");
          },
          function (err) {
            showAiError((err && err.message) || String(err));
          }
        ).then(function () {
          setAiLoading(false);
        });
      });
    }
  }

  function cleanDocumentsSavedQueryFromUrl() {
    if ((window.location.hash || "").indexOf("saved=1") === -1) return;
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + "#/documents"
    );
  }

  function bindApplicantsPage(search) {
    var params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
    var role = params.get("role") || "foh";
    var map = {
      foh: { title: "Front of House (FOH) Staff", count: "15" },
      culinary: { title: "Culinary Lead", count: "4" },
    };
    var m = map[role] || map.foh;
    var searchInput = document.querySelector("[data-applicants-search]");
    if (searchInput) {
      searchInput.placeholder = "Search '" + m.title + "' applicants…";
    }
    var rootApplicants = document.querySelector("[data-applicants-root]");
    if (rootApplicants) {
      rootApplicants.setAttribute("data-applicants-role-title", m.title);
      rootApplicants.setAttribute("data-applicants-role-count", m.count);
    }
    bindApplicantsSearchIfNeeded();
    if (rootApplicants && rootApplicants.__wbApplicantsRefresh) {
      var siClear = rootApplicants.querySelector("[data-applicants-search]");
      if (siClear) siClear.value = "";
      rootApplicants.__wbApplicantsRefresh();
    }
    var crumb = document.querySelector("[data-applicants-role-title]");
    if (crumb) crumb.textContent = m.title;
    var h = document.querySelector("[data-applicants-page-heading]");
    if (h) h.textContent = "Applicants — " + m.title;
    document.querySelectorAll(".wb-applicant-card__role").forEach(function (el) {
      el.textContent = m.title + " candidate";
    });
  }

  function bindApplicantsSearchIfNeeded() {
    var root = document.querySelector("[data-applicants-root]");
    if (!root || root.getAttribute("data-applicants-search-bound") === "1") return;
    root.setAttribute("data-applicants-search-bound", "1");
    var searchInp = root.querySelector("[data-applicants-search]");
    var countEl = document.querySelector("[data-applicants-count]");
    if (!searchInp) return;

    function applicantCardHaystack(card) {
      return (card.textContent || "").toLowerCase().replace(/\s+/g, " ");
    }

    function refreshApplicantsSearch() {
      var q = (searchInp.value || "").trim().toLowerCase();
      var cards = root.querySelectorAll(".wb-applicant-card");
      var total = cards.length;
      var visible = 0;
      cards.forEach(function (card) {
        var show = !q || applicantCardHaystack(card).indexOf(q) !== -1;
        card.hidden = !show;
        if (show) visible++;
      });
      if (!countEl) return;
      var roleTitle = root.getAttribute("data-applicants-role-title") || "candidates";
      var roleCount = root.getAttribute("data-applicants-role-count") || String(total);
      if (!q) {
        countEl.innerHTML =
          "Showing <strong>" +
          roleCount +
          "</strong> &lsquo;" +
          roleTitle +
          "&rsquo; candidates.";
      } else {
        countEl.innerHTML =
          "Showing <strong>" +
          visible +
          "</strong> of <strong>" +
          total +
          "</strong> matching &lsquo;" +
          roleTitle +
          "&rsquo;.";
      }
    }

    searchInp.addEventListener("input", refreshApplicantsSearch);
    searchInp.addEventListener("search", refreshApplicantsSearch);
    root.__wbApplicantsRefresh = refreshApplicantsSearch;
  }

  function parseApplicantDocDateToMs(dateStr) {
    var parts = String(dateStr || "").split("/");
    if (parts.length !== 3) return 0;
    var mo = parseInt(parts[0], 10);
    var day = parseInt(parts[1], 10);
    var yr = parseInt(parts[2], 10);
    if (!yr || !mo || !day) return 0;
    var t = new Date(yr, mo - 1, day).getTime();
    return isNaN(t) ? 0 : t;
  }

  function applyViewApplicantDocsFilterSort() {
    var root = document.querySelector("[data-va-docs-root]");
    var list = document.querySelector("[data-va-docs-list]");
    if (!root || !list) return;

    var activeTabBtn = root.querySelector(".wb-va-docs__tab.wb-va-docs__tab--active");
    var tab = activeTabBtn ? (activeTabBtn.getAttribute("data-va-docs-tab") || "all").toLowerCase() : "all";

    var sortPill = root.querySelector("[data-va-doc-sort].wb-hiring__sort-pill--active");
    var sortMode = sortPill && sortPill.getAttribute("data-va-doc-sort") === "date" ? "date" : "name";

    var searchInp = root.querySelector("[data-va-docs-search]");
    var q = (searchInp && searchInp.value ? searchInp.value : "").trim().toLowerCase();

    var items = Array.prototype.slice.call(list.querySelectorAll(".wb-va-doc-row"));
    items.forEach(function (li) {
      var kind = (li.getAttribute("data-doc-kind") || "").toLowerCase();
      var passTab = tab === "all" || tab === kind;
      var name = (li.getAttribute("data-va-doc-file") || "").toLowerCase();
      var rowText = (li.textContent || "").toLowerCase().replace(/\s+/g, " ");
      var passQ = !q || name.indexOf(q) !== -1 || rowText.indexOf(q) !== -1;
      li.hidden = !(passTab && passQ);
    });

    var visible = items.filter(function (li) {
      return !li.hidden;
    });
    var hidden = items.filter(function (li) {
      return li.hidden;
    });

    function cmp(a, b) {
      if (sortMode === "date") {
        var ad = parseInt(a.getAttribute("data-va-doc-posted") || "0", 10);
        var bd = parseInt(b.getAttribute("data-va-doc-posted") || "0", 10);
        if (ad !== bd) return bd - ad;
      }
      var an = (a.getAttribute("data-va-doc-file") || "").toLowerCase();
      var bn = (b.getAttribute("data-va-doc-file") || "").toLowerCase();
      if (an < bn) return -1;
      if (an > bn) return 1;
      return 0;
    }

    visible.sort(cmp);
    hidden.sort(cmp);
    visible.concat(hidden).forEach(function (li) {
      list.appendChild(li);
    });

    var msg = root.querySelector("[data-va-docs-count-msg]");
    if (msg) {
      var n = visible.length;
      msg.textContent = n ? "Showing " + n + " " + (n === 1 ? "document" : "documents") : "No documents match your filters";
    }
  }

  function bindViewApplicantDocsControls() {
    if (window.__wbVaDocsControlsBound) return;
    var root = document.querySelector("[data-va-docs-root]");
    if (!root) return;
    window.__wbVaDocsControlsBound = true;

    root.addEventListener("click", function (e) {
      var tab = e.target.closest("[data-va-docs-tab]");
      if (tab && root.contains(tab)) {
        root.querySelectorAll("[data-va-docs-tab]").forEach(function (t) {
          var on = t === tab;
          t.classList.toggle("wb-va-docs__tab--active", on);
          t.setAttribute("aria-selected", on ? "true" : "false");
        });
        applyViewApplicantDocsFilterSort();
        return;
      }

      var pill = e.target.closest("[data-va-doc-sort]");
      if (pill && root.contains(pill)) {
        root.querySelectorAll("[data-va-doc-sort]").forEach(function (p) {
          var on = p === pill;
          p.classList.toggle("wb-hiring__sort-pill--active", on);
          p.setAttribute("aria-pressed", on ? "true" : "false");
        });
        applyViewApplicantDocsFilterSort();
      }
    });

    var searchInp = root.querySelector("[data-va-docs-search]");
    if (searchInp) searchInp.addEventListener("input", applyViewApplicantDocsFilterSort);
  }

  function bindViewApplicantPage(search) {
    var params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
    var id = (params.get("id") || "olivia").toLowerCase();
    var map = {
      olivia: {
        name: "Olivia Thompson",
        role: "Front of House (FOH) Staff Candidate",
        crumb: "Olivia Thompson",
        photo: "assets/olivia.png",
        match: "92%",
        summary:
          "Matches all core competencies and 5/5 required skills. Exceeds experience requirements.",
      },
      marcus: {
        name: "Marcus Chen",
        role: "Front of House (FOH) Staff Candidate",
        crumb: "Marcus Chen",
        photo:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        match: "88%",
        summary:
          "Excellent availability and shift flexibility; recommend scheduling a final panel this week.",
      },
      priya: {
        name: "Priya Nair",
        role: "Front of House (FOH) Staff Candidate",
        crumb: "Priya Nair",
        photo:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
        match: "85%",
        summary:
          "Hospitality background aligns with peak-hour pacing; follow up on certification documents.",
      },
    };
    var m = map[id] || map.olivia;
    var h = document.querySelector("[data-va-page-heading]");
    if (h) h.textContent = "Applicant — " + m.name;
    var crumb = document.querySelector("[data-va-crumb]");
    if (crumb) crumb.textContent = m.crumb;
    var nm = document.querySelector("[data-va-name]");
    if (nm) nm.textContent = m.name;
    var role = document.querySelector("[data-va-role]");
    if (role) role.textContent = m.role;
    var photo = document.querySelector("[data-va-photo]");
    if (photo) photo.setAttribute("src", m.photo);
    var match = document.querySelector("[data-va-match]");
    if (match) match.textContent = m.match;
    var summary = document.querySelector("[data-va-summary]");
    if (summary) summary.textContent = m.summary;
    var docSearch = document.querySelector("[data-va-docs-search]");
    if (docSearch) docSearch.placeholder = "Search documents…";

    var docListEl = document.querySelector("[data-va-docs-list]");
    if (docListEl) {
      var docs = APPLICANT_SAMPLE_DOCS[id] || APPLICANT_SAMPLE_DOCS.olivia;
      var parts = [];
      for (var i = 0; i < docs.length; i++) {
        var d = docs[i];
        parts.push(
          '<li class="wb-va-doc-row" data-doc-kind="' +
            d.kind +
            '" data-va-doc-file="' +
            d.file +
            '" data-va-doc-posted="' +
            parseApplicantDocDateToMs(d.date) +
            '">' +
            '<span class="wb-va-doc-row__ic" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" width="20" height="20">' +
            '<path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 1.5L18.5 8H14V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h5V11H8v-1z" opacity="0.55"/>' +
            "</svg>" +
            "</span>" +
            '<div class="wb-va-doc-row__main">' +
            '<span class="wb-va-doc-row__name">' +
            d.file +
            "</span>" +
            '<span class="wb-va-doc-row__meta">' +
            '<span class="wb-va-doc-row__pill wb-va-doc-row__pill--' +
            d.kind +
            '">' +
            d.typeLabel +
            "</span>" +
            '<span class="wb-va-doc-row__date">Added ' +
            d.date +
            "</span>" +
            "</span>" +
            "</div>" +
            '<button type="button" class="wb-va-doc-row__open">Open</button>' +
            "</li>"
        );
      }
      docListEl.innerHTML = parts.join("");
    }
    applyViewApplicantDocsFilterSort();
  }

  function openApplicantPdfModal(fileLabel) {
    var modal = document.getElementById("wb-va-pdf-modal");
    var titleEl = document.querySelector("[data-va-pdf-title]");
    var frame = document.querySelector("[data-va-pdf-frame]");
    if (!modal || !frame) return;
    if (titleEl) titleEl.textContent = fileLabel || "Document";
    frame.setAttribute("src", VA_SAMPLE_PDF_SRC);
    modal.hidden = false;
    document.body.classList.add("wb-va-pdf-modal--open");
  }

  function closeApplicantPdfModal() {
    var modal = document.getElementById("wb-va-pdf-modal");
    var frame = document.querySelector("[data-va-pdf-frame]");
    if (modal) modal.hidden = true;
    if (frame) frame.setAttribute("src", "about:blank");
    document.body.classList.remove("wb-va-pdf-modal--open");
  }

  function openDocumentsPdfModal(fileLabel) {
    closeSignReminderModal();
    closeNudgeModal();
    var modal = document.getElementById("wb-docs-pdf-modal");
    var titleEl = document.querySelector("[data-docs-pdf-title]");
    var frame = document.querySelector("[data-docs-pdf-frame]");
    if (!modal || !frame) return;
    if (titleEl) titleEl.textContent = fileLabel || "Document";
    frame.setAttribute("src", VA_SAMPLE_PDF_SRC);
    modal.hidden = false;
    document.body.classList.add("wb-va-pdf-modal--open");
  }

  function closeDocumentsPdfModal() {
    var modal = document.getElementById("wb-docs-pdf-modal");
    var frame = document.querySelector("[data-docs-pdf-frame]");
    if (modal) modal.hidden = true;
    if (frame) frame.setAttribute("src", "about:blank");
    document.body.classList.remove("wb-va-pdf-modal--open");
  }

  function closeSignReminderModal() {
    var modal = document.querySelector("[data-sign-reminder-modal]");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("wb-sign-reminder-modal--open");
    var ref = window.__wbSignReminderLastFocus;
    if (ref && typeof ref.focus === "function") ref.focus();
    window.__wbSignReminderLastFocus = null;
  }

  function openSignReminderModal(triggerBtn) {
    closeDocumentsPdfModal();
    closeSignQueuePdfModal();
    closeNudgeModal();
    var modal = document.querySelector("[data-sign-reminder-modal]");
    if (!modal) return;
    var feedback = modal.querySelector("[data-sign-reminder-feedback]");
    if (feedback) {
      feedback.hidden = true;
      feedback.textContent = "";
    }
    window.__wbSignReminderLastFocus = triggerBtn;
    modal.hidden = false;
    document.body.classList.add("wb-sign-reminder-modal--open");
    var dateInp = modal.querySelector("[data-sign-reminder-date]");
    if (dateInp && !dateInp.value) {
      var d = new Date();
      d.setDate(d.getDate() + 1);
      var y = d.getFullYear();
      var mo = d.getMonth() + 1;
      var day = d.getDate();
      dateInp.value = y + "-" + (mo < 10 ? "0" : "") + mo + "-" + (day < 10 ? "0" : "") + day;
    }
    window.setTimeout(function () {
      var focusEl = modal.querySelector("[data-sign-reminder-date]");
      if (focusEl && typeof focusEl.focus === "function") focusEl.focus();
    }, 0);
  }

  function bindSignReminderModal() {
    if (window.__wbSignReminderModalBound) return;
    window.__wbSignReminderModalBound = true;
    document.addEventListener("click", function (e) {
      var openBtn = e.target.closest("[data-sign-reminder-open]");
      if (openBtn) {
        e.preventDefault();
        openSignReminderModal(openBtn);
        return;
      }
      if (e.target.closest("[data-sign-reminder-close]")) {
        closeSignReminderModal();
        return;
      }
      var saveBtn = e.target.closest("[data-sign-reminder-save]");
      if (saveBtn) {
        e.preventDefault();
        var modal = saveBtn.closest("[data-sign-reminder-modal]");
        if (!modal) return;
        var dateInp = modal.querySelector("[data-sign-reminder-date]");
        var timeInp = modal.querySelector("[data-sign-reminder-time]");
        var noteInp = modal.querySelector("[data-sign-reminder-note]");
        var fb = modal.querySelector("[data-sign-reminder-feedback]");
        if (!dateInp || !dateInp.value) {
          if (fb) {
            fb.hidden = false;
            fb.textContent = "Pick a reminder date to continue.";
          }
          return;
        }
        var timePart = timeInp && timeInp.value ? " at " + timeInp.value : "";
        var noteTxt = noteInp && noteInp.value.trim();
        if (fb) {
          fb.hidden = false;
          fb.textContent =
            "We\u2019ll remind you around " +
            dateInp.value +
            timePart +
            (noteTxt ? " \u2014 " + noteTxt : "") +
            ". Preview only \u2014 this is not saved to a calendar.";
        }
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var modal = document.querySelector("[data-sign-reminder-modal]");
      if (!modal || modal.hidden) return;
      e.preventDefault();
      closeSignReminderModal();
    });
  }

  function closeNudgeModal() {
    var modal = document.querySelector("[data-nudge-modal]");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("wb-dash-nudge-modal--open");
    var ref = window.__wbNudgeLastFocus;
    if (ref && typeof ref.focus === "function") ref.focus();
    window.__wbNudgeLastFocus = null;
  }

  function openNudgeModal(triggerBtn) {
    closeSignReminderModal();
    closeDocumentsPdfModal();
    closeSignQueuePdfModal();
    var modal = document.querySelector("[data-nudge-modal]");
    if (!modal) return;
    var feedback = modal.querySelector("[data-nudge-feedback]");
    if (feedback) {
      feedback.hidden = true;
      feedback.textContent = "";
    }
    window.__wbNudgeLastFocus = triggerBtn;
    modal.hidden = false;
    document.body.classList.add("wb-dash-nudge-modal--open");
    window.setTimeout(function () {
      var first = modal.querySelector('input[name="wb-dash-nudge-channel"]');
      if (first && typeof first.focus === "function") first.focus();
    }, 0);
  }

  function applyDashboardUpcomingRange(root, days) {
    var segWrap = root.querySelector("[data-dash-upcoming-segments]");
    var list = root.querySelector("[data-dash-upcoming-list]");
    if (!segWrap || !list) return;
    var d = days === 30 ? 30 : 7;
    segWrap.querySelectorAll("[data-dash-upcoming-range]").forEach(function (btn) {
      var val = parseInt(btn.getAttribute("data-dash-upcoming-range") || "7", 10);
      var on = val === d;
      btn.classList.toggle("wb-dash-segments__btn--active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    list.querySelectorAll(".wb-dash-upcoming-row").forEach(function (row) {
      var raw = (row.getAttribute("data-upcoming-ranges") || "7,30").trim();
      var parts = raw.split(",").map(function (s) {
        return parseInt(s.trim(), 10);
      }).filter(function (n) {
        return n === 7 || n === 30;
      });
      if (parts.length === 0) {
        parts.push(7);
        parts.push(30);
      }
      row.hidden = parts.indexOf(d) === -1;
    });
  }

  function bindDashboardUpcoming() {
    if (!isDashboardHtmlDoc() || window.__wbDashUpcomingBound) return;
    var root = document.querySelector("[data-dash-upcoming-root]");
    if (!root) return;
    window.__wbDashUpcomingBound = true;
    var segWrap = root.querySelector("[data-dash-upcoming-segments]");
    if (!segWrap) return;
    segWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-dash-upcoming-range]");
      if (!btn || !segWrap.contains(btn)) return;
      var days = parseInt(btn.getAttribute("data-dash-upcoming-range") || "7", 10);
      if (days !== 7 && days !== 30) return;
      applyDashboardUpcomingRange(root, days);
    });
    applyDashboardUpcomingRange(root, 7);
  }

  function applyDashboardHiringStatus(root, statusStr) {
    var segWrap = root.querySelector("[data-dash-hiring-segments]");
    var list = root.querySelector("[data-dash-hiring-list]");
    if (!segWrap || !list) return;
    var sel = String(statusStr || "active").toLowerCase();
    if (sel !== "active" && sel !== "paused" && sel !== "closed") sel = "active";
    segWrap.querySelectorAll("[data-dash-hiring-status]").forEach(function (btn) {
      var st = String(btn.getAttribute("data-dash-hiring-status") || "").toLowerCase();
      var on = st === sel;
      btn.classList.toggle("wb-dash-segments__btn--active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
    list.querySelectorAll(".wb-dash-hire-row").forEach(function (row) {
      var st = String(row.getAttribute("data-hiring-listing-status") || "active").toLowerCase();
      row.hidden = st !== sel;
    });
  }

  function bindDashboardHiringPipeline() {
    if (!isDashboardHtmlDoc() || window.__wbDashHiringBound) return;
    var root = document.querySelector("[data-dash-hiring-root]");
    if (!root) return;
    window.__wbDashHiringBound = true;
    var segWrap = root.querySelector("[data-dash-hiring-segments]");
    if (!segWrap) return;
    segWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-dash-hiring-status]");
      if (!btn || !segWrap.contains(btn)) return;
      var st = btn.getAttribute("data-dash-hiring-status");
      if (!st) return;
      applyDashboardHiringStatus(root, st);
    });
    applyDashboardHiringStatus(root, "active");
  }

  function bindNudgeModal() {
    if (window.__wbNudgeModalBound) return;
    window.__wbNudgeModalBound = true;
    document.addEventListener("click", function (e) {
      var openBtn = e.target.closest("[data-nudge-open]");
      if (openBtn) {
        e.preventDefault();
        openNudgeModal(openBtn);
        return;
      }
      if (e.target.closest("[data-nudge-close]")) {
        closeNudgeModal();
        return;
      }
      var sendBtn = e.target.closest("[data-nudge-send]");
      if (sendBtn) {
        e.preventDefault();
        var modal = sendBtn.closest("[data-nudge-modal]");
        if (!modal) return;
        var ch = modal.querySelector('input[name="wb-dash-nudge-channel"]:checked');
        var channel = ch ? ch.value : "email";
        var msgInp = modal.querySelector("[data-nudge-message]");
        var whenInp = modal.querySelector("[data-nudge-when]");
        var fb = modal.querySelector("[data-nudge-feedback]");
        var parts = ["Preview: nudge would go out via " + channel + "."];
        if (msgInp && msgInp.value.trim()) parts.push("\u201c" + msgInp.value.trim() + "\u201d");
        if (whenInp && whenInp.value) parts.push("Scheduled for " + whenInp.value + ".");
        parts.push("Nothing was sent from this demo.");
        if (fb) {
          fb.hidden = false;
          fb.textContent = parts.join(" ");
        }
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var nudge = document.querySelector("[data-nudge-modal]");
      if (!nudge || nudge.hidden) return;
      e.preventDefault();
      closeNudgeModal();
    });
  }

  function openSignQueuePdfModal(fileLabel) {
    closeSignReminderModal();
    closeNudgeModal();
    var modal = document.getElementById("wb-sign-queue-pdf-modal");
    var titleEl = document.querySelector("[data-sign-queue-pdf-title]");
    var frame = document.querySelector("[data-sign-queue-pdf-frame]");
    if (!modal || !frame) return;
    if (titleEl) titleEl.textContent = fileLabel || "Document";
    frame.setAttribute("src", VA_SAMPLE_PDF_SRC);
    modal.hidden = false;
    document.body.classList.add("wb-va-pdf-modal--open");
  }

  function closeSignQueuePdfModal() {
    var modal = document.getElementById("wb-sign-queue-pdf-modal");
    var frame = document.querySelector("[data-sign-queue-pdf-frame]");
    if (modal) modal.hidden = true;
    if (frame) frame.setAttribute("src", "about:blank");
    document.body.classList.remove("wb-va-pdf-modal--open");
  }

  function bindSignQueuePage() {
    if (window.__wbSignQueueBound) return;
    var root = document.querySelector("[data-sign-queue-root]");
    if (!root) return;
    window.__wbSignQueueBound = true;

    function updateCount() {
      var rows = root.querySelectorAll("[data-sign-queue-row]:not(.wb-sign-queue__row--signed)");
      var n = rows.length;
      var el = root.querySelector("[data-sign-queue-count]");
      if (!el) return;
      if (n === 0) {
        el.textContent = "You are caught up — no signatures waiting.";
      } else {
        el.textContent =
          n + (n === 1 ? " document is " : " documents are ") + "waiting on your signature.";
      }
    }

    root.addEventListener("click", function (e) {
      var prevBtn = e.target.closest("[data-sign-queue-preview]");
      if (prevBtn && root.contains(prevBtn)) {
        var row = prevBtn.closest("[data-sign-queue-row]");
        var t = row ? row.querySelector(".wb-sign-queue__title") : null;
        openSignQueuePdfModal(t ? t.textContent.trim() : "Document");
        return;
      }
      var signBtn = e.target.closest("[data-sign-queue-sign]");
      if (signBtn && root.contains(signBtn)) {
        var row2 = signBtn.closest("[data-sign-queue-row]");
        if (row2 && !row2.classList.contains("wb-sign-queue__row--signed")) {
          row2.classList.add("wb-sign-queue__row--signed");
          signBtn.disabled = true;
          signBtn.textContent = "Signed";
          updateCount();
        }
      }
    });

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-sign-queue-pdf-close]")) closeSignQueuePdfModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var m = document.getElementById("wb-sign-queue-pdf-modal");
      if (m && !m.hidden) closeSignQueuePdfModal();
    });
  }

  function bindApplicantPdfViewer() {
    if (window.__wbVaPdfViewerBound) return;
    window.__wbVaPdfViewerBound = true;
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-va-pdf-close]")) {
        closeApplicantPdfModal();
        return;
      }
      var row = e.target.closest(".wb-va-doc-row");
      var list = e.target.closest("[data-va-docs-list]");
      if (!row || !list) return;
      var main = document.querySelector('[data-ws-main="/view-applicant"]');
      if (!main || main.hidden) return;
      var file = row.getAttribute("data-va-doc-file");
      if (!file) return;
      openApplicantPdfModal(file);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var modal = document.getElementById("wb-va-pdf-modal");
      if (modal && !modal.hidden) closeApplicantPdfModal();
    });
  }

  function bindDocumentsLibraryPdf() {
    if (window.__wbDocsPdfViewerBound) return;
    window.__wbDocsPdfViewerBound = true;
    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-docs-pdf-close]")) {
        closeDocumentsPdfModal();
        return;
      }
      var btn = e.target.closest(".wb-docs-table__action:not(.wb-docs-table__action--danger)");
      if (!btn) return;
      var tr = btn.closest("tr");
      var tbody = document.querySelector("[data-docs-table-body]");
      if (!tr || !tbody || !tbody.contains(tr)) return;
      var main = document.querySelector('[data-ws-main="/documents"]');
      if (!main || main.hidden) return;
      var nameEl = tr.querySelector(".wb-docs-table__name");
      var label = nameEl ? nameEl.textContent.trim() : "Document";
      openDocumentsPdfModal(label);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var modal = document.getElementById("wb-docs-pdf-modal");
      if (modal && !modal.hidden) closeDocumentsPdfModal();
    });
  }

  function bindDocumentsLibrarySearch() {
    if (window.__wbDocsSearchBound) return;
    var inp = document.querySelector("[data-docs-search-input]");
    var tbody = document.querySelector("[data-docs-table-body]");
    if (!inp || !tbody) return;
    window.__wbDocsSearchBound = true;

    function refreshDocsSearch() {
      var q = (inp.value || "").trim().toLowerCase();
      tbody.querySelectorAll("tr").forEach(function (tr) {
        if (!q) {
          tr.hidden = false;
          return;
        }
        var blob = (tr.textContent || "").toLowerCase().replace(/\s+/g, " ");
        tr.hidden = blob.indexOf(q) === -1;
      });
    }

    inp.addEventListener("input", refreshDocsSearch);
    inp.addEventListener("search", refreshDocsSearch);
  }

  function bindDocumentsSavedIncoming(search) {
    var params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
    if (params.get("saved") !== "1") return;

    var pendingRaw = null;
    try {
      pendingRaw = sessionStorage.getItem(WB_DOCS_PENDING_ROW_KEY);
    } catch (err) {}
    if (!pendingRaw) {
      cleanDocumentsSavedQueryFromUrl();
      return;
    }

    var pending;
    try {
      pending = JSON.parse(pendingRaw);
    } catch (e) {
      cleanDocumentsSavedQueryFromUrl();
      return;
    }

    var tbody = document.querySelector("[data-docs-table-body]");
    var lib = document.getElementById("docs-library");
    var banner = document.querySelector("[data-docs-save-banner]");
    if (!tbody || !lib) {
      try {
        sessionStorage.removeItem(WB_DOCS_PENDING_ROW_KEY);
      } catch (err2) {}
      cleanDocumentsSavedQueryFromUrl();
      return;
    }

    if (tbody.querySelector("[data-docs-new-row='1']")) {
      cleanDocumentsSavedQueryFromUrl();
      return;
    }

    var displayName = pending.fileName || pending.title || "Document";
    var catLabel = pending.categoryLabel || "—";

    var tr = document.createElement("tr");
    tr.className = "wb-docs-table__tr--added wb-docs-table__tr--just-saved";
    tr.setAttribute("data-docs-new-row", "1");
    tr.innerHTML =
      '<td class="wb-docs-table__cell-name">' +
      '<div class="wb-docs-table__name-inner">' +
      '<span class="wb-docs-table__file-ic" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" width="18" height="18">' +
      '<path fill="currentColor" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 1.5L18.5 8H14V3.5zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0-6h5V11H8v-1z" opacity="0.55"/></svg>' +
      "</span>" +
      '<span class="wb-docs-table__name"></span>' +
      "</div></td>" +
      "<td></td>" +
      '<td><span class="wb-docs-table__status wb-docs-table__status--indexed">Indexed</span></td>' +
      '<td class="wb-docs-table__actions">' +
      '<button type="button" class="wb-docs-table__action">Open</button>' +
      "</td>";

    tr.querySelector(".wb-docs-table__name").textContent = displayName;
    tr.querySelectorAll("td")[1].textContent = catLabel;

    tbody.insertBefore(tr, tbody.firstChild);

    if (banner) {
      banner.hidden = false;
      banner.textContent = "“" + displayName + "” was added to your library.";
    }

    window.setTimeout(function () {
      lib.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    window.setTimeout(function () {
      tr.classList.remove("wb-docs-table__tr--just-saved");
    }, 2600);

    try {
      sessionStorage.removeItem(WB_DOCS_PENDING_ROW_KEY);
    } catch (err3) {}

    cleanDocumentsSavedQueryFromUrl();
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
    var prevWsMainKey = window.__wbPrevWorkspaceMainKey;
    window.__wbPrevWorkspaceMainKey = key;
    document.querySelectorAll("[data-ws-main]").forEach(function (main) {
      main.hidden = main.getAttribute("data-ws-main") !== key;
    });
    var mainClass = "wb-dash__main";
    document.querySelectorAll("[data-ws-main]").forEach(function (main) {
      if (main.hidden) return;
      main.className =
        mainClass +
        (key === "/dashboard" ? " wb-dash__main--dashboard" : "") +
        (key === "/documents" ||
        key === "/sign-documents" ||
        key === "/document-templates" ||
        key === "/document-category" ||
        key === "/document-method" ||
        key === "/document-manual-fill" ||
        key === "/generate-ai" ||
        key === "/document-review"
          ? " wb-dash__main--documents"
          : "") +
        (key === "/create-document/templates/browse" || key === "/create-document/template-review"
          ? " wb-dash__main--sample-templates"
          : "");
    });
    if (key === "/create-document/templates/browse") updateBrowsePage(pathname);
    if (key === "/create-document/template-review") updateTemplateReviewPage(pathname, search);
    if (key === "/create-document/method") updateMethodPage(search);
    if (key === "/document-method") bindDocumentMethodPage();
    if (key === "/document-manual-fill") bindDocumentManualFillPage();
    if (key === "/generate-ai") bindGenerateAiPage();
    if (key === "/document-review") bindDocumentReviewPage();
    if (key === "/documents") bindDocumentsSavedIncoming(search);
    if (key === "/create-document/draft") updateDraftPage(search);
    if (key === "/applicants") bindApplicantsPage(search);
    if (key === "/view-applicant") bindViewApplicantPage(search);
    if (key === "/employees/add") {
      bindWorkspaceEmpAddForm();
      if (prevWsMainKey !== "/employees/add") resetWorkspaceEmpAddUi();
    }
    if (key === "/employees/teams/new") {
      bindWorkspaceEmpTeamCreateForm();
      if (prevWsMainKey !== "/employees/teams/new") resetWorkspaceEmpTeamCreateUi();
    }

    document.querySelectorAll("[data-ws-nav]").forEach(function (a) {
      var p = a.getAttribute("data-ws-nav");
      var active = pathname === p;
      if (p === "/documents" && pathname === "/sign-documents") active = true;
      if (p === "/hiring" && (pathname === "/applicants" || pathname === "/view-applicant")) active = true;
      if (
        p === "/employees" &&
        (pathname === "/employees" || pathname === "/employees/add" || pathname === "/employees/teams/new")
      )
        active = true;
      a.classList.toggle("wb-dash__nav-link--active", active);
    });

    var inCreateDocFlow =
      pathname === "/document-templates" ||
      pathname === "/document-method" ||
      pathname === "/document-manual-fill" ||
      pathname === "/generate-ai" ||
      pathname === "/document-review" ||
      (pathname.indexOf("/create-document/") === 0 &&
        pathname !== "/create-document/category" &&
        pathname !== "/create-document/template" &&
        pathname !== "/document-category");
    document.querySelectorAll(
      'a.wb-dash__btn--primary[href*="create-document"], a.wb-dash__btn--primary[href*="document-category"], a.wb-dash__btn--primary[href*="document-templates"], a.wb-dash__btn--primary[href*="document-method"], a.wb-dash__btn--primary[href*="document-manual-fill"], a.wb-dash__btn--primary[href*="generate-ai"], a.wb-dash__btn--primary[href*="document-review"]'
    ).forEach(function (a) {
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

    if (isApplicantsHtmlDoc()) {
      var rawAp = window.location.hash.replace(/^#/, "");
      if (rawAp.charAt(0) === "!") rawAp = rawAp.slice(1);
      var pathAp = rawAp.charAt(0) === "/";
      if (!rawAp || rawAp === "/" || !pathAp) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/applicants"
        );
      }
    }

    if (isViewApplicantHtmlDoc()) {
      var rawVa = window.location.hash.replace(/^#/, "");
      if (rawVa.charAt(0) === "!") rawVa = rawVa.slice(1);
      var pathVa = rawVa.charAt(0) === "/";
      if (!rawVa || rawVa === "/" || !pathVa) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/view-applicant"
        );
      }
    }

    if (isCreateDocumentHtmlDoc()) {
      var rawC = window.location.hash.replace(/^#/, "");
      if (rawC.charAt(0) === "!") rawC = rawC.slice(1);
      var pathC = rawC.charAt(0) === "/";
      if (!rawC || rawC === "/" || !pathC) {
        window.location.replace("document-category.html");
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

    if (isSignDocumentsHtmlDoc()) {
      var rawSign = window.location.hash.replace(/^#/, "");
      if (rawSign.charAt(0) === "!") rawSign = rawSign.slice(1);
      var pathSign = rawSign.charAt(0) === "/";
      if (!rawSign || rawSign === "/" || !pathSign) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search + "#/sign-documents"
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

    if (isDocumentCategoryHtmlDoc() && parsed.kind === "marketing") {
      showWorkspacePage("/document-category", "");
      window.scrollTo(0, 0);
      return;
    }

    if (isDocumentTemplatesHtmlDoc() && parsed.kind === "marketing") {
      showWorkspacePage("/document-templates", "");
      bindDocumentTemplatesPage();
      window.scrollTo(0, 0);
      return;
    }

    if (isDocumentMethodHtmlDoc() && parsed.kind === "marketing") {
      showWorkspacePage("/document-method", "");
      window.scrollTo(0, 0);
      return;
    }

    if (isDocumentManualFillHtmlDoc() && parsed.kind === "marketing") {
      showWorkspacePage("/document-manual-fill", "");
      window.scrollTo(0, 0);
      return;
    }

    if (isDocumentReviewHtmlDoc() && parsed.kind === "marketing") {
      showWorkspacePage("/document-review", "");
      window.scrollTo(0, 0);
      return;
    }

    if (isGenerateAiHtmlDoc() && parsed.kind === "marketing") {
      showWorkspacePage("/generate-ai", "");
      window.scrollTo(0, 0);
      return;
    }

    if (isDashboardHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isHiringHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isApplicantsHtmlDoc() && parsed.kind === "marketing") {
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isViewApplicantHtmlDoc() && parsed.kind === "marketing") {
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

    if (isSignDocumentsHtmlDoc() && parsed.kind === "marketing") {
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

    if (
      isCreateDocumentHtmlDoc() &&
      (pathname === "/create-document/template" ||
        pathname === "/create-document/category" ||
        pathname === "/document-category")
    ) {
      window.location.replace("document-category.html");
      return;
    }

    if (
      isDocumentCategoryHtmlDoc() &&
      pathname !== "/document-category" &&
      pathname !== "/create-document/category" &&
      pathname !== "/create-document/template"
    ) {
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(
          "create-document.html" + (window.location.hash || "#/create-document/templates/company")
        );
        return;
      }
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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

    if (isDocumentTemplatesHtmlDoc() && parsed.kind === "path") {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
        window.location.replace(createDocumentPathHref(pathname, ""));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isDocumentMethodHtmlDoc() && parsed.kind === "path") {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
        window.location.replace(createDocumentPathHref(pathname, ""));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isDocumentManualFillHtmlDoc() && parsed.kind === "path") {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
        window.location.replace(createDocumentPathHref(pathname, ""));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isDocumentReviewHtmlDoc() && parsed.kind === "path") {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
        window.location.replace(createDocumentPathHref(pathname, ""));
        return;
      }
      if (pathname === "/document-review") {
        showWorkspacePage("/document-review", search);
        window.scrollTo(0, 0);
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isGenerateAiHtmlDoc() && parsed.kind === "path") {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
        window.location.replace(createDocumentPathHref(pathname, ""));
        return;
      }
      if (pathname === "/generate-ai") {
        showWorkspacePage("/generate-ai", search);
        window.scrollTo(0, 0);
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isCreateDocumentShellDoc() && isCreateDocumentPath(pathname)) {
      window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
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
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
    if (!isSignDocumentsHtmlDoc() && isSignDocumentsPath(pathname)) {
      window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
      return;
    }
    if (isDocumentsHtmlDoc() && !isDocumentsPath(pathname)) {
      if (isSignDocumentsPath(pathname)) {
        window.location.replace(
          "sign-documents.html" + (window.location.hash || "#/sign-documents")
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
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
        return;
      }
      if (isEmployeesPath(pathname)) {
        window.location.replace("employees.html" + (window.location.hash || "#/employees"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isSignDocumentsHtmlDoc() && !isSignDocumentsPath(pathname)) {
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
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
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
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
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
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isSignDocumentsPath(pathname)) {
        window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
        return;
      }
      if (isDocumentsPath(pathname)) {
        window.location.replace("documents.html" + (window.location.hash || "#/documents"));
        return;
      }
      if (isCreateDocumentPath(pathname)) {
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (!isViewApplicantHtmlDoc() && isViewApplicantPath(pathname)) {
      window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
      return;
    }

    if (!isApplicantsHtmlDoc() && isApplicantsPath(pathname)) {
      window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
      return;
    }

    if (!isHiringHtmlDoc() && isHiringPath(pathname)) {
      window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
      return;
    }
    if (isHiringHtmlDoc() && !isHiringPath(pathname)) {
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isSignDocumentsPath(pathname)) {
        window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
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
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isApplicantsHtmlDoc() && !isApplicantsPath(pathname)) {
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
        return;
      }
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isSignDocumentsPath(pathname)) {
        window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
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
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
        return;
      }
      window.location.replace("index.html" + (window.location.hash || "#/"));
      return;
    }

    if (isViewApplicantHtmlDoc() && !isViewApplicantPath(pathname)) {
      if (isDashboardHubPath(pathname)) {
        window.location.replace("dashboard.html" + (window.location.hash || "#/dashboard"));
        return;
      }
      if (isSettingsHubPath(pathname)) {
        window.location.replace("settings.html" + (window.location.hash || "#/settings/profile"));
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isSignDocumentsPath(pathname)) {
        window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
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
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
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
    if (isDashboardHtmlDoc() && isViewApplicantPath(pathname)) {
      window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
      return;
    }
    if (isDashboardHtmlDoc() && isApplicantsPath(pathname)) {
      window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
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
    if (isDashboardHtmlDoc() && isSignDocumentsPath(pathname)) {
      window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
      return;
    }
    if (isDashboardHtmlDoc() && isEmployeesPath(pathname)) {
      window.location.replace("employees.html" + (window.location.hash || "#/employees"));
      return;
    }
    if (isDashboardHtmlDoc() && isCreateDocumentPath(pathname)) {
      window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
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
      if (isApplicantsPath(pathname)) {
        window.location.replace("applicants.html" + (window.location.hash || "#/applicants"));
        return;
      }
      if (isViewApplicantPath(pathname)) {
        window.location.replace("viewapplicant.html" + (window.location.hash || "#/view-applicant"));
        return;
      }
      if (isHiringPath(pathname)) {
        window.location.replace("hiring.html" + (window.location.hash || "#/hiring"));
        return;
      }
      if (isSignDocumentsPath(pathname)) {
        window.location.replace("sign-documents.html" + (window.location.hash || "#/sign-documents"));
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
        window.location.replace(createDocumentPathHref(pathname, "#/create-document/category"));
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
    } else if (
      (pathname === "/document-category" ||
        pathname === "/create-document/category" ||
        pathname === "/create-document/template") &&
      isDocumentCategoryHtmlDoc()
    ) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (isCreateDocumentPath(pathname) && isCreateDocumentHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (pathname === "/hiring" && isHiringHtmlDoc()) {
      showWorkspacePage(pathname, search);
      syncHiringPageView();
      window.scrollTo(0, 0);
    } else if (pathname === "/applicants" && isApplicantsHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (pathname === "/view-applicant" && isViewApplicantHtmlDoc()) {
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
      var savedQ = new URLSearchParams(String(search || "").replace(/^\?/, "")).get("saved");
      if (savedQ !== "1") {
      window.scrollTo(0, 0);
      }
    } else if (pathname === "/sign-documents" && isSignDocumentsHtmlDoc()) {
      showWorkspacePage(pathname, search);
      window.scrollTo(0, 0);
    } else if (
      (pathname === "/employees" ||
        pathname === "/employees/add" ||
        pathname === "/employees/teams/new") &&
      isEmployeesHtmlDoc()
    ) {
      showWorkspacePage(pathname, search);
      if (pathname === "/employees") syncEmployeePortalView();
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
    var thanks = document.getElementById("demo-request-thanks");
    var slot = document.getElementById("demo-request-form-slot");
    var resetBtn = document.getElementById("demo-request-reset");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (slot) slot.classList.add("wb-demo__form-slot--success");
      if (thanks) thanks.hidden = false;
      if (thanks) thanks.focus();
    });
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        form.reset();
        if (thanks) thanks.hidden = true;
        if (slot) slot.classList.remove("wb-demo__form-slot--success");
        var first = form.querySelector("input, textarea, select, button");
        if (first) first.focus();
      });
    }
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

  function applyEmployeePortalRoleListFilter(root) {
    var block = root.querySelector('[data-emp-filter-block="role"]');
    if (!block) return;
    var inp = block.querySelector("[data-emp-role-search]");
    var q = (inp && inp.value ? inp.value : "").trim().toLowerCase();
    block.querySelectorAll(".wb-hiring__checks > li").forEach(function (li) {
      if (!q) {
        li.hidden = false;
        return;
      }
      var t = (li.textContent || "").toLowerCase().replace(/\s+/g, " ");
      li.hidden = t.indexOf(q) === -1;
    });
  }

  function applyEmployeePortalToolbarFilter(root) {
    var inp = root.querySelector("[data-emp-toolbar-search]");
    var q = (inp && inp.value ? inp.value : "").trim().toLowerCase();
    if (!q) {
      root.querySelectorAll(".wb-emp-team__row").forEach(function (li) {
        li.hidden = false;
      });
      root.querySelectorAll(".wb-emp-team").forEach(function (article) {
        article.hidden = false;
      });
      root.querySelectorAll(".wb-emp-card").forEach(function (card) {
        card.hidden = false;
      });
      return;
    }
    root.querySelectorAll(".wb-emp-team__row").forEach(function (li) {
      var name = (li.getAttribute("data-emp-name") || "").toLowerCase();
      var roleEl = li.querySelector(".wb-emp-team__role");
      var rtxt = roleEl ? roleEl.textContent.trim().toLowerCase() : "";
      var blob = (name + " " + rtxt).replace(/\s+/g, " ");
      li.hidden = blob.indexOf(q) === -1;
    });
    root.querySelectorAll(".wb-emp-team").forEach(function (article) {
      var rows = article.querySelectorAll(".wb-emp-team__row");
      var anyVisible = false;
      for (var k = 0; k < rows.length; k++) {
        if (!rows[k].hidden) {
          anyVisible = true;
          break;
        }
      }
      article.hidden = !anyVisible;
    });
    root.querySelectorAll(".wb-emp-card").forEach(function (card) {
      var name = (card.getAttribute("data-emp-name") || "").toLowerCase();
      var title = card.querySelector(".wb-emp-card__title");
      var tags = card.querySelector(".wb-emp-card__tags");
      var blob =
        name +
        " " +
        (title ? title.textContent.trim().toLowerCase() : "") +
        " " +
        (tags ? tags.textContent.trim().toLowerCase() : "");
      blob = blob.replace(/\s+/g, " ");
      card.hidden = blob.indexOf(q) === -1;
    });
  }

  function updateEmployeePortalCountMessages(root) {
    var snap = root.__wbEmpCountSnap;
    var inp = root.querySelector("[data-emp-toolbar-search]");
    var q = (inp && inp.value ? inp.value : "").trim();
    var tEl = root.querySelector(".wb-emp-teams__count");
    var gEl = root.querySelector(".wb-emp-grid__count");
    if (!q && snap) {
      if (tEl && snap.teams) tEl.innerHTML = snap.teams;
      if (gEl && snap.grid) gEl.innerHTML = snap.grid;
      return;
    }
    var nTeams = 0;
    root.querySelectorAll(".wb-emp-team").forEach(function (a) {
      if (!a.hidden) nTeams++;
    });
    if (tEl) tEl.innerHTML = "Showing <strong>" + nTeams + "</strong> teams";
    var nCards = 0;
    var totalCards = 0;
    root.querySelectorAll(".wb-emp-card").forEach(function (c) {
      totalCards++;
      if (!c.hidden) nCards++;
    });
    if (gEl) {
      gEl.innerHTML =
        "Showing <strong>" +
        nCards +
        "</strong> of <strong>" +
        (totalCards || nCards) +
        "</strong> employees";
    }
  }

  function refreshEmployeePortalSearchUi(root) {
    if (!root) return;
    applyEmployeePortalRoleListFilter(root);
    applyEmployeePortalToolbarFilter(root);
    applyEmployeePortalSort(root, getEmployeePortalSortModeFromDom(root));
    updateEmployeePortalCountMessages(root);
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
      var vis = [];
      var hid = [];
      rows.forEach(function (li) {
        (li.hidden ? hid : vis).push(li);
      });
      vis.sort(cmp);
      hid.sort(cmp);
      vis.concat(hid).forEach(function (li) {
        ul.appendChild(li);
      });
    });
    var grid = root.querySelector(".wb-emp-grid");
    if (grid) {
      var cards = collectGridCards(grid);
      var visC = [];
      var hidC = [];
      cards.forEach(function (c) {
        (c.hidden ? hidC : visC).push(c);
      });
      visC.sort(cmp);
      hidC.sort(cmp);
      visC.concat(hidC).forEach(function (art) {
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
    refreshEmployeePortalSearchUi(root);
  }

  function resetWorkspaceEmpAddUi() {
    var form = document.getElementById("wb-emp-add-form");
    var thanks = document.getElementById("wb-emp-add-thanks");
    if (form) {
      form.hidden = false;
      form.reset();
    }
    if (thanks) thanks.hidden = true;
  }

  function bindWorkspaceEmpAddForm() {
    var form = document.getElementById("wb-emp-add-form");
    if (!form || form.getAttribute("data-emp-add-bound") === "1") return;
    form.setAttribute("data-emp-add-bound", "1");
    var thanks = document.getElementById("wb-emp-add-thanks");
    var another = document.getElementById("wb-emp-add-another");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.hidden = true;
      if (thanks) {
        thanks.hidden = false;
        thanks.focus();
      }
    });
    if (another) {
      another.addEventListener("click", function () {
        form.reset();
        form.hidden = false;
        if (thanks) thanks.hidden = true;
        var first = form.querySelector("input, select, textarea");
        if (first && typeof first.focus === "function") first.focus();
      });
    }
  }

  function resetWorkspaceEmpTeamCreateUi() {
    var form = document.getElementById("wb-emp-team-create-form");
    var thanks = document.getElementById("wb-emp-team-create-thanks");
    if (form) {
      form.hidden = false;
      form.reset();
    }
    if (thanks) thanks.hidden = true;
  }

  function bindWorkspaceEmpTeamCreateForm() {
    var form = document.getElementById("wb-emp-team-create-form");
    if (!form || form.getAttribute("data-emp-team-create-bound") === "1") return;
    form.setAttribute("data-emp-team-create-bound", "1");
    var thanks = document.getElementById("wb-emp-team-create-thanks");
    var another = document.getElementById("wb-emp-team-create-another");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.hidden = true;
      if (thanks) {
        thanks.hidden = false;
        thanks.focus();
      }
    });
    if (another) {
      another.addEventListener("click", function () {
        form.reset();
        form.hidden = false;
        if (thanks) thanks.hidden = true;
        var first = form.querySelector("input, select, textarea");
        if (first && typeof first.focus === "function") first.focus();
      });
    }
  }

  function syncEmployeePortalView() {
    if (!isEmployeesHtmlDoc()) return;
    var p = parseHash();
    if (p.kind !== "path" || p.pathname !== "/employees") return;
    var q = new URLSearchParams((p.search || "").replace(/^\?/, ""));
    applyEmployeePortalView(q.get("view") === "grid" ? "grid" : "teams");
  }

  function tplPageCount(fileName) {
    if (FILE_PAGE_COUNT[fileName]) return FILE_PAGE_COUNT[fileName];
    return 4 + (fileName.length % 4);
  }

  function bindDocumentTemplatesPage() {
    var root = document.querySelector("[data-doc-tpl-root]");
    if (!root || root.getAttribute("data-doc-tpl-ready") === "1") return;
    root.setAttribute("data-doc-tpl-ready", "1");
    var grid = root.querySelector("[data-doc-tpl-grid]");
    var emptyEl = root.querySelector("[data-doc-tpl-empty]");
    var titleEl = document.querySelector("[data-doc-tpl-title]");
    var ledeEl = document.querySelector("[data-doc-tpl-lede]");
    var crumbCat = document.querySelector("[data-doc-tpl-crumb-cat]");
    var lb = document.querySelector("[data-doc-tpl-lightbox]");
    if (!grid || !lb) return;

    var params = new URLSearchParams(window.location.search.replace(/^\?/, ""));
    var cat = params.get("category") || "";
    var rows = TEMPLATE_BROWSE_LIST[cat];
    if (!rows) {
      window.location.replace("document-category.html");
      return;
    }

    var catLabel = CAT_LABEL[cat] || cat;
    if (titleEl) titleEl.textContent = catLabel;
    if (crumbCat) crumbCat.textContent = catLabel;
    document.title = catLabel + " — Templates — Workbench HR";
    if (ledeEl) {
      ledeEl.textContent =
        "Preview placeholders for each file. Enlarge to flip pages, then select a template to continue.";
    }

    var selectedFile = "";
    var lbIdx = 0;
    var lbRow = null;
    var lbCardRef = null;

    function sheetMarkup(pageIdx, total, templateTitle) {
      var safeTitle = escapeHtmlBrowse(templateTitle);
      var paras = "";
      var p;
      var nParas = 5 + (pageIdx % 3);
      for (p = 0; p < nParas; p++) {
        var lineCount = p === 0 ? 1 : 2 + (p % 3);
        var li;
        var block = "";
        for (li = 0; li < lineCount; li++) {
          var w = 48 + ((pageIdx * 7 + p * 11 + li * 5) % 44);
          var isHead = p === 0 && li === 0;
          block +=
            '<span class="wb-doc-tpl-sheet__line' +
            (isHead ? " wb-doc-tpl-sheet__line--head" : "") +
            '" style="width:' +
            w +
            '%"></span>';
        }
        paras += '<div class="wb-doc-tpl-sheet__para">' + block + "</div>";
      }
      return (
        '<div class="wb-doc-tpl-sheet">' +
        '<div class="wb-doc-tpl-sheet__viewer-bg">' +
        '<div class="wb-doc-tpl-sheet__page">' +
        '<div class="wb-doc-tpl-sheet__margin">' +
        '<div class="wb-doc-tpl-sheet__letterhead">' +
        '<span class="wb-doc-tpl-sheet__letterhead-logo"></span>' +
        '<span class="wb-doc-tpl-sheet__letterhead-lines">' +
        '<span class="wb-doc-tpl-sheet__letterhead-line"></span>' +
        '<span class="wb-doc-tpl-sheet__letterhead-line wb-doc-tpl-sheet__letterhead-line--short"></span>' +
        "</span>" +
        "</div>" +
        '<div class="wb-doc-tpl-sheet__title-rule"></div>' +
        '<div class="wb-doc-tpl-sheet__paras">' +
        paras +
        "</div>" +
        '<footer class="wb-doc-tpl-sheet__page-foot">' +
        '<span class="wb-doc-tpl-sheet__page-num">' +
        (pageIdx + 1) +
        " / " +
        total +
        "</span>" +
        "</footer>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<p class="wb-doc-tpl-sheet__caption">' +
        safeTitle +
        " · placeholder preview</p>" +
        "</div>"
      );
    }

    function renderLightbox() {
      if (!lbRow) return;
      var total = tplPageCount(lbRow.file);
      if (lbIdx >= total) lbIdx = total - 1;
      if (lbIdx < 0) lbIdx = 0;
      var st = lb.querySelector("[data-doc-tpl-lb-stage]");
      var meta = lb.querySelector("[data-doc-tpl-lb-meta]");
      var h = lb.querySelector("[data-doc-tpl-lb-heading]");
      var prev = lb.querySelector("[data-doc-tpl-lb-prev]");
      var next = lb.querySelector("[data-doc-tpl-lb-next]");
      if (st) st.innerHTML = sheetMarkup(lbIdx, total, lbRow.title);
      if (meta) meta.textContent = "Page " + (lbIdx + 1) + " of " + total;
      if (h) h.textContent = lbRow.title;
      var single = total <= 1;
      if (prev) {
        prev.disabled = single;
        prev.setAttribute("aria-disabled", single ? "true" : "false");
      }
      if (next) {
        next.disabled = single;
        next.setAttribute("aria-disabled", single ? "true" : "false");
      }
    }

    function openLightbox(row, cardEl) {
      lbRow = row;
      lbCardRef = cardEl || null;
      lbIdx = 0;
      renderLightbox();
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lb.hidden = true;
      lbRow = null;
      lbCardRef = null;
      document.body.style.overflow = "";
    }

    function updateContinue() {
      var a = document.querySelector("[data-doc-tpl-continue]");
      if (!a) return;
      if (!selectedFile) {
        a.setAttribute("aria-disabled", "true");
        a.setAttribute("href", "#");
      } else {
        a.setAttribute("aria-disabled", "false");
        a.setAttribute(
          "href",
          "document-method.html?category=" +
            encodeURIComponent(cat) +
            "&file=" +
            encodeURIComponent(selectedFile)
        );
      }
    }

    function setSelected(file, card) {
      selectedFile = file;
      grid.querySelectorAll(".wb-doc-tpl-card").forEach(function (c) {
        var on = c.getAttribute("data-tpl-file") === file;
        c.classList.toggle("wb-doc-tpl-card--selected", on);
        c.setAttribute("aria-selected", on ? "true" : "false");
      });
      updateContinue();
    }

    if (emptyEl) emptyEl.hidden = true;
    grid.innerHTML = "";
    rows.forEach(function (row) {
      var pages = tplPageCount(row.file);
      var art = document.createElement("article");
      art.className = "wb-doc-tpl-card";
      art.setAttribute("role", "listitem");
      art.setAttribute("data-tpl-file", row.file);
      art.setAttribute("tabindex", "0");
      art.setAttribute("aria-selected", "false");
      art.innerHTML =
        '<div class="wb-doc-tpl-card__toolbar">' +
        '<button type="button" class="wb-doc-tpl-card__zoom" data-doc-tpl-zoom aria-label="Enlarge preview">⤢</button>' +
        "</div>" +
        '<div class="wb-doc-tpl-card__preview">' +
        '<div class="wb-doc-tpl-card__thumb" aria-hidden="true">' +
        '<div class="wb-doc-tpl-card__thumb-shadow"></div>' +
        '<div class="wb-doc-tpl-card__thumb-page">' +
        '<div class="wb-doc-tpl-card__thumb-margin">' +
        '<span class="wb-doc-tpl-card__thumb-head"></span>' +
        '<span class="wb-doc-tpl-card__thumb-line wb-doc-tpl-card__thumb-line--title"></span>' +
        '<span class="wb-doc-tpl-card__thumb-line"></span>' +
        '<span class="wb-doc-tpl-card__thumb-line wb-doc-tpl-card__thumb-line--mid"></span>' +
        '<span class="wb-doc-tpl-card__thumb-line wb-doc-tpl-card__thumb-line--short"></span>' +
        "</div></div></div></div>" +
        '<div class="wb-doc-tpl-card__footer">' +
        "<h3 class=\"wb-doc-tpl-card__name\">" +
        row.title +
        "</h3>" +
        '<p class="wb-doc-tpl-card__file">' +
        row.file +
        "</p>" +
        '<span class="wb-doc-tpl-card__badge">' +
        pages +
        " pages · preview</span></div>";

      art.addEventListener("click", function (e) {
        if (e.target.closest("[data-doc-tpl-zoom]")) return;
        setSelected(row.file, art);
      });
      art.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setSelected(row.file, art);
        }
      });
      art.querySelector("[data-doc-tpl-zoom]").addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(row, art);
      });
      grid.appendChild(art);
    });

    lb.querySelectorAll("[data-doc-tpl-lb-close]").forEach(function (btn) {
      btn.addEventListener("click", closeLightbox);
    });

    var prevB = lb.querySelector("[data-doc-tpl-lb-prev]");
    var nextB = lb.querySelector("[data-doc-tpl-lb-next]");
    if (prevB) {
      prevB.addEventListener("click", function () {
        if (!lbRow) return;
        var t = tplPageCount(lbRow.file);
        if (t <= 1) return;
        lbIdx = (lbIdx - 1 + t) % t;
        renderLightbox();
      });
    }
    if (nextB) {
      nextB.addEventListener("click", function () {
        if (!lbRow) return;
        var t = tplPageCount(lbRow.file);
        if (t <= 1) return;
        lbIdx = (lbIdx + 1) % t;
        renderLightbox();
      });
    }

    var selBtn = lb.querySelector("[data-doc-tpl-lb-select]");
    if (selBtn) {
      selBtn.addEventListener("click", function () {
        if (!lbRow) return;
        if (lbCardRef) setSelected(lbRow.file, lbCardRef);
        else {
          var match = grid.querySelector('[data-tpl-file="' + lbRow.file + '"]');
          setSelected(lbRow.file, match);
        }
        closeLightbox();
      });
    }

    document.addEventListener("keydown", function docTplKey(e) {
      if (lb.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft" && prevB && !prevB.disabled) prevB.click();
      if (e.key === "ArrowRight" && nextB && !nextB.disabled) nextB.click();
    });

    updateContinue();
  }

  function bindCreateDocumentTemplateStep() {
    var root = document.querySelector('[data-ws-main="/document-category"]');
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
        "document-templates.html?category=" + encodeURIComponent(id)
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

  function getHiringSortModeFromDom(root) {
    var pill = root.querySelector("[data-hiring-sort].wb-hiring__sort-pill--active");
    var m = pill ? pill.getAttribute("data-hiring-sort") : "";
    return m === "date" ? "date" : "name";
  }

  function applyHiringSort(root, sortMode) {
    var box = root.querySelector("[data-hiring-cards]");
    if (!box) return;
    var cards = Array.prototype.slice.call(box.querySelectorAll("[data-hiring-card]"));
    var byName = sortMode !== "date";
    cards.sort(function (a, b) {
      var at = (a.getAttribute("data-hiring-title") || "").toLowerCase();
      var bt = (b.getAttribute("data-hiring-title") || "").toLowerCase();
      if (byName) {
        if (at < bt) return -1;
        if (at > bt) return 1;
        return 0;
      }
      var ad = Date.parse(a.getAttribute("data-hiring-posted") || "") || 0;
      var bd = Date.parse(b.getAttribute("data-hiring-posted") || "") || 0;
      if (ad !== bd) return bd - ad;
      if (at < bt) return -1;
      if (at > bt) return 1;
      return 0;
    });
    cards.forEach(function (c) {
      box.appendChild(c);
    });
  }

  function applyHiringView(root, mode) {
    var cards = root.querySelector("[data-hiring-cards]");
    if (!cards) return;
    var grid = mode === "grid";
    cards.classList.toggle("wb-hiring__cards--grid", grid);
    cards.classList.toggle("wb-hiring__cards--list", !grid);
    root.querySelectorAll("[data-hiring-view-toggle]").forEach(function (btn) {
      var on = (btn.getAttribute("data-hiring-view-toggle") || "") === mode;
      btn.classList.toggle("wb-hiring__view-btn--active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function syncHiringPageView() {
    if (!isHiringHtmlDoc()) return;
    var p = parseHash();
    if (p.kind !== "path" || p.pathname !== "/hiring") return;
    var root = document.querySelector("[data-hiring-root]");
    if (!root) return;
    var q = new URLSearchParams((p.search || "").replace(/^\?/, ""));
    applyHiringView(root, q.get("view") === "grid" ? "grid" : "list");
  }

  function getHiringToolbarQuery(root) {
    var inp = root.querySelector("[data-hiring-toolbar-search]");
    return (inp && inp.value ? inp.value : "").trim().toLowerCase();
  }

  function getHiringSelectedInBlock(root, block) {
    var el = root.querySelector('[data-hiring-filter-block="' + block + '"]');
    if (!el) return [];
    var out = [];
    el.querySelectorAll('input[type="checkbox"][data-hiring-value]').forEach(function (cb) {
      if (cb.checked) out.push(cb.getAttribute("data-hiring-value") || "");
    });
    return out.filter(Boolean);
  }

  function hiringCardMatchesFilters(card, root) {
    var q = getHiringToolbarQuery(root);
    var title = (card.getAttribute("data-hiring-title") || "").toLowerCase();
    if (q && title.indexOf(q) === -1) return false;

    var rolesSel = getHiringSelectedInBlock(root, "role");
    if (rolesSel.length) {
      var rolesAttr = card.getAttribute("data-hiring-roles") || "";
      var tokens = rolesAttr.split(",").map(function (s) {
        return s.trim();
      }).filter(Boolean);
      var hit = false;
      for (var i = 0; i < rolesSel.length; i++) {
        if (tokens.indexOf(rolesSel[i]) !== -1) {
          hit = true;
          break;
        }
      }
      if (!hit) return false;
    }

    var contrSel = getHiringSelectedInBlock(root, "contract");
    if (contrSel.length) {
      var c = card.getAttribute("data-hiring-contract") || "";
      if (contrSel.indexOf(c) === -1) return false;
    }

    var statSel = getHiringSelectedInBlock(root, "status");
    if (statSel.length) {
      var st = card.getAttribute("data-hiring-status") || "";
      if (statSel.indexOf(st) === -1) return false;
    }

    return true;
  }

  function applyHiringRoleListFilter(root) {
    var block = root.querySelector('[data-hiring-filter-block="role"]');
    if (!block) return;
    var inp = block.querySelector("[data-hiring-role-search]");
    var q = (inp && inp.value ? inp.value : "").trim().toLowerCase();
    block.querySelectorAll(".wb-hiring__checks > li").forEach(function (li) {
      if (!q) {
        li.hidden = false;
        return;
      }
      var t = (li.textContent || "").toLowerCase().replace(/\s+/g, " ");
      li.hidden = t.indexOf(q) === -1;
    });
  }

  function updateHiringCountMsg(root) {
    var msg = root.querySelector("[data-hiring-count-msg]");
    if (!msg) return;
    var n = 0;
    root.querySelectorAll("[data-hiring-card]").forEach(function (c) {
      if (!c.hidden) n++;
    });
    msg.textContent = "Showing " + n + " " + (n === 1 ? "posting" : "postings");
  }

  function applyHiringFiltersAndSort(root) {
    if (!root) return;
    applyHiringRoleListFilter(root);
    applyHiringSort(root, getHiringSortModeFromDom(root));
    root.querySelectorAll("[data-hiring-card]").forEach(function (card) {
      card.hidden = !hiringCardMatchesFilters(card, root);
    });
    updateHiringCountMsg(root);
  }

  function bindHiringPage() {
    if (!isHiringHtmlDoc()) return;
    var root = document.querySelector("[data-hiring-root]");
    if (!root || root.getAttribute("data-hiring-bound") === "1") return;
    root.setAttribute("data-hiring-bound", "1");

    function refresh() {
      applyHiringFiltersAndSort(root);
    }

    root.querySelectorAll("[data-hiring-sort]").forEach(function (pill) {
      pill.addEventListener("click", function () {
        var mode = pill.getAttribute("data-hiring-sort") || "name";
        root.querySelectorAll("[data-hiring-sort]").forEach(function (p) {
          var on = p === pill;
          p.classList.toggle("wb-hiring__sort-pill--active", on);
          p.setAttribute("aria-pressed", on ? "true" : "false");
        });
        refresh();
      });
    });

    root.querySelectorAll("[data-hiring-view-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var mode = btn.getAttribute("data-hiring-view-toggle") || "list";
        applyHiringView(root, mode === "grid" ? "grid" : "list");
        var base = window.location.pathname + window.location.search;
        window.history.replaceState(null, "", base + (mode === "grid" ? "#/hiring?view=grid" : "#/hiring"));
      });
    });

    var ts = root.querySelector("[data-hiring-toolbar-search]");
    if (ts) ts.addEventListener("input", refresh);

    var rs = root.querySelector("[data-hiring-role-search]");
    if (rs) rs.addEventListener("input", refresh);

    root.querySelectorAll('[data-hiring-filter-block] input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", refresh);
    });

    root.querySelectorAll("[data-hiring-filter-clear]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var block = btn.closest("[data-hiring-filter-block]");
        if (!block) return;
        block.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          cb.checked = false;
        });
        var s = block.querySelector("[data-hiring-role-search]");
        if (s) s.value = "";
        refresh();
      });
    });

    syncHiringPageView();
    refresh();
  }

  function bindEmployeePortalView() {
    var root = document.querySelector("[data-emp-portal]");
    if (!root) return;
    if (!root.__wbEmpCountSnap) {
      var te = root.querySelector(".wb-emp-teams__count");
      var ge = root.querySelector(".wb-emp-grid__count");
      root.__wbEmpCountSnap = { teams: te ? te.innerHTML : "", grid: ge ? ge.innerHTML : "" };
    }
    if (root.getAttribute("data-emp-portal-bound") !== "1") {
      root.setAttribute("data-emp-portal-bound", "1");
      root.querySelectorAll("[data-emp-sort]").forEach(function (pill) {
        pill.addEventListener("click", function () {
          var mode = pill.getAttribute("data-emp-sort") || "name";
          root.querySelectorAll("[data-emp-sort]").forEach(function (p) {
            var on = p === pill;
            p.classList.toggle("wb-hiring__sort-pill--active", on);
            p.setAttribute("aria-pressed", on ? "true" : "false");
          });
          refreshEmployeePortalSearchUi(root);
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
      var toolbarSearch = root.querySelector("[data-emp-toolbar-search]");
      if (toolbarSearch) {
        toolbarSearch.addEventListener("input", function () {
          refreshEmployeePortalSearchUi(root);
        });
        toolbarSearch.addEventListener("search", function () {
          refreshEmployeePortalSearchUi(root);
        });
      }
      var roleSearch = root.querySelector("[data-emp-role-search]");
      if (roleSearch) {
        roleSearch.addEventListener("input", function () {
          refreshEmployeePortalSearchUi(root);
        });
        roleSearch.addEventListener("search", function () {
          refreshEmployeePortalSearchUi(root);
        });
      }
      root.querySelectorAll("[data-emp-filter-clear]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var block = btn.closest("[data-emp-filter-block]");
          if (!block) return;
          block.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
            cb.checked = false;
          });
          var s = block.querySelector("[data-emp-role-search]");
          if (s) s.value = "";
          refreshEmployeePortalSearchUi(root);
        });
      });
    }
    refreshEmployeePortalSearchUi(root);
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
    bindHiringPage();
    bindApplicantPdfViewer();
    bindDocumentsLibraryPdf();
    bindDocumentsLibrarySearch();
    bindSignReminderModal();
    bindNudgeModal();
    bindDashboardUpcoming();
    bindDashboardHiringPipeline();
    bindSignQueuePage();
    bindViewApplicantDocsControls();

    window.addEventListener("hashchange", function () {
      closeProfileDeleteModal();
      closeApplicantPdfModal();
      closeDocumentsPdfModal();
      closeSignReminderModal();
      closeNudgeModal();
      closeSignQueuePdfModal();
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
