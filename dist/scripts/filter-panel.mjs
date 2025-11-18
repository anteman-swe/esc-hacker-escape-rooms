import { getChallengeList, putCardsInDOM } from "./index.mjs";

const filterToggle = document.querySelector("#filterToggle");
const filterPanel = document.querySelector("#filters");
const filterClose = document.querySelector(".filter-header__close");

if (filterToggle && filterPanel && filterClose) {
  // Open panel
  filterToggle.addEventListener("click", () => {
    filterPanel.hidden = false;
    filterToggle.hidden = true;
  });

  // Close panel 
  filterClose.addEventListener("click", () => {
    filterPanel.hidden = true;
    filterToggle.hidden = false;
  });

  // ESC key closes panel
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !filterPanel.hidden) {
      filterPanel.hidden = true;
      filterToggle.hidden = false;
    }
  });
}

// Base data + URL parameters
const cardsContainer = document.querySelector(".cards-grid");
const urlParams = new URLSearchParams(window.location.search);
const initialTypeParam = urlParams.get("type") || urlParams.get("filter");

let allChallenges = [];
let baseChallenges = [];

// Filter UI elements
const onlineCheckbox = document.querySelector("#f-online");
const onsiteCheckbox = document.querySelector("#f-onsite");

const filterCheckboxLabels = document.querySelectorAll("#filters .filter-checkbox");
const ratingWidgets = document.querySelectorAll(".rating-widget");
const tagButtons = document.querySelectorAll(".tag-pill");
const searchInput = document.querySelector("#f-query");

let activeTags = new Set();
let minRating = 0;
let maxRating = 5;

// Sync visual state of custom type-checkbox labels
filterCheckboxLabels.forEach((label) => {
  const input = label.querySelector(".filter-checkbox__input");
  if (!input) return;

  label.classList.toggle("is-checked", input.checked);

  label.addEventListener("click", (e) => {
    e.preventDefault();
    input.checked = !input.checked;
    label.classList.toggle("is-checked", input.checked);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
});

async function initFilters() {
  try {
    const list = await getChallengeList();
    allChallenges = Array.isArray(list) ? list : [];

    if (initialTypeParam && initialTypeParam !== "none") {
      baseChallenges = allChallenges.filter((ch) => ch.type === initialTypeParam);

      if (initialTypeParam === "online") {
        onlineCheckbox.checked = true;
        onsiteCheckbox.checked = false;
      } else if (initialTypeParam === "onsite") {
        onlineCheckbox.checked = false;
        onsiteCheckbox.checked = true;
      }
    } else {
      baseChallenges = [...allChallenges];
    }

    setupFilterEvents();
    applyFilters();
  } catch {
    cardsContainer.innerHTML = "<p>Could not load challenges</p>";
  }
}

function setupFilterEvents() {
  onlineCheckbox?.addEventListener("change", applyFilters);
  onsiteCheckbox?.addEventListener("change", applyFilters);

  ratingWidgets.forEach((widget) => {
    widget.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.classList.contains("star")) return;

      const val = Number(target.dataset.value);
      const role = widget.dataset.role;

      if (role === "min") minRating = val;
      if (role === "max") maxRating = val;

      updateStarUI(widget, val);
      applyFilters();
    });
  });

  tagButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.textContent.trim().toLowerCase();

      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove("is-active");
      } else {
        activeTags.add(tag);
        btn.classList.add("is-active");
      }

      applyFilters();
    });
  });

  searchInput?.addEventListener("input", applyFilters);
}

function applyTypeFilter(list) {
  const showOnline = onlineCheckbox.checked;
  const showOnsite = onsiteCheckbox.checked;

  if (!showOnline && !showOnsite) return [];

  return list.filter(
    (ch) =>
      (showOnline && ch.type === "online") ||
      (showOnsite && (ch.type === "onsite" || ch.type === "on-site"))
  );
}

function updateStarUI(widget, value) {
  widget.querySelectorAll(".star").forEach((star) => {
    const v = Number(star.dataset.value);
    star.classList.toggle("is-active", v <= value);
  });
}

function applyRatingFilter(list) {
  return list.filter((ch) => ch.rating >= minRating && ch.rating <= maxRating);
}

function applyTagFilter(list) {
  if (activeTags.size === 0) return list;

  return list.filter((ch) => {
    if (!Array.isArray(ch.labels)) return false;
    const labels = ch.labels.map((l) => String(l).toLowerCase());
    return [...activeTags].every((t) => labels.includes(t));
  });
}

function applyTextFilter(list) {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) return list;

  return list.filter(
    (ch) =>
      ch.title.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q)
  );
}

function applyFilters() {
  let filtered = [...baseChallenges];

  filtered = applyTypeFilter(filtered);
  filtered = applyRatingFilter(filtered);
  filtered = applyTagFilter(filtered);
  filtered = applyTextFilter(filtered);

  if (!filtered.length) {
    cardsContainer.innerHTML = '<p class="no-matches">No matching challenges</p>';
    return;
  }

  cardsContainer.innerHTML = "";
  putCardsInDOM(filtered, cardsContainer);
}

initFilters();
