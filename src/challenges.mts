import { getChallengeList, putCardsInDOM } from "./index.mjs";
import type { oneChallenge } from "./interfaces.mjs";

let challengeCards: Array<oneChallenge>;
const informationString: string = window.location.search;
const infoParameters: URLSearchParams = new URLSearchParams(informationString);
const filterValue = infoParameters.get('filter');

const cards_container: HTMLElement = document.querySelector('.cards-grid') as HTMLElement;

challengeCards = await getChallengeList();
if(cards_container) {
    putCardsInDOM(challengeCards, cards_container);
}
console.log(filterValue);