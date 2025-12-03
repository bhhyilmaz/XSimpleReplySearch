function Main() {
  if (window.__x_status_route_watcher_initialized) return;
  window.__x_status_route_watcher_initialized = true;

  let button = null;
  let input = null;

  function isStatusPage() {
    return /^\/[^/]+\/status\/[^/]+/.test(window.location.pathname);
  }

  function getTargetDiv() {

    const relativeDivs = document.querySelectorAll('div[style*="position: relative"]');

    for (const parent of relativeDivs) {
      const child = parent.querySelector(".css-175oi2r");
      if (child) return child;
    }

    return null;
  }

  function createUI() {

    const existingWrapper = document.getElementById("__x_search_wrapper");
    if (existingWrapper && document.body.contains(existingWrapper)) return;

    const targetDiv = getTargetDiv();
    if (!targetDiv) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.id = "__x_search_wrapper";

    Object.assign(wrapper.style, {
      display: "flex",
      gap: "8px",
      marginTop: "12px",
      padding: "20px 20px",
      alignItems: "center"
    });

    input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search in replies...";
    input.style.outline = "none";
    input.style.boxShadow = "none";

    Object.assign(input.style, {
      padding: "10px 10px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      flex: "1"
    });

    button = document.createElement("button");
    button.textContent = "Search";

    Object.assign(button.style, {
      padding: "10px 16px",
      fontSize: "14px",
      borderRadius: "6px",
      border: "none",
      cursor: "pointer"
    });

    button.addEventListener("click", () => {

      const textQuery = input.value.trim();
      if (!textQuery) return;

      const timeEl = document.querySelector("time[datetime]");
      let sinceDate = "";

      if (timeEl) {
        const datetime = timeEl.getAttribute("datetime");
        if (datetime) sinceDate = datetime.split("T")[0];
      }

      const today = new Date().toISOString().split("T")[0];

      const pathParts = window.location.pathname.split("/").filter(Boolean);
      const usernameFromUrl = pathParts.length > 0 ? pathParts[0] : "";

      let finalQuery = textQuery;
      if (usernameFromUrl) finalQuery += ` to:${usernameFromUrl}`;
      if (sinceDate) finalQuery += ` since:${sinceDate} until:${today}`;

      const encoded = encodeURIComponent(finalQuery);
      window.location.href = `https://x.com/search?q=${encoded}&f=live`;
    });

    wrapper.appendChild(input);
    wrapper.appendChild(button);
    targetDiv.appendChild(wrapper);
  }

  function removeUI() {
    const wrapper = document.getElementById("__x_search_wrapper");
    if (wrapper && wrapper.isConnected) wrapper.remove();

    if (button && button.isConnected) button.remove();
    if (input && input.isConnected) input.remove();

    button = null;
    input = null;
  }

  function updateUI() {
    if (!isStatusPage()) {
      removeUI();
      return;
    }

    const wrapper = document.getElementById("__x_search_wrapper");
    if (!wrapper || !document.body.contains(wrapper)) {
      button = null;
      input = null;
      createUI();
    }
  }

  function startRouteWatcher() {
    updateUI();

    setInterval(() => {
      updateUI();
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startRouteWatcher);
  } else {
    startRouteWatcher();
  }
}

Main();
