import { getChallengeList, putCardsInDOM } from "./index.mjs";
let challengeCards;
const informationString = window.location.search;
const infoParameters = new URLSearchParams(informationString);
const filterValue = infoParameters.get('filter');
const cards_container = document.querySelector('.cards-grid');
challengeCards = await getChallengeList();
if (cards_container) {
    putCardsInDOM(challengeCards, cards_container);
}
console.log(filterValue);
