/**
 * Stand-in “PDF page” previews for the static-site browse flow (SVG data URIs).
 */
(function () {
  "use strict";

  function escapeXml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function accentHueFromName(name) {
    var h = 0;
    for (var i = 0; i < name.length; i += 1) h = (h * 33 + name.charCodeAt(i)) | 0;
    return Math.abs(h) % 36;
  }

  window.docPagePreviewDataUri = function docPagePreviewDataUri(fileName, pageIndex, totalPages) {
    var total = Math.max(1, Math.min(99, totalPages | 0));
    var idx = Math.max(0, Math.min(total - 1, pageIndex | 0));
    var label = String(fileName).replace(/\.pdf$/i, "").slice(0, 36);
    var hue = 142 + accentHueFromName(fileName);
    var page = "hsl(" + hue + ", 18%, 97%)";
    var stroke = "hsl(" + hue + ",12%,88%)";
    var neutralBand = "hsl(" + hue + ", 5%, 92%)";
    var seed = idx * 17 + String(fileName).length;
    var w1 = 160 + (seed % 90);
    var w2 = 200 + ((seed * 3) % 64);
    var w3 = 140 + ((seed * 5) % 100);
    var y0 = 56 + (idx % 4) * 6;
    var showHeader = idx === 0;
    var showFooter = idx === total - 1;
    var bodyLines = 6 + (idx % 3);
    var body = "";
    var y = y0;
    for (var i = 0; i < bodyLines; i += 1) {
      var w = i % 3 === 0 ? w1 : i % 3 === 1 ? w2 : w3;
      body +=
        '<rect x="28" y="' +
        y +
        '" width="' +
        Math.min(264, w) +
        '" height="10" rx="3" fill="' +
        page +
        '" stroke="' +
        stroke +
        '" stroke-width="1"/>';
      y += 18;
    }
    var headerBlock = showHeader
      ? '<rect x="28" y="36" width="264" height="18" rx="4" fill="' +
        neutralBand +
        '" stroke="' +
        stroke +
        '" stroke-width="1"/>'
      : '<text x="160" y="46" text-anchor="middle" fill="hsl(' +
        hue +
        ',10%,38%)" font-family="system-ui,sans-serif" font-size="10" font-weight="600">' +
        escapeXml(label) +
        "</text>";
    var footerBlock = showFooter
      ? '<text x="160" y="338" text-anchor="middle" fill="hsl(' +
        hue +
        ',10%,48%)" font-family="system-ui,sans-serif" font-size="9">Signature / acknowledgment</text>'
      : "";
    var svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="420" viewBox="0 0 320 420">' +
      '<defs><filter id="sh" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.12"/></filter></defs>' +
      '<rect x="12" y="12" width="296" height="396" rx="10" fill="#fff" filter="url(#sh)"/>' +
      headerBlock +
      body +
      footerBlock +
      '<rect x="24" y="372" width="272" height="28" rx="6" fill="' +
      neutralBand +
      '" stroke="' +
      stroke +
      '" stroke-width="1"/>' +
      '<text x="160" y="384" text-anchor="middle" fill="hsl(' +
      hue +
      ',18%,36%)" font-family="system-ui,sans-serif" font-size="11" font-weight="700">' +
      escapeXml("Page " + (idx + 1) + " of " + total) +
      "</text>" +
      '<text x="160" y="398" text-anchor="middle" fill="hsl(' +
      hue +
      ',8%,48%)" font-family="system-ui,sans-serif" font-size="10">PDF preview</text>' +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  };
})();
