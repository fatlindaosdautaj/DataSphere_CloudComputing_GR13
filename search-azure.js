const ACS_CONFIG = {
  serviceName: "datasphereproject1",
  indexName:   "datasphere-content",
  queryKey:    "secret-key",
  apiVersion:  "2023-11-01",
};



function buildSearchBody(query, typeFilter, levelFilter, skip = 0, top = 20) {
  const body = {
    search: query && query.trim() !== "" ? query.trim() : "*",
    searchMode: "any",
    queryType: "simple",
    filter: buildODataFilter(typeFilter, levelFilter),
    select: "id,type,level,topic,title,description,readTime,path",
    highlight: "title,description",
    highlightPreTag: "<em>",
    highlightPostTag: "</em>",
    top,
    skip,
    count: true,
  };

  return body;
}

function buildODataFilter(typeFilter, levelFilter) {
  const clauses = [];
  if (typeFilter && typeFilter !== "all") {
    clauses.push(`type eq '${typeFilter}'`);
  }
  if (levelFilter && levelFilter !== "all") {
    clauses.push(`level eq '${levelFilter}'`);
  }

  return clauses.length > 0 ? clauses.join(" and ") : null;
}

async function searchAzure(query, typeFilter, levelFilter, skip = 0) {
  const endpoint =
    `https://${ACS_CONFIG.serviceName}.search.windows.net` +
    `/indexes/${ACS_CONFIG.indexName}/docs/search` +
    `?api-version=${ACS_CONFIG.apiVersion}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": ACS_CONFIG.queryKey,
    },
    body: JSON.stringify(buildSearchBody(query, typeFilter, levelFilter, skip)),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Azure Search error ${response.status}: ${err?.error?.message || response.statusText}`
    );
  }

  return response.json();
}

function renderResultCard(doc) {
  const typeBadgeMap = {
    tutorial: "tutorial-badge",
    article:  "article-badge",
    video:    "video-badge",
    book:     "book-badge",
  };
  const levelBadgeMap = {
    beginner:     "beginner",
    intermediate: "intermediate",
    advanced:     "advanced",
  };

  const highlightedTitle =
    doc["@search.highlights"]?.title?.[0] || escapeHtml(doc.title);
  const highlightedDesc =
    doc["@search.highlights"]?.description?.[0] || escapeHtml(doc.description);

  return `
    <div class="search-result-item">
      <div class="search-result-type">
        <span class="featured-type ${typeBadgeMap[doc.type] || ""}">${doc.type}</span>
        <span class="tag-sm ${levelBadgeMap[doc.level] || ""}">${doc.level}</span>
        ${doc.topic ? `<span class="tag-sm" style="background:var(--ink-7);color:var(--ink-3)">${doc.topic}</span>` : ""}
      </div>
      <h3><a href="${escapeHtml(doc.path)}">${highlightedTitle}</a></h3>
      <p>${highlightedDesc}</p>
      ${doc.readTime ? `<span style="font-size:12px;color:var(--ink-4);margin-top:4px;display:block">${escapeHtml(doc.readTime)}</span>` : ""}
    </div>`;
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


async function renderSearchResults(query, typeFilter, levelFilter) {
  const resultsContainer = document.getElementById("searchResultsList");
  const resultsHeader    = document.getElementById("resultsHeader");
  if (!resultsContainer) return
  resultsHeader.textContent = "Searching…";
  resultsContainer.innerHTML = `
    <div class="search-loading" aria-live="polite">
      <div class="loading-spinner"></div>
      <p style="color:var(--ink-3);font-size:14px;margin-top:12px">Querying Azure Search…</p>
    </div>`;

  try {
    const data = await searchAzure(query, typeFilter, levelFilter);

    const totalCount = data["@odata.count"] ?? data.value.length;
    const results    = data.value
    resultsHeader.textContent = query && query.trim()
      ? `${totalCount} result${totalCount !== 1 ? "s" : ""} for "${query}"`
      : `${totalCount} resource${totalCount !== 1 ? "s" : ""}`;

    if (results.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <p>No results found${query ? ` for "<strong>${escapeHtml(query)}</strong>"` : ""}.</p>
          <p style="font-size:14px;margin-top:8px">Try different keywords or clear the filters above.</p>
        </div>`;
      return;
    }


    resultsContainer.innerHTML = results.map(renderResultCard).join("");

  } catch (error) {

    console.error("Azure Cognitive Search error:", error);
    resultsHeader.textContent = "Search unavailable";
    resultsContainer.innerHTML = `
      <div class="no-results" style="border-color:var(--red-light)">
        <p style="color:var(--red)">⚠ Could not reach Azure Search.</p>
        <p style="font-size:13px;margin-top:6px;color:var(--ink-3)">
          Check your service name and query key in <code>search-azure.js</code>,
          and make sure CORS is enabled in the Azure Portal for this domain.
        </p>
        <details style="margin-top:12px;font-size:12px;color:var(--ink-4)">
          <summary style="cursor:pointer">Technical details</summary>
          <pre style="margin-top:8px;white-space:pre-wrap">${escapeHtml(error.message)}</pre>
        </details>
      </div>`;
  }
}


if (document.getElementById("searchResultsList")) {
  const params      = new URLSearchParams(window.location.search);
  const q           = params.get("q") || "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput && q) searchInput.value = q;

  let activeType  = "all";
  let activeLevel = "all";


  renderSearchResults(q, activeType, activeLevel);
  document.querySelectorAll(".search-filter-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const group = this.dataset.filterGroup;
      const val   = this.dataset.filterVal;
      document.querySelectorAll(`.search-filter-btn[data-filter-group="${group}"]`)
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      if (group === "type")  activeType  = val;
      if (group === "level") activeLevel = val;
      renderSearchResults(searchInput?.value?.trim() || "", activeType, activeLevel);
    });
  });


  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const currentQuery = this.value.trim();

      const url = new URL(window.location);
      currentQuery
        ? url.searchParams.set("q", currentQuery)
        : url.searchParams.delete("q");
      window.history.replaceState({}, "", url);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        renderSearchResults(currentQuery, activeType, activeLevel);
      }, 300);
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        clearTimeout(debounceTimer);
        renderSearchResults(searchInput.value.trim(), activeType, activeLevel);
      }
    });
  }

  const searchBtn = document.getElementById("searchBtn");
  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      clearTimeout(debounceTimer);
      renderSearchResults(searchInput.value.trim(), activeType, activeLevel);
    });
  }
}
