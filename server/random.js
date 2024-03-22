function randomElement(array, n) {
    const rand = array.sort(() => 0.5 - Math.random());
    return rand.slice(0, n);
}

function randomList(countryJSON) 
{
    let random = randomElement(countryJSON, 30);
    let outputJson = JSON.stringify(random);
    return(outputJson);
}

module.exports = randomList;