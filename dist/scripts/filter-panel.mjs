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

