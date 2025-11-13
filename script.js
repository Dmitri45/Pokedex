let loadedPokemonCount = 40;
let loadedPokemonsList = [];
let myObject = null;
let pokemonsList = [];
let searchResults = [];
let wasSearching = false;
const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${loadedPokemonCount}&offset=0`;
const typeColors = {
    normal: '#F5F5F5',
    fire: '#FCE4D6',
    water: '#D6EAF8',
    electric: '#FCF3CF',
    grass: '#D5F5E3',
    ice: '#D6EAF8',
    fighting: '#FADBD8',
    poison: '#E8DAEF',
    ground: '#FDEBD0',
    flying: '#EBF5FB',
    psychic: '#FDEDEC',
    bug: '#E9F7EF',
    rock: '#F9E79F',
    ghost: '#E8DAEF',
    dragon: '#EAF2F8',
    dark: '#EAECEE',
    steel: '#EBEDEF',
    fairy: '#FDEEF4'
};

const anim = lottie.loadAnimation({
    container: document.getElementById('loader'),
    path: 'blue-loader.json',
    renderer: 'svg',
    loop: true,
    autoplay: false,
});

async function init() {
    showLoader();
    let pokemonData = await findByUrl('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    pokemonsList = pokemonData.results;
    await addLoadedPokemons(0, loadedPokemonCount);
    setupFocusHandlers();
    hideLoader();
    pokemonContanersRender(loadedPokemonsList);

}

async function addLoadedPokemons(start = 0, loadedPokemonCount) {
    for (let index = start; index < loadedPokemonCount; index++) {
        let objectOfPokemon = await findByUrl(pokemonsList[index].url);
        loadedPokemonsList.push({
            'objectOfPokemon': objectOfPokemon,
            'urlOfPokemon': pokemonsList[index].url
        });
    }
    console.log(loadedPokemonsList);
}

async function findByUrl(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Fehler', error);
        return null;
    }
}

function pokemonContanersRender(listOfPokomens, quantity = listOfPokomens.length, start = 0) {
    showLoader();
    for (let index = start; index < quantity; index++) {
        pokemonContainerRender(listOfPokomens[index].objectOfPokemon, listOfPokomens[index].urlOfPokemon);
    }
    hideLoader();
}

function pokemonContainerRender(objectOfPokemon, urlOfPokemon) {
    let typeOfPokemon = getPokemonType(objectOfPokemon);
    let pokemonContainersRef = document.getElementById('pokemon-containers');
    if (objectOfPokemon.sprites.other['official-artwork'].front_default) {
        pokemonContainersRef.innerHTML += getPokemonContainerTemplate(objectOfPokemon, urlOfPokemon, typeOfPokemon);
    }
    else {
        pokemonContainersRef.innerHTML += getDefaultPokemonContainerTemplate(objectOfPokemon, urlOfPokemon, typeOfPokemon);
    }
}

function getPokemonType(myObject) {
    let pokemonTypeList = [];
    for (let index = 0; index < myObject.types.length; index++) {
        pokemonTypeList.push(myObject.types[index].type.name[0].toUpperCase() + myObject.types[index].type.name.slice(1));
    }
    return pokemonTypeList.join('/');
}

function getCardBackgroundColorByType(typeOfPokemon) {
    let typeOfPokemonList = typeOfPokemon.split('/');
    return typeColors[`${typeOfPokemonList[0].toLowerCase()}`];
}

async function pokemonContainerDetailsRender(url) {
    await setSelectedPokemon(url);
    let pokemonContainerDetais = document.getElementById('pokemon-container-details');
    if (myObject.sprites.other['official-artwork'].front_default) {
        pokemonContainerDetais.innerHTML = getPokemonContainerDetailsTemplate(myObject);
    }
    else {
        pokemonContainerDetais.innerHTML = getDefaultPokemonContainerDetailsTemplate(myObject);
    }
    if (document.getElementById('overlay').classList.contains('d_none')) {
        toggleOverlay();
    }
    pokemonMainInformationRender();
    showPokemonDetail();
}

function getPokemonAbilities(myObject) {
    let pokemonAbilitiesList = [];
    for (let index = 0; index < myObject.abilities.length; index++) {
        pokemonAbilitiesList.push(myObject.abilities[index].ability.name);
    }
    return pokemonAbilitiesList.join(', ');
}

function tabChange(id) {
    resetTabs();
    document.getElementById(id).classList.add('tab-active');
    document.getElementById('information').innerHTML = '';
    if (id == 'main') {
        pokemonMainInformationRender();
    }
    else if (id == 'stats') {
        pokemonStatsRender();
    }
    else {
        pokemonEvoChainRender();
    }
}

function resetTabs() {
    document.getElementById(`main`).classList.remove('tab-active');
    document.getElementById(`stats`).classList.remove('tab-active');
    document.getElementById(`evo-chain`).classList.remove('tab-active');
}

function pokemonMainInformationRender() {
    document.getElementById('information').innerHTML = '';
    document.getElementById('information').innerHTML = getPokemonMainInformationTemplate(myObject);
}

function pokemonStatsRender() {
    document.getElementById('information').innerHTML = '';
    for (let index = 0; index < myObject.stats.length; index++) {
        document.getElementById('information').innerHTML += getPokemonStatsTemplate(myObject, index);
    }
}

async function pokemonEvoChainRender() {
    let speciesObject = await findByUrl(myObject.species.url);
    let evolutionChainObject = await findByUrl(speciesObject.evolution_chain.url);
    let pokemonImageUrlsList = await getPokemonImageUrls(evolutionChainObject);
    document.getElementById('information').innerHTML = '';
    document.getElementById('information').innerHTML = getEvolutionChainContainerTemplate();
    renderEvolutionChain(pokemonImageUrlsList);
}

function renderEvolutionChain(pokemonImageUrlsList) {
    if (pokemonImageUrlsList.length == 0) {
        document.getElementById('evolution_chain_container').innerHTML = getNoEvolutionTemplate();
    }
    else {
        for (let index = 0; index < pokemonImageUrlsList.length; index++) {
            if (pokemonImageUrlsList[index] == arrowHtml) {
                document.getElementById('evolution_chain_container').innerHTML += `
        ${pokemonImageUrlsList[index]}`;
            }
            else {
                document.getElementById('evolution_chain_container').innerHTML += `
        <img src="${pokemonImageUrlsList[index]}">`;
            }
        }
    }
}

async function getPokemonImageUrls(evolutionChainObject) {
    let myList = [];
    myList.push(await getPokemonImageUrlByName(evolutionChainObject?.chain?.species?.name));
    myList.push(arrowHtml);
    myList.push(await getPokemonImageUrlByName(evolutionChainObject?.chain?.evolves_to[0]?.species?.name));
    if (evolutionChainObject?.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species?.name) {
        myList.push(arrowHtml);
        myList.push(await getPokemonImageUrlByName(evolutionChainObject.chain.evolves_to[0].evolves_to[0].species.name));
    }
    return checkForFalsyValues(myList);
}

function checkForFalsyValues(myList) {
    if (myList.some(item => item == false)) {
        myList = [];
        return myList;
    }
    else {
        return myList;
    }
}

async function getPokemonImageUrlByName(nameOfPokemon) {
    let pokemonData = await findByUrl('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    let urlOfPokemon = '';
    for (let index = 0; index < pokemonData.results.length; index++) {
        if (pokemonData.results[index].name == nameOfPokemon) {
            urlOfPokemon = pokemonData.results[index].url;
            break;
        }
    }
    return await getPokemonImageIfValid(urlOfPokemon);
}

async function getPokemonImageIfValid(urlOfPokemon) {
    if (urlOfPokemon) {
        let objectOfPokemon = await findByUrl(urlOfPokemon);
        if (objectOfPokemon) {
            return objectOfPokemon.sprites.other['official-artwork'].front_default;
        }
        else {
            return false;
        }
    }
    else {
        return false;
    }
}

async function setSelectedPokemon(url) {
    myObject = await findByUrl(url);
}

function showPokemonDetail() {
    document.getElementById('pokemon-container-details').parentElement.style = '';
}

function closePokemondetails() {
    document.getElementById('pokemon-container-details').parentElement.style.display = 'none';
    toggleOverlay();
}

async function loadMorePokemon() {
    let start = loadedPokemonCount;
    loadedPokemonCount += 40;
    showLoader();
    await addLoadedPokemons(start, loadedPokemonCount);
    pokemonContanersRender(loadedPokemonsList, loadedPokemonCount, start);
}

function setupFocusHandlers() {
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('focus', onFocus);
    searchInput.addEventListener('blur', onBlur);
    searchInput.addEventListener('input', debounce(filterAndShowName, 300));
}

function debounce(fn, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

function onFocus() {
    if (document.getElementById('search').value == 'Enter the name of a Pokémon') {
        document.getElementById('search').value = "";
    }
}

function onBlur() {
    if (document.getElementById('search').value == '') {
        document.getElementById('search').value = "Enter the name of a Pokémon";
        document.getElementById('tooltip-text').style = 'display:none';
    }
}

async function filterAndShowName() {
    let filterWord = document.getElementById('search').value.replace(/\s/g, '').toLowerCase();
    if (filterWord.length >= 3) {
        document.getElementById('tooltip-text').style = 'display:none';
        wasSearching = true;
        updateButtonVisibility();
        let pokemonContainersRef = document.getElementById('pokemon-containers');
        pokemonContainersRef.innerHTML = '';
        if (filterWord == "") {
            pokemonContanersRender(loadedPokemonsList);
        }
        else {
            let filteredData = pokemonsList.filter(name => name.name.includes(filterWord));
            await transformFilteredDataToSearchResults(filteredData);
            pokemonContanersRender(searchResults);
        }
    }
    else {
        document.getElementById('tooltip-text').style = '';
        if (wasSearching) {
            let pokemonContainersRef = document.getElementById('pokemon-containers');
            pokemonContainersRef.innerHTML = '';
            pokemonContanersRender(loadedPokemonsList);
            wasSearching = false;
            updateButtonVisibility();
        }
    }
}

function updateButtonVisibility() {
    let loadMoreButtenRef = document.getElementById('load-more-button');
    if (wasSearching) {
        loadMoreButtenRef.style.display = 'none';
    } else {
        loadMoreButtenRef.style = '';
    }
}

async function transformFilteredDataToSearchResults(filteredData) {
    searchResults = [];
    for (let index = 0; index < filteredData.length; index++) {
        let objectOfPokemon = await findByUrl(filteredData[index].url);
        searchResults.push({
            'objectOfPokemon': objectOfPokemon,
            'urlOfPokemon': filteredData[index].url
        });
    }
}

function toggleOverlay() {
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.toggle('d_none');
    toggleOverflowHidden();
}

function toggleOverflowHidden() {
    let bodyRef = document.getElementById('body');
    bodyRef.classList.toggle('no_scroll');
}

function showLoader() {
    document.getElementById('loader').style = "";
    document.getElementById('load-more-button').style.display = "none";
    if(wasSearching){
        document.getElementById('pokemon-containers').style.display = 'none';
    }
    anim.play();
}

function hideLoader() {
    setTimeout(() => {
        document.getElementById('loader').style.display = "none";
        anim.stop();
        if (wasSearching == false) {
            document.getElementById('load-more-button').style.display = "";
        }
        document.getElementById('pokemon-containers').style.display = '';
    }, 400);
}

function stopEventPropagation(event) {
    event.stopPropagation();
}

function nextPokemonDetailsRender() {
    if (wasSearching == false) {
        let nameOfPokemon = myObject.name;
        let indexOfPokemon = loadedPokemonsList.findIndex(pokemon => pokemon.objectOfPokemon.name == nameOfPokemon);
        if (indexOfPokemon == loadedPokemonsList.length - 1) {
            pokemonContainerDetailsRender(loadedPokemonsList[0].urlOfPokemon);
        }
        else {
            pokemonContainerDetailsRender(loadedPokemonsList[indexOfPokemon + 1].urlOfPokemon);
        }
    }
    else {
        let nameOfPokemon = myObject.name;
        let indexOfPokemon = searchResults.findIndex(pokemon => pokemon.objectOfPokemon.name == nameOfPokemon);
        if (indexOfPokemon == searchResults.length - 1) {
            pokemonContainerDetailsRender(searchResults[0].urlOfPokemon);
        }
        else {
            pokemonContainerDetailsRender(searchResults[indexOfPokemon + 1].urlOfPokemon);
        }
    }
}

function previousPokemonDetailsRender() {
    let nameOfPokemon = myObject.name;
    console.log(searchResults);
    if (wasSearching == false) {
        let indexOfPokemon = loadedPokemonsList.findIndex(pokemon => pokemon.objectOfPokemon.name == nameOfPokemon);
        if (indexOfPokemon == 0) {
            pokemonContainerDetailsRender(loadedPokemonsList[loadedPokemonsList.length - 1].urlOfPokemon);
        }
        else {
            pokemonContainerDetailsRender(loadedPokemonsList[indexOfPokemon - 1].urlOfPokemon);
        }
    }
    else {
        let indexOfPokemon = searchResults.findIndex(pokemon => pokemon.objectOfPokemon.name == nameOfPokemon);
        if (indexOfPokemon == 0) {
            pokemonContainerDetailsRender(searchResults[searchResults.length - 1].urlOfPokemon);
        }
        else {
            pokemonContainerDetailsRender(searchResults[indexOfPokemon - 1].urlOfPokemon);
        }
    }
}