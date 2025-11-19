const filterToggle: HTMLElement = document.querySelector("#filterToggle") as HTMLElement;
const filterPanel: HTMLElement = document.querySelector("#filters") as HTMLElement;
const filterClose: HTMLElement = document.querySelector(".filter-header__close") as HTMLElement;

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
