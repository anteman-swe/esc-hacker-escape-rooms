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
//Navigering till challenge sidan med förfiltrering
function goToChallengePage(type) {
    window.location.assign(`./challenges.html?type=${encodeURIComponent(type)}`);
}
//Hämtar alla knappar för navigering till challenge sidan
const challengeNavButtons = document.querySelectorAll('.js-challenge-nav');
//Lägger till event listeners för varje knapp
challengeNavButtons.forEach(btn => {
    const type = btn.dataset.type || '';
    //Klick och tangenttryckning för tillgänglighet
    btn.addEventListener('click', () => goToChallengePage(type));
    // Gör knapparna åtkomliga via tangentbordet
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault(); //Förhindra scrollning vid mellanslag
            goToChallengePage(type);
        }
    });
});
export {};
