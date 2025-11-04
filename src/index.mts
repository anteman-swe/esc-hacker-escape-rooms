const darkBlueColor: string = '#011827';
const hamburger_btn: HTMLElement = document.querySelector('.hamburger-button') as HTMLElement;
const header: HTMLElement = document.querySelector('.header') as HTMLElement;

if (hamburger_btn) {
    hamburger_btn.addEventListener('click', makeMobileMenu);
} else {
    throw new Error('Hamburgerbutton not connecting!');
}

function makeMobileMenu(): void {
    if (hamburger_btn) {
        // hamburger_btn.style.backgroundColor = 'red';
        console.log('Button Clicked!');
        if (header.style.backgroundColor == 'red') {
            header.style.backgroundColor = darkBlueColor;
        } else {
            header.style.backgroundColor = 'red';
        }
    }
} 