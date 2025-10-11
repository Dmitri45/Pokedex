const BASE_URL = 'https://pokeapi.co/api/v2/pokemon?limit=100&offset=0';
let myObject = null;
let arrowHtml = `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>`;

async function init() {
    await pokemonContanersRender(BASE_URL);
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

async function pokemonContanersRender(url) {
    let pokemonData = await findByUrl(url);
    for (let index = 0; index < pokemonData.results.length; index++) {
        let objectOfPokemon = await findByUrl(pokemonData.results[index].url);
        pokemonContainerRender(objectOfPokemon, pokemonData.results[index].url);
    }
}

function pokemonContainerRender(objectOfPokemon, urlOfPokemon) {
    let pokemonContainersRef = document.getElementById('pokemon-containers');
    pokemonContainersRef.innerHTML += ` 
        <div class="pokemon-container">
        <img src="${objectOfPokemon.sprites.other['official-artwork'].front_default}" alt="">
        <h4>${objectOfPokemon.name[0].toUpperCase() + objectOfPokemon.name.slice(1)}</h4>
        <span>${getPokemonType(objectOfPokemon)}</span>
        <button onclick="pokemonContainerDetailsRender('${urlOfPokemon}')" class="pokemon-container-button">Learn more</button>
        <div></div>
    </div>`;
}

function getPokemonType(myObject) {
    let pokemonTypeList = [];
    for (let index = 0; index < myObject.types.length; index++) {
        pokemonTypeList.push(myObject.types[index].type.name[0].toUpperCase() + myObject.types[index].type.name.slice(1));
    }
    return pokemonTypeList.join('/');
}

async function pokemonContainerDetailsRender(url) {
    await setSelectedPokemon(url);
    let pokemonContainerDetais = document.getElementById('pokemon-container-details');
    pokemonContainerDetais.innerHTML = ` 
        <img src="${myObject.sprites.other['official-artwork'].front_default}" alt="">
        <h4>${myObject.name[0].toUpperCase() + myObject.name.slice(1)}</h4>
        <span>${getPokemonType(myObject)}</span>
        <div class="tab-bar">
            <span id="main" class="tab tab-active" onclick="tabChange('main')">Main</span>
            <span id="stats" class="tab" onclick="tabChange('stats')">Stats</span>
            <span id="evo-chain" class="tab" onclick="tabChange('evo-chain')">Evo Chain</span>
        </div>
        <div class="information-wrap">
        <div id="information" class="information">
        </div>
        </div>
        <button onclick="closePokemondetails()" class="pokemon-container-button">Close</button>
        <div></div>
    </div>`;
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
    document.getElementById('information').innerHTML =
        `<div class="main-information">
            <span>Height</span><span>${myObject.height}</span>
            </div>
            <div class="main-information">
                <span>Weight</span><span>${myObject.weight}</span>
            </div>
            <div class="main-information">
                <span>Base esperience</span><span>${myObject.base_experience}</span>
            </div>
            <div class="main-information">
                <span>Abilities</span><span>${getPokemonAbilities(myObject)}</span>
            </div>`;
}

function pokemonStatsRender() {
    document.getElementById('information').innerHTML = '';
    for (let index = 0; index < myObject.stats.length; index++) {
        document.getElementById('information').innerHTML += `
        <div class="main-information">
        <span>${myObject.stats[index].stat.name[0].toUpperCase() + myObject.stats[index].stat.name.slice(1)}</span>
        <div class="progress">
            <div class="progress-bar" style="width:${myObject.stats[index].base_stat}%">
            ${myObject.stats[index].base_stat}</div>
        </div>
    </div>`;

    }
}

async function pokemonEvoChainRender() {
    let speciesObject = await findByUrl(myObject.species.url);
    let evolutionChainObject = await findByUrl(speciesObject.evolution_chain.url);
    let pokemonImageUrlsList = await getPokemonImageUrls(evolutionChainObject);
    document.getElementById('information').innerHTML = '';
    document.getElementById('information').innerHTML = `<div id="evolution_chain_container" class="evolution_chain_container"></div>`;
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
    document.getElementById('pokemon-container-details').style = '';
}

function closePokemondetails() {
    document.getElementById('pokemon-container-details').style.display = 'none';
}

// TODO:
// - Исправить логику отображения эволюции (иногда ошибка)
// - Сделать контейнер деталей фиксированным при прокрутке
// - Добавить поиск по имени покемона
// - Подправить дизайн карточки деталей