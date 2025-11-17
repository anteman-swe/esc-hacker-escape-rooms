import { getChallengeList, putCardsInDOM } from "./index.mjs";
import type { oneChallenge } from "./interfaces.mjs";

let challengeCards: Array<oneChallenge>;
const informationString: string = window.location.search;
const infoParameters: URLSearchParams = new URLSearchParams(informationString);
const filterValue = infoParameters.get('type');

const cards_container: HTMLElement = document.querySelector('.cards-grid') as HTMLElement;

challengeCards = await getChallengeList();
if(cards_container) {
    let tempChallenges: Array<oneChallenge>;
    if (filterValue !== 'none') {
        tempChallenges = challengeCards.filter((element) => element.type === filterValue);
    } else {
        tempChallenges = challengeCards;
    }
    putCardsInDOM(tempChallenges, cards_container);
}
console.log(filterValue);