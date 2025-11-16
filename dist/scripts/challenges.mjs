import { getChallengeList, putCardsInDOM } from "./index.mjs";

const informationString = window.location.search;
const infoParameters = new URLSearchParams(informationString);
const filterValue = infoParameters.get('type');
const cards_container = document.querySelector('.cards-grid');

let challengeCards = await getChallengeList();

document.addEventListener('DOMContentLoaded', ()  => { // Working because script is synchronous
    if (cards_container) {
        putCardsInDOM(challengeCards, cards_container);
    }
});

console.log(filterValue);
