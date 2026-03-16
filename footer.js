/* Footer renderer (Calc-HQ strict)
   - Renders footer Related Tools ONLY from network.js (CALC_HQ_NETWORK)
   - Renders ONLY entries with live:true
   - Excludes current site (by hostname)
   - Also supports an optional in-page "Related Calculators" section on tool pages
     (container id="relatedCalculators") rendered from the same network.js source.
*/
(function () {
  function getHostname(url) {
    try { return new URL(url).hostname.replace(/^www\./, ""); } catch (e) { return ""; }
  }

  function hasLiveFlags(network) {
    for (var i = 0; i < network.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(network[i], "live")) return false;
    }
    return true;
  }

  function buildLiveItems(network, currentHost) {
    return network
      .filter(function (x) {
        return x && x.live === true && typeof x.url === "string" && typeof x.name === "string";
      })
      .filter(function (x) {
        return getHostname(x.url) !== currentHost;
      });
  }

  function renderLinks(containerId, spanSelector, liveItems) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var span = container.querySelector(spanSelector);
    if (!span) return;

    if (!liveItems.length) {
      container.style.display = "none";
      return;
    }

    var parts = [];
    for (var k = 0; k < liveItems.length; k++) {
      var item = liveItems[k];
      var a = document.createElement("a");
      a.href = item.url.endsWith("/") ? item.url : (item.url + "/");
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = item.name;
      parts.push(a);
    }

    span.textContent = "";
    for (var m = 0; m < parts.length; m++) {
      span.appendChild(parts[m]);
      if (m < parts.length - 1) {
        span.appendChild(document.createTextNode(" • "));
      }
    }
  }

  function renderAll(network) {
    if (!hasLiveFlags(network)) {
      var ft = document.getElementById("relatedTools");
      if (ft) ft.style.display = "none";
      var rc = document.getElementById("relatedCalculators");
      if (rc) rc.style.display = "none";
      return;
    }

    var current = (window.location.hostname || "").replace(/^www\./, "");
    var liveItems = buildLiveItems(network, current);

    renderLinks("relatedTools", ".related-tools-links", liveItems);
    renderLinks("relatedCalculators", ".related-calculators-links", liveItems);
  }

  function boot() {
    var raw = window.CALC_HQ_NETWORK;
    var network = Array.isArray(raw) ? raw : (raw && Array.isArray(raw.relatedTools) ? raw.relatedTools : null);
    if (!Array.isArray(network)) return;
    renderAll(network);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
