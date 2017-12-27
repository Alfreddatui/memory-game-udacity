/*
 * Create a list that holds all of your cards
 */
let cardList = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
let compare = [];
let moves = 0;

//initialize timer, so the variable become global
let time, hInit, mInit, sInit, t;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

//Crete a function reset for reset button
function reset() {
    location.reload();
}

//function to toggle close and open cards
function toggleCard(object) {
    object.classList.toggle('show');
    object.classList.toggle('open');
}

//function add the total moves
function addMoves() {
    moves++;
    document.querySelector('.moves').innerHTML = moves;
}

/////////////////////////////////////////////STOPWATCH/////////////////////////////////////////
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function getTimeNow() {
    let today = new Date();
    let h = today.getHours() - hInit;
    let m = today.getMinutes() - mInit;
    if (m < 0) {
        m += 60;
        h--;
    }
    let s = today.getSeconds() - sInit;
    if (s< 0) {
        s += 60;
        m--;
    }
    // add a zero in front of numbers<10
    h = checkTime(h);
    m = checkTime(m);
    s = checkTime(s);

    return [h, m, s]
}

function startTime() {
    let [h, m, s] = getTimeNow();
    document.querySelector('.time').innerHTML = h + ":" + m + ":" + s;
    t = setTimeout(function() {
        startTime()
    }, 500);
}

function initiateStopwatch() {
    time = new Date();
    hInit = time.getHours();
    mInit = time.getMinutes();
    sInit = time.getSeconds();
    document.removeEventListener('click', initiateStopwatch);
}
/////////////////////////////////////////////////////////////////////////////////////////////////

//I separate the event listener function so I can remove the event listener while waiting the setTimeout (to prevent multiple click while setTimeout works)
function eventListener(e) { //event listener function
    const target = e.target;
    if (target.className != 'card match' && target.className == 'card' || target.className == 'card show open' && target != compare[0]) {
        startTime();

        if (compare.length < 2) { //if compare array length is not 2 yet, open card, and push to array
            toggleCard(target);
            compare.push(target);
        }

        if (compare.length == 2){ //compare if array length == 2, check whether the card match
            if (compare[0].firstElementChild.className == compare[1].firstElementChild.className) {//if match, add the class match
                compare.forEach(element => {
                    element.classList.toggle('correct');
                    setTimeout(() => {
                        element.classList.toggle('correct');
                        element.classList.toggle('match');
                    }, 300);
                });
                compare = [];
            } else { //cards does not match
                document.removeEventListener('click', eventListener);
                setTimeout(() => {
                    compare.forEach(element => {
                        element.classList.toggle('wrong');
                        setTimeout(() => {
                            element.classList.toggle('wrong');
                            toggleCard(element);
                        }, 300);
                    });
                    compare = [];
                    document.addEventListener('click', eventListener);
                }, 400);
            }

            addMoves(); //increase moves number if compare array length == 2

            if (moves > 40) { //delete stars if moves equal to some points
                document.querySelector('.stars').innerHTML = '';
            } else if (moves > 30) {
                document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li>';  
            } else if (moves >20) {
                document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
            } else {
                document.querySelector('.stars').innerHTML = '<li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li> <li><i class="fa fa-star"></i></li>';
            }

            //If all cards match, run this
            if (document.querySelectorAll('.match').length == 16) {
                let totalStars = document.querySelectorAll('.fa-star').length;
                let scoreStar = '';
                for (let i = 0; i < totalStars; i++) {
                    scoreStar += '<i class="fa fa-star"></i>';
                }

                let [h, m, s] = getTimeNow();
                document.querySelector('.moves-result').innerHTML = moves;
                document.querySelector('.time-result').innerHTML = h + ":" + m + ":" + s;
                document.querySelector('.stars-result').innerHTML = scoreStar;
                document.querySelector('.win-message').style.display = "inline-block";
            }
        }
    }
}

//initialize the cards
shuffle(cardList);
let cardBoxes = document.querySelectorAll('.card .fa');
const lengthBoxes = cardBoxes.length;

for (let count = 0; count < lengthBoxes; count++) {
    cardBoxes[count].classList.add(cardList[count]);
}

//initialize stopwatch
document.addEventListener('click', initiateStopwatch);

//event listener
document.addEventListener('click', eventListener);

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
