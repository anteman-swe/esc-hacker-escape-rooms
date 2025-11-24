import type { oneChallenge, multipleChallenges } from "./interfaces.mjs";

let topRatedChalls: Array<oneChallenge> = new Array(3).fill({});

async function fetchChallengesAndSaveToLocal() {
  try {
    const url: string =
      "https://lernia-sjj-assignments.vercel.app/api/challenges";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data: multipleChallenges = await response.json();
    const challengesList: Array<oneChallenge> = data.challenges;
    localStorage.clear();
    localStorage.setItem("savedChallenges", JSON.stringify(challengesList));
    localStorage.setItem("lastFetch", JSON.stringify(Date.now()));

    return challengesList;
  } catch (error: any) {
    console.error(error.message);
  }
}

const checkIntervall = (): boolean => {
  let lastFetchString: string | null = localStorage.getItem("lastFetch");
  let lastFetchTime: number = 0;
  if (lastFetchString) {
    lastFetchTime = +lastFetchString;
  }
  const timeNow: number = Date.now();

  return timeNow - lastFetchTime < 30000;
};

export function getChallengeList(): Array<oneChallenge> {
  let tempChallengeArray: Array<oneChallenge> = [];
  if (localStorage.getItem("savedChallenges") && checkIntervall()) {
    const tempStorage: string | null = localStorage.getItem("savedChallenges");
    if (tempStorage) {
      tempChallengeArray = JSON.parse(tempStorage);
    } else {
      console.error(
        "Problem has arised with challenges saved in localStorage."
      );
    }
  } else {
    const tempArray: unknown = fetchChallengesAndSaveToLocal();
    tempChallengeArray = tempArray as Array<oneChallenge>;
  }
  return tempChallengeArray;
}

export function sortOutTopRated(inputArray: Array<oneChallenge>): Array<oneChallenge> {
    let newTopThree: Array<oneChallenge> = [];
    if (localStorage.getItem("savedTopThree") && checkIntervall()) {
        const tempTopThree: string | null = localStorage.getItem("savedTopThree");
        if (tempTopThree) {
        topRatedChalls = JSON.parse(tempTopThree);
        } else {
        throw new Error(
            "Problem has arised with top three list saved in localStorage"
        );
        }
    } else {
        const sortedArray: Array<oneChallenge> = [...inputArray].sort(
        (a, b) => b.rating - a.rating
        );
        newTopThree  = sortedArray.slice(0, 3);
        topRatedChalls = newTopThree;
        localStorage.setItem("savedTopThree", JSON.stringify(newTopThree));
    }
    return topRatedChalls;
}

export function tagsList(challenges: Array<oneChallenge>): Set<string> {
    let tags: Set<string> = new Set();
    challenges.forEach((element) => {
        element.labels.forEach((tag: string) => {
            tags.add(tag);
        });
    });
    return tags;
}
