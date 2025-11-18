import { getChallengeList, putCardsInDOM } from "./index.mjs";

// Knapp för att öppna/stänga filterpanelen
const filterToggle = document.querySelector("#filterToggle");
const filterPanel = document.querySelector("#filters");
const filterClose = document.querySelector(".filter-header__close");

// Öppna och stäng filter-panelen
if (filterToggle && filterPanel && filterClose) {
  filterToggle.addEventListener("click", () => {
    filterPanel.hidden = false;
    filterToggle.hidden = true;
  });

  filterClose.addEventListener("click", () => {
    filterPanel.hidden = true;
    filterToggle.hidden = false;
  });

  // Stäng med ESC
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !filterPanel.hidden) {
      filterPanel.hidden = true;
      filterToggle.hidden = false;
    }
  });
}

// Hämta parametrar från URL (?type=online osv.)
const cardsContainer = document.querySelector(".cards-grid");
const urlParams = new URLSearchParams(window.location.search);
const initialTypeParam = urlParams.get("type") || urlParams.get("filter");

let allChallenges = [];
let baseChallenges = [];

// Filter-element
const onlineCheckbox = document.querySelector("#f-online");
const onsiteCheckbox = document.querySelector("#f-onsite");

const filterCheckboxLabels = document.querySelectorAll("#filters .filter-checkbox");
const ratingWidgets = document.querySelectorAll(".rating-widget");
const tagButtons = document.querySelectorAll(".tag-pill");
const searchInput = document.querySelector("#f-query");

// Filter-state
let activeTags = new Set();
let minRating = 0;
let maxRating = 5;


// Synka visuellt för custom checkbox
filterCheckboxLabels.forEach((label) => {
  const input = label.querySelector(".filter-checkbox__input");
  if (!input) return;

  label.classList.toggle("is-checked", input.checked);

  // Klick på label togglar checkboxen
  label.addEventListener("click", (e) => {
    e.preventDefault();
    input.checked = !input.checked;
    label.classList.toggle("is-checked", input.checked);
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
});


async function initFilters() {
  try {
    // Hämta challenge-listan från API
    const list = await getChallengeList();
    allChallenges = Array.isArray(list) ? list : [];

    // Om användaren kom in med ?type=online m.m.
    if (initialTypeParam && initialTypeParam !== "none") {
      baseChallenges = allChallenges.filter((ch) => ch.type === initialTypeParam);

      // Sätt rätt checkbox
      if (initialTypeParam === "online") {
        onlineCheckbox.checked = true;
      } else if (initialTypeParam === "onsite") {
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
  // Typ-filter
  onlineCheckbox?.addEventListener("change", applyFilters);
  onsiteCheckbox?.addEventListener("change", applyFilters);

  // Rating-filter (stjärnor)
  ratingWidgets.forEach((widget) => {
    widget.addEventListener("click", (e) => {
      const target = e.target;
      if (!target.classList.contains("star")) return;

      const val = Number(target.dataset.value);
      const role = widget.dataset.role; // min eller max

      if (role === "min") minRating = val;
      if (role === "max") maxRating = val;

      updateStarUI(widget, val);
      applyFilters();
    });
  });

  // Taggar
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

  // Text-sökning
  searchInput?.addEventListener("input", applyFilters);
}


// FILTRERING ------------------------------------

function applyTypeFilter(list) {
  const showOnline = onlineCheckbox.checked;
  const showOnsite = onsiteCheckbox.checked;

  // Om båda är av, visa inget
  if (!showOnline && !showOnsite) return [];

  return list.filter(
    (ch) =>
      (showOnline && ch.type === "online") ||
      (showOnsite && (ch.type === "onsite" || ch.type === "on-site"))
  );
}

function updateStarUI(widget, value) {
  // Markera stjärnor upp till vald rating
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

  // Sök i title + description
  return list.filter(
    (ch) =>
      ch.title.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q)
  );
}


// Kör alla filter
function applyFilters() {
  let filtered = [...baseChallenges];

  filtered = applyTypeFilter(filtered);
  filtered = applyRatingFilter(filtered);
  filtered = applyTagFilter(filtered);
  filtered = applyTextFilter(filtered);

  // Om inga matchningar
  if (!filtered.length) {
    cardsContainer.innerHTML = '<p class="no-matches">No matching challenges</p>';
    return;
  }

  // Visa kort
  cardsContainer.innerHTML = "";
  putCardsInDOM(filtered, cardsContainer);
}

initFilters();
