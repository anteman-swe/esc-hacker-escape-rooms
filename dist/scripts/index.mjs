import { openBookingModal } from "./booking.mjs";
// Constant and variables for handling lists of challenges
const maxFetchIntervall = 30000;
export let challengeArray;
let topRatedChalls = new Array(3).fill({});
// DOM-pointers
const home = document.querySelector(".header__logo");
const navigation = document.querySelector(".navigation");
const allButtons = document.querySelectorAll("button");
const card_section = document.querySelector(".card-container");
const footer = document.querySelector(".footer");
home.addEventListener("click", () => {
    window.location.assign(`./index.html`);
});
home.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        window.location.assign(`./index.html`);
    }
});
navigation.addEventListener("click", (event) => {
    takeAction(event);
});
navigation.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        takeAction(event);
    }
});
allButtons.forEach((node) => {
    node.addEventListener("click", (event) => {
        takeAction(event);
    });
    node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            takeAction(event);
        }
    });
});
footer.addEventListener("click", (event) => {
    takeAction(event);
});
footer.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        takeAction(event);
    }
});
function takeAction(event) {
    event.preventDefault();
    const target = event.target;
    if (target.tagName === "A" || target.tagName === "BUTTON") {
        const action = target.dataset.type;
        const targetId = target.dataset.id;
        switch (action) {
            case "online":
                window.location.assign(`./challenges.html?type=online`);
                break;
            case "on-site":
            case "onsite":
                window.location.assign(`./challenges.html?type=onsite`);
                break;
            case "see_all":
                window.location.assign(`./challenges.html?type=none`);
                break;
            case "story":
                window.location.assign(`./storypage.html`);
                break;
            case "contact":
                window.location.assign(`./contact.html`); // Maybe contact should be just a modal?
                break;
            case "legal":
                window.location.assign(`./legal.html`);
                break;
            case "filter":
                // code for opening modal with filter form should be here
                console.log("Filter is clicked! Should filter something!");
                break;
            case "booking":
                openBookingModal(targetId);
                break;
            default:
                console.log("Going nowhere!");
        }
    }
}
async function fetchChallengesAndSaveToLocal() {
    try {
        const url = "https://lernia-sjj-assignments.vercel.app/api/challenges";
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const data = await response.json();
        const challengesList = data.challenges;
        localStorage.clear();
        localStorage.setItem("savedChallenges", JSON.stringify(challengesList));
        localStorage.setItem("lastFetch", JSON.stringify(Date.now()));
        return challengesList;
    }
    catch (error) {
        console.error(error.message);
    }
}
export function getChallengeList() {
    let tempChallengeArray;
    if (localStorage.getItem("savedChallenges") && checkIntervall()) {
        const tempStorage = localStorage.getItem("savedChallenges");
        if (tempStorage) {
            tempChallengeArray = JSON.parse(tempStorage);
        }
        else {
            throw new Error("Problem has arised with challenges saved in localStorage.");
        }
    }
    else {
        const tempArray = fetchChallengesAndSaveToLocal();
        tempChallengeArray = tempArray;
    }
    return tempChallengeArray;
}
const checkIntervall = () => {
    let lastFetchString = localStorage.getItem("lastFetch");
    let lastFetchTime = 0;
    if (lastFetchString) {
        lastFetchTime = +lastFetchString;
    }
    const timeNow = Date.now();
    return timeNow - lastFetchTime < maxFetchIntervall;
};
function sortOutTopRated(inputArray) {
    if (localStorage.getItem("savedTopThree") && checkIntervall()) {
        const tempTopThree = localStorage.getItem("savedTopThree");
        if (tempTopThree) {
            topRatedChalls = JSON.parse(tempTopThree);
        }
        else {
            throw new Error("Problem has arised with top three list saved in localStorage");
        }
    }
    else {
        const sortedArray = [...inputArray].sort((a, b) => b.rating - a.rating);
        const newTopThree = sortedArray.slice(0, 3);
        topRatedChalls = newTopThree;
        localStorage.setItem("savedTopThree", JSON.stringify(newTopThree));
    }
}
// Function that inserts top three challenge-cards in the startpage
export const putCardsInDOM = (cardArray, container) => {
    cardArray.forEach((element) => {
        const cardImg = document.createElement("img");
        cardImg.setAttribute("src", element.image);
        cardImg.setAttribute("class", "card__image");
        const cardType = document.createElement("img");
        cardType.setAttribute("src", element.type === "online"
            ? "resources/online.png"
            : element.type === "onsite"
                ? "resources/onsite.png"
                : "");
        cardType.setAttribute("alt", element.type);
        cardType.setAttribute("class", "card__type");
        const card_title = document.createElement("h4");
        card_title.setAttribute("class", "card__title");
        card_title.innerText = element.title;
        const rating_container = document.createElement("div");
        const rating = document.createElement("span");
        const rating_real = element.rating;
        const rating_rounded = Math.ceil(element.rating);
        for (let index = 1; index <= rating_rounded; index++) {
            const rating_star = document.createElement("img");
            if (0 < index - rating_real && index - rating_real < 1) {
                rating_star.setAttribute("src", "resources/Star 3 half.svg");
                rating_star.setAttribute("class", "rating__star--half");
                rating.appendChild(rating_star);
            }
            else {
                rating_star.setAttribute("src", "resources/Star 3.svg");
                rating_star.setAttribute("class", "rating__star");
                rating.appendChild(rating_star);
            }
        }
        if (5 - rating_rounded > 0) {
            for (let index = 0; index < 5 - rating_rounded; index++) {
                const rating_star = document.createElement("img");
                rating_star.setAttribute("src", "resources/Star 3 hollow.svg");
                rating_star.setAttribute("class", "rating__star--empty");
                rating.appendChild(rating_star);
            }
        }
        rating_container.appendChild(rating);
        rating_container.setAttribute("class", "rating-container");
        const room_participants = document.createElement("span");
        room_participants.innerText =
            element.minParticipants +
                " - " +
                element.maxParticipants +
                " participants";
        room_participants.setAttribute("class", "card__room-participants");
        rating_container.appendChild(room_participants);
        const card_description = document.createElement("div");
        card_description.setAttribute("class", "card__description");
        card_description.innerText = element.description;
        const card_button = document.createElement("button");
        card_button.setAttribute("class", "card__button");
        card_button.setAttribute("data-type", "booking");
        card_button.setAttribute("data-id", "" + element.id);
        card_button.innerText =
            element.type === "online" ? "Take challenge online" : "Book this room";
        card_button.addEventListener("click", (event) => {
            takeAction(event);
        });
        card_button.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                takeAction(event);
            }
        });
        const card = document.createElement("article");
        card.setAttribute("id", "" + element.id);
        card.setAttribute("class", "card");
        card.setAttribute("data-type", element.type);
        card.appendChild(cardImg);
        card.appendChild(cardType);
        card.appendChild(card_title);
        card.appendChild(rating_container);
        card.appendChild(card_description);
        card.appendChild(card_button);
        container.appendChild(card);
    });
};
// //Navigering till challenge sidan med förfiltrering
// function goToChallengePage(type: string) {
//     window.location.assign(`./challenges.html?type=${encodeURIComponent(type)}`);
// }
// //Hämtar alla knappar för navigering till challenge sidan
// const challengeNavButtons = document.querySelectorAll<HTMLButtonElement>('.js-challenge-nav');
// //Lägger till event listeners för varje knapp
// challengeNavButtons.forEach(btn => {const type = btn.dataset.type || '';
//     //Klick och tangenttryckning för tillgänglighet
//     btn.addEventListener('click', () => goToChallengePage(type));
// Gör knapparna åtkomliga via tangentbordet
// btn.addEventListener('keydown', (e) => {
//     if (e.key === 'Enter' || e.key === ' ') {
//         e.preventDefault(); //Förhindra scrollning vid mellanslag
//         goToChallengePage(type);
//     }
// });
// });
challengeArray = await getChallengeList();
sortOutTopRated(challengeArray);
if (card_section) {
    putCardsInDOM(topRatedChalls, card_section);
}
