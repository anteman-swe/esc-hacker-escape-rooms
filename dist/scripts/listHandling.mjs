let topRatedChalls = new Array(3).fill({});
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
const checkIntervall = () => {
    let lastFetchString = localStorage.getItem("lastFetch");
    let lastFetchTime = 0;
    if (lastFetchString) {
        lastFetchTime = +lastFetchString;
    }
    const timeNow = Date.now();
    return timeNow - lastFetchTime < 30000;
};
export function getChallengeList() {
    let tempChallengeArray = [];
    if (localStorage.getItem("savedChallenges") && checkIntervall()) {
        const tempStorage = localStorage.getItem("savedChallenges");
        if (tempStorage) {
            tempChallengeArray = JSON.parse(tempStorage);
        }
        else {
            console.error("Problem has arised with challenges saved in localStorage.");
        }
    }
    else {
        const tempArray = fetchChallengesAndSaveToLocal();
        tempChallengeArray = tempArray;
    }
    return tempChallengeArray;
}
export function sortOutTopRated(inputArray) {
    let newTopThree = [];
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
        newTopThree = sortedArray.slice(0, 3);
        topRatedChalls = newTopThree;
        localStorage.setItem("savedTopThree", JSON.stringify(newTopThree));
    }
    return topRatedChalls;
}
export function tagsList(challenges) {
    let tags = new Set();
    challenges.forEach((element) => {
        element.labels.forEach((tag) => {
            tags.add(tag);
        });
    });
    return tags;
}
