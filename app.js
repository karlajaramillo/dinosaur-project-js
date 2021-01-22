// Select button
const compareButton = document.querySelector('#btn');

// Select DOM
const form = document.querySelector('#dino-compare');

// image location
const imgUrl = "images/";

// Dino json data
const endpoint = "./dino.json";

// Utility function -- Capitalize words
/**
 * @description Capitalize words
 * @return {string} returns a word, which the first letter is uppercase 
 */
function capitalize(word) {
  return `${word[0].toUpperCase()}${word.slice(1)}`;
}

// Utility function -- Random item
/**
 * @description Random item from an array
 * @return {string} return a random item from the given array
 */
function randomItemArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Create a global constructor
/**
* @class
* @description  Represents an Individual
* @param {string} species - The specie of the individual
* @param {number} height - The height of the individual
* @param {number} weight - The weight of the individual
* @param {string} diet - The diet of the individual
*/
function Individual(species, height, weight, diet) {
  this.species = species;
  this.height = height;
  this.weight = weight;
  this.diet = diet;
  this.image = `${imgUrl}${species.toLowerCase()}.png`;
}

// Create Dino Constructor
/**
* @class
* @description  Represents a Dinosaur class, which is a subclass of Individual
* @param {string} species - The specie of the dinosaur
* @param {number} height - The height of the dinosaur
* @param {number} weight - The weight of the dinosaur
* @param {string} diet - The diet of the dinosaur
* @param {string} when - The time period of time when the dinosaur lived
* @param {string} where - The location of the dinosaur
* @param {string} fact - The fact of the dinosaur
*/
function Dino(species, height, weight, diet, when, where, fact) {
  Individual.call(this, species, height, weight, diet);
  this.when = when;
  this.where = where;
  this.fact = fact;
}

// Set prototype
Dino.prototype = Object.create(Individual.prototype);
Dino.prototype.constructor = Dino;


// Create Human Constructor
/**
* @class
* @description  Represents a Human class, which is a subclass of Individual
* @param {string} name - The name of the human
* @param {number} height - The height of the human
* @param {number} weight - The weight of the human
* @param {string} diet - The diet of the human
*/
function Human(name, height, weight, diet) {
  Individual.call(this, "human", height, weight, diet);
  this.name = name;
  this.diet = diet;
}

// Set prototype
Human.prototype = Object.create(Individual.prototype);
Human.prototype.constructor = Human;


// Create Dino Compare Method 1 - Diet
// NOTE: Weight in JSON file is in lbs, height in inches.
const compareDiet = function(humanDiet, dino) {
  return (dino.diet === humanDiet) ? `Wow!!! You and ${dino.species} has the same diet!` 
      : `You have so different diet! ${dino.species} is ${dino.diet}`;
};

// Create Dino Compare Method 2 - Height
const compareHeight = function(humanHeight, dino) {
let diffHeight = dino.height - humanHeight;

return (dino.height > humanHeight) ? `The ${dino.species} is ${diffHeight} inches taller than you!` 
    : (dino.height < humanHeight) ? `Wow!!! You're ${Math.abs(diffHeight)} inches taller than the ${dino.species}!` 
    : `Amazing!!! You're as tall as ${dino.species}`;
};

// Create Dino Compare Method 3 - Weight
const compareWeight = function(humanWeight, dino) {
let diffWeight = dino.weight - humanWeight;
return (dino.weight > humanWeight) ? `The ${dino.species} is ${diffWeight} lbs heavier than you!` 
    : (dino.weight < humanWeight) ? `Wow!!! You're ${Math.abs(diffWeight)} lbs heavier than the ${dino.species}!` 
    : `Amazing!!! You're as heavy as ${dino.species}`;
};

// Create a fact about the dino habitat
const factWhere = function(dino) {
return `The ${dino.species} lived in ${dino.where}`;
};

// Cretate a fact about the dino time period 
const factWhen = function(dino) {
return `The ${dino.species} lived in the ${dino.when}`;
};

// Get random fact
const getRandomFact = function(human, dino) {
  const factDino = dino.fact;
  const  factHeight = compareHeight(human.height, dino);
  const  factDiet = compareDiet(human.diet, dino);
  const  factWeight = compareWeight(human.weight, dino);
  const  factHabitat= factWhere(dino);
  const  factPeriod = factWhen(dino);

  const facts = [factDino, 
                factHeight, 
                factDiet, 
                factWeight,
                factHabitat,
                factPeriod];
  return facts;
};

// Handle error
function handleError(err) {
  console.log('Oh no!!');
  console.log(err);
}

// Fetch data from the Server
async function fetchData() {
  const response = await fetch(endpoint); // get data or Response from the promise returned by fetch()
  const data = await response.json(); // get data from the promise returned by .json()
  return data; // we have to return the data to use it later
}

// Handle click function
async function handleClick() {
  // Get human object with data pulled from the form
  // Use IIFE to get human data from form and generate the human object
  const humanObject = () => {
    return (function() {
      // Get data pulled from the form
      const name = document.querySelector('[name="name"]').value || "Your name here!";
      const heightFeet = parseInt(document.querySelector('[name="feet"]').value) || 0;
      const heightInches = parseInt(document.querySelector('[name="inches"]').value) || 0;
      const height = heightFeet * 12 + heightInches; //1 feet * 12 inches / 1feet =  inches
      const weight = document.querySelector('[name="weight"]').value;
      const diet = document.querySelector('[name="diet"]').value.toLowerCase();
      
      // Create human object
      const myHuman = new Human(name, height, weight, diet);
      return myHuman;
    })();
  };

  // Fetch data of dinosaurs from dino.json
  const allData = await fetchData().catch(handleError);
  
  // Create dino objects 
  const allDinos = allData.Dinos
    .map(dino => {
      const fact = dino.species == "Pigeon" ? dino.fact : randomItemArray(getRandomFact(humanObject(), dino));
      return new Dino(
        dino.species,
        dino.height, 
        dino.weight, 
        dino.diet, 
        dino.when, 
        dino.where, 
        fact
      );
  });

  // Generate Tiles and display infographic
  const generateTiles = function(human, dinos) {
    // Generate Tiles for each Dino in Array
    //console.log(dinos);
    //console.log(human);
    let tiles = [];
    tiles = dinos;
    // Add human tile in the middle
    tiles.splice(4,0, human);

    let tilesHTML = [];
    const mainGrid = document.querySelector('#grid');

    tiles.map(tile => { 
      if(tile.species == "human") {
        tilesHTML = `
        <div class="grid-item">
          <h3>${capitalize(tile.name)}</h3>
          <img src="${tile.image}" alt="image of ${tile.species}">
        </div>
      `;
      } else if (tile.species == "Pigeon"){
        tilesHTML = `
        <div class="grid-item">
          <h3>${tile.species}</h3>
          <img src="${tile.image}" alt="image of ${tile.species}">
          <p>${tile.fact}</p>
        </div>
      `;
      } else {
        tilesHTML = `
        <div class="grid-item">
          <h3>${tile.species}</h3>
          <img src="${tile.image}" alt="image of ${tile.species}">
          <p>${tile.fact}</p>
        </div>
      `;
      }
      // Display infographic
      const myFragment = document.createRange()
            .createContextualFragment(tilesHTML)
      mainGrid.insertAdjacentHTML('beforeend', tilesHTML);
    });
  };

  // Generate Tiles and display infographic
  generateTiles(humanObject(), allDinos);
  // Remove form from screen
  form.classList.add("hidden");
}

// On button click 
compareButton.addEventListener('click', handleClick);
