let loadedPokemonCount = 40;
const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${loadedPokemonCount}&offset=0`;
let myObject = null;
let pokemonsList = [];
let filteredData = [];
let wasSearching = false;
const typeColors = {
    normal:   '#F5F5F5',
    fire:     '#FCE4D6',
    water:    '#D6EAF8',
    electric: '#FCF3CF',
    grass:    '#D5F5E3',
    ice:      '#D6EAF8',
    fighting: '#FADBD8',
    poison:   '#E8DAEF',
    ground:   '#FDEBD0',
    flying:   '#EBF5FB',
    psychic:  '#FDEDEC',
    bug:      '#E9F7EF',
    rock:     '#F9E79F',
    ghost:    '#E8DAEF',
    dragon:   '#EAF2F8',
    dark:     '#EAECEE',
    steel:    '#EBEDEF',
    fairy:    '#FDEEF4'
};

async function init() {
    await loadPokemons();
    await pokemonContanersRender(pokemonsList, loadedPokemonCount);
    setupFocusHandlers();
}

async function loadPokemons() {
    let pokemonData = await findByUrl('https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0');
    pokemonsList = pokemonData.results;
}

async function findByUrl(url) {
    try {
        const response = await fetch(url);
        return await response.json();;
    } catch (error) {
        console.error('Fehler', error);
        return null;
    }
}

async function pokemonContanersRender(listOfPokomens, quantity = listOfPokomens.length, start = 0) {
    for (let index = start; index < quantity; index++) {
        let objectOfPokemon = await findByUrl(listOfPokomens[index].url);
        pokemonContainerRender(objectOfPokemon, listOfPokomens[index].url);
    }
}

function pokemonContainerRender(objectOfPokemon, urlOfPokemon) {
    let typeOfPokemon = getPokemonType(objectOfPokemon);
    let pokemonContainersRef = document.getElementById('pokemon-containers');
    if (objectOfPokemon.sprites.other['official-artwork'].front_default) {
        pokemonContainersRef.innerHTML += getPokemonContainerTemplate(objectOfPokemon, urlOfPokemon, typeOfPokemon);
    }
    else {
        pokemonContainersRef.innerHTML += getDefaultPokemonContainerTemplate(objectOfPokemon, urlOfPokemon);
    }
}

function getPokemonType(myObject) {
    let pokemonTypeList = [];
    for (let index = 0; index < myObject.types.length; index++) {
        pokemonTypeList.push(myObject.types[index].type.name[0].toUpperCase() + myObject.types[index].type.name.slice(1));
    }
    return pokemonTypeList.join('/');
}

function getCardBackgroundColorByType(typeOfPokemon){
    let typeOfPokemonList = typeOfPokemon.split('/');
    console.log(typeColors[`${typeOfPokemonList[0].toLowerCase()}`]);
    return typeColors[`${typeOfPokemonList[0].toLowerCase()}`]
}

async function pokemonContainerDetailsRender(url) {
    await setSelectedPokemon(url);
    let pokemonContainerDetais = document.getElementById('pokemon-container-details');
    pokemonContainerDetais.innerHTML = getPokemonContainerDetailsTemplate(myObject);
    pokemonMainInformationRender();
    showPokemonDetail();
    toggleOverflowHidden();
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

async function getPokemonImageUrls(evolutionChainObject) {
    let myList = [];
    myList.push(await getPokemonImageUrlByName(evolutionChainObject.chain.species.name));
    myList.push(arrowHtml);
    myList.push(await getPokemonImageUrlByName(evolutionChainObject.chain.evolves_to[0].species.name));
    if (evolutionChainObject?.chain?.evolves_to?.[0]?.evolves_to?.[0]?.species?.name) {
        myList.push(arrowHtml);
        myList.push(await getPokemonImageUrlByName(evolutionChainObject.chain.evolves_to[0].evolves_to[0].species.name));
    }
    return myList;
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
    let objectOfPokemon = await findByUrl(urlOfPokemon);
    return objectOfPokemon.sprites.other['official-artwork'].front_default;
}

async function setSelectedPokemon(url) {
    myObject = await findByUrl(url);
}

function showPokemonDetail() {
    document.getElementById('pokemon-container-details').parentElement.style = '';
}

function closePokemondetails() {
    document.getElementById('pokemon-container-details').parentElement.style.display = 'none';
}

function loadMorePokemon() {
    let start = loadedPokemonCount;
    loadedPokemonCount += 40;
    pokemonContanersRender(pokemonsList, loadedPokemonCount, start);
}

function setupFocusHandlers() {
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('focus', onFocus);
    searchInput.addEventListener('blur', onBlur);
    searchInput.addEventListener('input', filterAndShowName);
}

function onFocus() {
    if (document.getElementById('search').value == 'Enter the name of a Pokémon') {
        document.getElementById('search').value = "";
        document.getElementById('load-more-button-container').style = 'display:none';
    }
}

function onBlur() {
    if (document.getElementById('search').value == '') {
        document.getElementById('search').value = "Enter the name of a Pokémon";
        document.getElementById('load-more-button-container').style = '';
        document.getElementById('tooltip-text').style = 'display:none';
    }
}

async function filterAndShowName() {
    let filterWord = document.getElementById('search').value.replace(/\s/g, '').toLowerCase();
    if (filterWord.length >= 3) {
        document.getElementById('tooltip-text').style = 'display:none';
        wasSearching = true;
        let pokemonContainersRef = document.getElementById('pokemon-containers');
        pokemonContainersRef.innerHTML = '';
        if (filterWord == "") {
            await pokemonContanersRender(pokemonsList, 40);
        }
        else {
            filteredData = pokemonsList.filter(name => name.name.includes(filterWord));
            await pokemonContanersRender(filteredData, filteredData.length);
        }
    }
    else {
        document.getElementById('tooltip-text').style = '';
        if(wasSearching){
        let pokemonContainersRef = document.getElementById('pokemon-containers');
        pokemonContainersRef.innerHTML = '';
        await pokemonContanersRender(pokemonsList, 40);
        wasSearching = false;

    }
}
}

const dialogRef = document.getElementById('pokemon-container-details'); 
function openDialog() {
    toglleOverlay();
    dialogRef.show();
}

function toglleOverlay(){
    let overlayRef = document.getElementById('overlay');
    overlayRef.classList.toggle('d_none');
    toggleOverflowHidden();
}

function toggleOverflowHidden(){
    let bodyRef = document.getElementById('body');
    bodyRef.classList.toggle('no_scroll');
}


