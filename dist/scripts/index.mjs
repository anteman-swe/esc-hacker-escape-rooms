const darkBlueColor = '#011827';
const hamburger_btn = document.querySelector('.hamburger-button');
const header = document.querySelector('.header');
if (hamburger_btn) {
    hamburger_btn.addEventListener('click', makeMobileMenu);
}
else {
    throw new Error('Hamburgerbutton not connecting!');
}
function makeMobileMenu() {
    if (hamburger_btn) {
        // hamburger_btn.style.backgroundColor = 'red';
        console.log('Button Clicked!');
        if (header.style.backgroundColor == 'red') {
            header.style.backgroundColor = darkBlueColor;
        }
        else {
            header.style.backgroundColor = 'red';
        }
    }
}
export {};
//# sourceMappingURL=index.mjs.map