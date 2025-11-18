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

