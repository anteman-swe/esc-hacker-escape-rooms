const darkBlueColor = '#011827';
const hamburger_btn = document.querySelector('.hamburger-button');
const nav_bg = document.querySelector('.navigation-dimmer');
const navigation = document.querySelector('.navigation');
const lines = hamburger_btn.querySelectorAll('span');
if (hamburger_btn) {
    hamburger_btn.addEventListener('click', makeMobileMenu);
}
else {
    throw new Error('Hamburgerbutton not connecting!');
}
function makeMobileMenu() {
    console.log('Button is clicked!');
    if (nav_bg.hasAttribute('style') && navigation.hasAttribute('style') && hamburger_btn.hasAttribute('style')) {
        nav_bg.removeAttribute('style');
        navigation.removeAttribute('style');
        hamburger_btn.removeAttribute('style');
        const cross_offset = 0.55;
        if (lines[0] && lines[0].hasAttribute('style')) {
            lines[0].removeAttribute('style');
        }
        if (lines[1] && lines[1].hasAttribute('style')) {
            lines[1].removeAttribute('style');
        }
        if (lines[2] && lines[2].hasAttribute('style')) {
            lines[2].removeAttribute('style');
        }
    }
    else {
        nav_bg.style.visibility = 'visible';
        nav_bg.style.opacity = '0.6';
        navigation.style.opacity = '1';
        navigation.style.scale = '100%';
        navigation.style.visibility = 'visible';
        navigation.classList.toggle('active');
        hamburger_btn.style.position = 'fixed';
        hamburger_btn.style.padding = '1rem 1rem 0 0';
        hamburger_btn.style.backgroundColor = 'transparent';
        const cross_offset = 0.55;
        if (lines[0]) {
            lines[0].style.transform = 'rotate(45deg) translate(' + cross_offset + 'rem, ' + cross_offset + 'rem)';
        }
        else
            throw new Error('Hamburgerbutton DOM connections is missing!');
        if (lines[1]) {
            lines[1].style.background = 'transparent';
        }
        else
            throw new Error('Hamburgerbutton DOM connections is missing!');
        if (lines[2]) {
            lines[2].style.transform = 'rotate(-45deg) translate(' + cross_offset + 'rem, -' + cross_offset + 'rem)';
        }
        else
            throw new Error('Hamburgerbutton DOM connections is missing!');
    }
}
export {};
