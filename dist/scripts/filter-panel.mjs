const filterToggle = document.querySelector("#filterToggle");
const filterPanel = document.querySelector("#filters");
const filterClose = document.querySelector(".filter-header__close");
// Öppna panel
filterToggle.addEventListener("click", () => {
    filterPanel.hidden = false;
    filterToggle.hidden = true;
});
// Stänga panel
filterClose.addEventListener("click", () => {
    filterPanel.hidden = true;
    filterToggle.hidden = false;
});
export {};
