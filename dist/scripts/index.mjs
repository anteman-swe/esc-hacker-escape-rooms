// Constant and variables for handling lists of challenges
const maxFetchIntervall = 30000;
let challengeArray;
let topRatedChalls = new Array(3).fill({});
// DOM-pointers
const card_section = document.querySelector('.card-container');
const buttons_online_challs = document.querySelectorAll('.secondary-nav__btn--primary');
const buttons_onsite_challs = document.querySelectorAll('.secondary-nav__btn--secondary');
buttons_online_challs.forEach(element => {
    element.addEventListener('click', () => {
        window.open('challenges.html?filter=online', '_self');
    });
});
async function fetchChallengesAndSaveToLocal() {
    try {
        const url = "https://lernia-sjj-assignments.vercel.app/api/challenges";
        const response = await fetch(url);
        const data = await response.json();
        const challengesList = data.challenges;
        localStorage.setItem('savedChallenges', JSON.stringify(challengesList));
        localStorage.setItem('lastFetch', JSON.stringify(Date.now()));
        return challengesList;
    }
    catch (error) {
        console.error(error.message);
    }
}
function getChallengeList() {
    let tempChallengeArray;
    if (localStorage.getItem('savedChallenges') && checkIntervall()) {
        const tempStorage = localStorage.getItem('savedChallenges');
        if (tempStorage) {
            tempChallengeArray = JSON.parse(tempStorage);
        }
        else {
            throw new Error('Problem has arised with challenges saved in localStorage.');
        }
    }
    else {
        const tempArray = fetchChallengesAndSaveToLocal();
        tempChallengeArray = tempArray;
    }
    return tempChallengeArray;
}
const checkIntervall = () => {
    let lastFetchString = localStorage.getItem('lastFetch');
    let lastFetchTime = 0;
    if (lastFetchString) {
        lastFetchTime = +lastFetchString;
    }
    const timeNow = Date.now();
    return ((timeNow - lastFetchTime) < maxFetchIntervall);
};
function sortOutTopRated(inputArray) {
    if (localStorage.getItem('savedTopThree') && checkIntervall()) {
        const tempTopThree = localStorage.getItem('savedTopThree');
        if (tempTopThree) {
            topRatedChalls = JSON.parse(tempTopThree);
        }
        else {
            throw new Error('Problem has arised with top three list saved in localStorage');
        }
    }
    else {
        const sortedArray = [...inputArray].sort((a, b) => b.rating - a.rating);
        const newTopThree = sortedArray.slice(0, 3);
        topRatedChalls = newTopThree;
        localStorage.setItem('savedTopThree', (JSON.stringify(newTopThree)));
    }
}
// Function that inserts top three challenge-cards in the startpage 
const putTopRatedInDOM = () => {
    topRatedChalls.forEach(element => {
        const cardImg = document.createElement('img');
        cardImg.setAttribute('src', element.image);
        cardImg.setAttribute('class', 'card__image');
        const card_title = document.createElement('h4');
        card_title.setAttribute('class', 'card__title');
        card_title.innerText = element.title;
        const rating_container = document.createElement('div');
        const rating = document.createElement('span');
        const rating_real = element.rating;
        const rating_rounded = Math.ceil(element.rating);
        for (let index = 1; index <= rating_rounded; index++) {
            const rating_star = document.createElement('img');
            if (0 < index - rating_real && index - rating_real < 1) {
                rating_star.setAttribute('src', 'resources/Star 3 half.svg');
                rating_star.setAttribute('class', 'rating__star--half');
                rating.appendChild(rating_star);
            }
            else {
                rating_star.setAttribute('src', 'resources/Star 3.svg');
                rating_star.setAttribute('class', 'rating__star');
                rating.appendChild(rating_star);
            }
        }
        if (5 - rating_rounded > 0) {
            for (let index = 0; index < 5 - rating_rounded; index++) {
                const rating_star = document.createElement('img');
                rating_star.setAttribute('src', 'resources/Star 3 hollow.svg');
                rating_star.setAttribute('class', 'rating__star--empty');
                rating.appendChild(rating_star);
            }
        }
        rating_container.appendChild(rating);
        rating_container.setAttribute('class', 'rating-container');
        const room_participants = document.createElement('span');
        room_participants.innerText = element.minParticipants + ' - ' + element.maxParticipants + ' participants';
        room_participants.setAttribute('class', 'card__room-participants');
        rating_container.appendChild(room_participants);
        const card_description = document.createElement('div');
        card_description.setAttribute('class', 'card__description');
        card_description.innerText = element.description;
        const card_button = document.createElement('button');
        card_button.setAttribute('class', 'card__button');
        card_button.innerText = 'Book this room';
        const card = document.createElement('article');
        card.setAttribute('class', 'card');
        card.appendChild(cardImg);
        card.appendChild(card_title);
        card.appendChild(rating_container);
        card.appendChild(card_description);
        card.appendChild(card_button);
        card_section.appendChild(card);
    });
};
challengeArray = await getChallengeList();
sortOutTopRated(challengeArray);
putTopRatedInDOM();
export {};
