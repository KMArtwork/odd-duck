'use strict';

// array of image files
const productImages = [ 'bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'water-can.jpg', 'wine-glass.jpg']

// array that our Product objects will be pushed into
let productArr = [];

// used to prevent images from displaying two rounds in a row
let previousRoundIndices = [];
let excludedIndices = [];

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
    // console.log(productArr);
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
    // console.log(formEl);

    let inputEl = document.createElement('input');
    inputEl.type = 'number';
    inputEl.id = 'numberOfRounds';
    inputEl.name = 'numberOfRounds';

    let labelEl = document.createElement('label');
    labelEl.setAttribute('for', 'numberOfRounds');
    labelEl.innerText = 'How Many Rounds of Odd Duck Would You Like To Play?';
    labelEl.style.textAlign = 'center';

    let buttonEl = document.createElement('button');
    buttonEl.setAttribute('type', 'submit');
    buttonEl.innerText = 'Start Game';

    formEl.addEventListener('submit', startGame);

    formEl.appendChild(labelEl);
    formEl.appendChild(inputEl);
    formEl.appendChild(buttonEl);
    displayEl.appendChild(formEl);
    

}

// shows results of products shown & clicked when user is finished
function displayResults () {

    let resultListEl = document.getElementById('resultsList');

    savesToLocalStorage();

    productArr.forEach(element => {
        let name = element.name.charAt(0).toUpperCase() + element.name.slice(1);
        let resultText = `${name} was viewed ${element.showCount} times and voted for ${element.clickCount} times.`;
        let resultEl = document.createElement('li');
        resultEl.innerText = resultText;

        resultListEl.appendChild(resultEl);
    });

    document.getElementById('viewResults').style.display = 'none';
    document.getElementById('resetData').style.display = 'block';
    document.getElementById('takeAgain').style.display = 'block';

    showChart();

}

// populates screen with a number of images from the productsArr
function populateImages(number = 3) {

    let numberOfImages = number;
    let displayEl = document.getElementById('productDisplay');

    // array of image indices per invocation of populateImages();
    let tempIndices = [];
    
    // displays 'view results' button when the max amount of rounds has been reached
    if (rounds >= maxRounds) {
        alert(`You've completed ${maxRounds} rounds of odd duck! Thank you for participating.`);
        
        while (displayEl.childElementCount > 0) {
            displayEl.removeChild(displayEl.lastChild)
        }

        let buttonEl = document.getElementById('viewResults');
        // console.log(buttonEl);
        buttonEl.style.display = 'block';
        buttonEl.style.width = '25%';
        buttonEl.addEventListener('click', displayResults);
        return;
    }

    // removes any child elements from the parent so that new images can be added
    while (displayEl.childElementCount > 0) {
        displayEl.removeChild(displayEl.lastChild)
    }

    // only runs on the second+ invocation of this function. gets previous round's indices and excludes them from this round
    if (previousRoundIndices.length > 0){
            
        previousRoundIndices.forEach(element => {
            excludedIndices.push(element);
        });
    }

    // generates a number of product images depending on the `number` argument we pass in when invoking `populateImages`
    for (let i = 0; i < numberOfImages; i++) {

        // generates inital random index
        let j = generateRandomIndex(productArr);

        // ensures that indices are not repeated for a given set of product images
        while (excludedIndices.includes(j)) {
            j = generateRandomIndex(productArr);
        }
        // adds randomly generated index into an array that we can check against on the next loop
        tempIndices.push(j);
        excludedIndices.push(j);

        // creates `img` element for a product and sets relevant properties
        let productImage = document.createElement('img');
        productImage.src = productArr[j].filePath;
        productImage.addEventListener('click', productArr[j].incrementClickCount)
        productArr[j].incrementShowCount();

        displayEl.appendChild(productImage);
    }

    // console.log(previousRoundIndices);
    // console.log(tempIndices);
    // console.log(excludedIndices);

    // clears the array of the indices from last round in preparation for storing this current round's indices, which will become the previous round's indices the next time the function is invoked.

    let loopLength = previousRoundIndices.length;
    for (let n = 0; n < loopLength; n++) {
        previousRoundIndices.pop();
    }

    loopLength = excludedIndices.length;
    // clears the array of indices in preparation for the next round
    for (let n = 0; n < loopLength; n++) {
        excludedIndices.pop();
    }

    // adds each index from current round to an array that will be checked next time the populate images function is ran, ensuring that images do not show twice in a row
    tempIndices.forEach(element => {
        previousRoundIndices.push(element);

    });

    rounds++;
}

function savesToLocalStorage () {

    if (localStorage.cachedProductArr) {
        getsFromLocalStorage();
    }
    localStorage.setItem( 'cachedProductArr', JSON.stringify(productArr));
}

function getsFromLocalStorage () {

    let parsedArr = JSON.parse(localStorage.getItem('cachedProductArr'));
    let i = 0;

    parsedArr.forEach(element => {
        productArr[i].showCount += element.showCount;
        productArr[i].clickCount += element.clickCount;
        i++;
    });

}

// clears local storage and resets 
function handleResetData () {
    localStorage.clear();
    window.location.reload();
}

function handleTakeAgain () {
    window.location.reload();
}


const canvasEl = document.getElementById('chartCanvas');
const ctx = canvasEl.getContext('2d');

function showChart () {

    new Chart (ctx, {
        type: 'bar',

        data: {

          labels: 
            [
                productArr[0].name, productArr[1].name, productArr[2].name, productArr[3].name, productArr[4].name, productArr[5].name, productArr[6].name, productArr[7].name, productArr[8].name, productArr[9].name, productArr[10].name, productArr[11].name, productArr[12].name, productArr[13].name, productArr[14].name, productArr[15].name, productArr[16].name
            ],

          datasets: 
            [
                {
                    label: '# of Times Shown',

                    data: [productArr[0].showCount, productArr[1].showCount, productArr[2].showCount, productArr[3].showCount, productArr[4].showCount, productArr[5].showCount, productArr[6].showCount, productArr[7].showCount, productArr[8].showCount, productArr[9].showCount, productArr[10].showCount, productArr[11].showCount, productArr[12].showCount, productArr[13].showCount, productArr[14].showCount, productArr[15].showCount, productArr[16].showCount],

                    borderWidth: 2,
                    borderColor: 'rgb(122, 255, 255)',
                    backgroundColor: 'rgb(34, 168, 162)'
                }, 
                {
                    label: '# of Times Clicked',

                    data: [productArr[0].clickCount, productArr[1].clickCount, productArr[2].clickCount, productArr[3].clickCount, productArr[4].clickCount, productArr[5].clickCount, productArr[6].clickCount, productArr[7].clickCount, productArr[8].clickCount, productArr[9].clickCount, productArr[10].clickCount, productArr[11].clickCount, productArr[12].clickCount, productArr[13].clickCount, productArr[14].clickCount, productArr[15].clickCount, productArr[16].clickCount],

                    borderWidth: 2,
                    borderColor: '#f6f740',
                    backgroundColor: '#ffca3a'
                }
            ]
        },

        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }

      }

    );
}


document.getElementById('resetData').addEventListener('click', handleResetData);
document.getElementById('takeAgain').addEventListener('click', handleTakeAgain);

determineMaxRounds();
generateProducts();
// console.log(productArr);