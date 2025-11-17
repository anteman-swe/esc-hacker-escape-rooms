import { getChallengeList, putCardsInDOM } from "./index.mjs";
let challengeCards;
const informationString = window.location.search;
const infoParameters = new URLSearchParams(informationString);
const filterValue = infoParameters.get('type');
const cards_container = document.querySelector('.cards-grid');
challengeCards = await getChallengeList();
if (cards_container) {
    let tempChallenges;
    if (filterValue !== 'none') {
        tempChallenges = challengeCards.filter((element) => element.type === filterValue);
    }
    else {
        tempChallenges = challengeCards;
    }
    putCardsInDOM(tempChallenges, cards_container);
}
console.log(filterValue);
