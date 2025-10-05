const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/1/';
let myObject = null;
async function fetchData() {
    if (myObject) {
        return myObject;
    }

    try {
        const response = await fetch(BASE_URL);
        myObject = await response.json();
        return myObject;
    } catch (error) {
        console.error('Fehler', error);
        return null;
    }
}

async function pokemonContainerRender() {
    console.log(myObject);
    await fetchData();
    console.log(myObject);
    let pokemonContainersRef = document.getElementById('pokemon-containers');
    pokemonContainersRef.innerHTML += ` 
        <div class="pokemon-container">
        <img src="${myObject.sprites.other['official-artwork'].front_default}" alt="">
        <h4>${myObject.name[0].toUpperCase() + myObject.name.slice(1)}</h4>
        <span>${getPokemonType(myObject)}</span>
        <button onclick="pokemonContainerDetaislRender()" class="pokemon-container-button">Learn more</button>
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

async function pokemonContainerDetaislRender() {
    await fetchData();
    let pokemonContainersRef = document.getElementById('pokemon-container-details');
    pokemonContainersRef.innerHTML += ` 
        <img src="${myObject.sprites.other['official-artwork'].front_default}" alt="">
        <h4>${myObject.name[0].toUpperCase() + myObject.name.slice(1)}</h4>
        <span>${getPokemonType(myObject)}</span>
        <div class="tab-bar">
            <span id="main" class="tab tab-active" onclick="tabChange('main')">Main</span>
            <span id="stats" class="tab" onclick="tabChange('stats')">Stats</span>
            <span id="evo-chain" class="tab" onclick="tabChange('evo-chain')">Evo Chain</span>
        </div>
        <div id="information" class="information">
            <div class="main-information">
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
            </div>
        </div>
        <button class="pokemon-container-button">Close</button>
        <div></div>
    </div>`;
}

function getPokemonAbilities(myObject) {
    let pokemonAbilitiesList = [];
    for (let index = 0; index < myObject.abilities.length; index++) {
        pokemonAbilitiesList.push(myObject.abilities[index].ability.name);
    }
    return pokemonAbilitiesList.join(', ');
}

function tabChange(id){
    resetTabs();
    document.getElementById(id).classList.add('tab-active');
    document.getElementById('information').innerHTML = '';
} 

function resetTabs(){
    document.getElementById(`main`).classList.remove('tab-active');
    document.getElementById(`stats`).classList.remove('tab-active');
    document.getElementById(`evo-chain`).classList.remove('tab-active');
}

function pokemonStatsRender(){
     document.getElementById('information').innerHTML = '';
     for (let index = 0; index < myObject.stats.length; index++) {
        document.getElementById('information').innerHTML += `
        <div class="main-information">
        <span>${myObject.stats[index].stat.name[0].toUpperCase()+ myObject.stats[index].stat.name.slice(1)}</span>
        <div class="progress">
            <div class="progress-bar" style="width:${myObject.stats[index].base_stat}%"></div>
        </div>
    </div>`;
        
     }
}

function evoChainRender(){
    
}
