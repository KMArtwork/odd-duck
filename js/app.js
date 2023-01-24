'use strict';

// array of image files
const productImages = [ 'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg']

// array that our Product objects will be pushed into
let productArr = [];

// 'rounds' is current total number of rounds that have been played in one sitting, 'maxRounds' is set by the user 
let rounds = 0;
let maxRounds = 25;

// 'product' object constructor
function Product (filePath) {
    this.name = filePath.slice(0, filePath.length - 4);
    this.filePath = `./img/${filePath}`;
    this.showCount = 0;
    this.clickCount = 0;

    this.incrementClickCount = this.incrementClickCount.bind(this);
}

// runs whenever a product is shown on screen
Product.prototype.incrementShowCount = function () {
    this.showCount++;
}

// click event handler, tracks number of times an image is clicked and repopulates the screen with new images
Product.prototype.incrementClickCount = function () {
    this.clickCount++;
    console.log(productArr);
    populateImages();
}

// generates a random index depending on the length of an array
function generateRandomIndex (array) {
    return Math.floor(Math.random() * array.length);
}

// generates a product for each element in the productImages array
function generateProducts () {
    productImages.forEach(element => {
        let product = new Product(element);
        productArr.push(product);
    });
}

// starts the game after a user gives an input
function startGame (event) {
    event.preventDefault();
    maxRounds = event.target.numberOfRounds.value;
    populateImages();
}

// gets the user input for how many rounds they would like to play, populates screen with relevant html elements
function determineMaxRounds () {

    let displayEl = document.getElementById('productDisplay');

    let formEl = document.createElement('form');
    formEl.id = 'roundsForm';
    console.log(formEl);

    let inputEl = document.createElement('input');
    inputEl.type = 'number';
    inputEl.id = 'numberOfRounds';
    inputEl.name = 'numberOfRounds';

    let labelEl = document.createElement('label');
    labelEl.for = 'numberOfRounds';
    labelEl.innerText = 'How Many Rounds of Odd Duck Would You Like To Play?';

    let buttonEl = document.createElement('button');
    buttonEl.setAttribute('type', 'submit');
    buttonEl.innerText = 'Start Game';

    formEl.addEventListener('submit', startGame);

    formEl.appendChild(inputEl);
    formEl.appendChild(labelEl);
    formEl.appendChild(buttonEl);
    displayEl.appendChild(formEl);
    

}

// shows results of products shown & clicked when user is finished
function displayResults () {

    let displayEl = document.getElementById('productDisplay');
    displayEl.style.display = 'block';

    while (displayEl.childElementCount > 0) {
        displayEl.removeChild(displayEl.lastChild)
    }

    productArr.forEach(element => {
        let resultText = `${element.name} was viewed ${element.showCount} times and voted for ${element.clickCount} times.`;
        let resultEl = document.createElement('p');
        resultEl.innerText = resultText;

        displayEl.appendChild(resultEl);
    });

    document.getElementById('results').style.display = 'none';

}

// populates screen with a number of images from the productsArr
function populateImages(number = 3) {

    // displays 'view results' button when the max amount of rounds has been reached
    if (rounds >= maxRounds) {
        alert(`You've completed ${maxRounds} rounds of odd duck! Thank you for participating.`);
        let buttonEl = document.getElementById('results');
        buttonEl.style.display = 'block';
        buttonEl.style.width = '25%';
        buttonEl.addEventListener('click', displayResults);
        return;
    }
    
    let numberOfImages = number;
    let previousIndices = [];
    
    let displayEl = document.getElementById('productDisplay');

    // removes any child elements from the parent so that new images can be added
    while (displayEl.childElementCount > 0) {
        displayEl.removeChild(displayEl.lastChild)
    }

    // generates a number of product images depending on the `number` argument we pass in when invoking `populateImages`
    for (let i = 0; i < numberOfImages; i++) {

        let j = generateRandomIndex(productArr);
        // ensures that indices are not repeated for a given set of product images
        while (previousIndices.includes(j)) {
            j = generateRandomIndex(productArr);
        }
        // adds randomly generated index into an array that we can check against on the next loop
        previousIndices.push(j);
        // creates `img` element for a product and sets relevant properties
        let productImage = document.createElement('img');
        productImage.src = productArr[j].filePath;
        productImage.addEventListener('click', productArr[j].incrementClickCount)
        productArr[j].incrementShowCount();

        displayEl.appendChild(productImage);
    }

    rounds++;
}

determineMaxRounds();
generateProducts();
console.log(productArr);