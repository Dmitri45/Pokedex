let arrowHtml = `<svg class="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" 
stroke="currentColor" class="size-6">
<path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>`;

function getPokemonContainerTemplate(objectOfPokemon, urlOfPokemon) {
    return `<div class="pokemon-container">
    <img src="${objectOfPokemon.sprites.other['official-artwork'].front_default}" alt="">
    <h4>${objectOfPokemon.name[0].toUpperCase() + objectOfPokemon.name.slice(1)}</h4>
    <span>${getPokemonType(objectOfPokemon)}</span>
    <button onclick="pokemonContainerDetailsRender('${urlOfPokemon}')" class="pokemon-container-button">Learn more</button>
    <div></div>
</div>`;
}

function getDefaultPokemonContainerTemplate(objectOfPokemon, urlOfPokemon) {
    return ` <div class="pokemon-container">
    <img src="./img/no_image.png" alt="">
    <h4>${objectOfPokemon.name[0].toUpperCase() + objectOfPokemon.name.slice(1)}</h4>
    <span>${getPokemonType(objectOfPokemon)}</span>
    <button onclick="pokemonContainerDetailsRender('${urlOfPokemon}')" class="pokemon-container-button">Learn more</button>
    <div></div>
</div>`;
}

function getPokemonContainerDetailsTemplate(myObject) {
    return ` <img src="${myObject.sprites.other['official-artwork'].front_default}" alt="">
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
}

function getPokemonMainInformationTemplate(myObject) {
    return `<div class="main-information">
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

function getPokemonStatsTemplate(myObject, index) {
    return `<div class="main-information">
    <span>${myObject.stats[index].stat.name[0].toUpperCase() + myObject.stats[index].stat.name.slice(1)}</span>
    <div class="progress">
        <div class="progress-bar" style="width:${myObject.stats[index].base_stat}%">
        ${myObject.stats[index].base_stat}</div>
    </div>
</div>`;
}

function getEvolutionChainContainerTemplate() {
    return `<div id="evolution_chain_container" class="evolution_chain_container"></div>`;
}



