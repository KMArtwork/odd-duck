'use strict';

const productImages = [ 'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg']

let productArr = [];

let rounds = 0;
let maxRounds = 25;

function Product (filePath) {
    this.name = filePath.slice(0, filePath.length - 4);
    this.filePath = `./img/${filePath}`;
    this.showCount = 0;
    this.clickCount = 0;

    this.incrementClickCount = this.incrementClickCount.bind(this);
}

Product.prototype.incrementShowCount = function () {
    this.showCount++;
}

Product.prototype.incrementClickCount = function () {
    this.clickCount++;
    console.log(productArr);
    populateImages();
}

function generateRandomIndex (array) {
    return Math.floor(Math.random() * array.length);
}

function generateProducts () {
    productImages.forEach(element => {
        let product = new Product(element);
        productArr.push(product);
    });
}

function startGame (event) {
    event.preventDefault();
    maxRounds = event.target.numberOfRounds.value;
    populateImages();
}

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

    while (displayEl.childElementCount > 0) {
        displayEl.removeChild(displayEl.lastChild)
    }

    for (let i = 0; i < numberOfImages; i++) {

        let j = generateRandomIndex(productArr);

        while (previousIndices.includes(j)) {
            j = generateRandomIndex(productArr);
        }

        previousIndices.push(j);

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