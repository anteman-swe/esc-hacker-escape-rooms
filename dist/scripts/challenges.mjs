import { getChallengeList, putCardsInDOM } from "./index.mjs";

const informationString = window.location.search;
const infoParameters = new URLSearchParams(informationString);
const filterValue = infoParameters.get('filter');
const cards_container = document.querySelector('.cards-grid');

let challengeCards = await getChallengeList();

document.addEventListener('DOMContentLoaded', ()  => {
    if (cards_container) {
        putCardsInDOM(challengeCards, cards_container);
    }
});

console.log(filterValue);
