// our globally scoped variables
const createNew = document.querySelector('.createnew');
const container = document.querySelector('.card-container');
const page2 = document.querySelector('.page2');
const page1 = document.querySelector('.page1');
const outerModal = document.querySelector('.modalOuter');
const newCardNav = document.querySelector('.createNew-Nav');
const randomCardNav = document.querySelector('.answerRandom-Nav')

const randomCardBtn = document.createElement('div');
randomCardBtn.classList.add('card', 'random');
randomCardBtn.innerHTML = `<p class="questionMark">?</p><p>Answer a Random Card</p>`

const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));

let cards = [];

// create a new card
async function newCard() {
    outerModal.innerHTML = `<button class="modalBack back">Back</button>
    <form class="modalInner">
        <p class="modalText">What is your Question? What is your keyword/answer?</p>
        <input type="text" class="questionBox answerBox" placeholder="Your Question" value="">
        <input type="text" class="keyWordBox answerBox" placeholder="Your keyword/answer here" value="">
        <input type="submit" class="answerButton">
    </form>`;
    page1.classList.add('offscreen');
    await wait(50);
    outerModal.classList.add('open');
    const modalBack = document.querySelector('.modalBack');
    modalBack.addEventListener('click', async function() {
        page1.classList.remove('offscreen');
        outerModal.classList.remove('open');  
        await wait(50);
        outerModal.firstElementChild.remove();
    })
    const newCardForm = document.querySelector('.modalInner');
    newCardForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const question = document.querySelector('.questionBox').value;
        const answerInput = document.querySelector('.keyWordBox');
        const answer = answerInput.value;
        console.log(answer);
        const card = {
            question,
            answer,
            id: Date.now(),
            timesCorrect: 0,
        }
        console.log(card.answer);
        cards.push(card);
        console.log(cards);
        container.dispatchEvent(new CustomEvent('cardsUpdated'));
        page1.classList.remove('offscreen');
        outerModal.classList.remove('open');  
        //await wait(50);
        outerModal.firstElementChild.remove();
    })
}

// display cards
function displayCards() {
    const html = cards.map(
        card => `<div class="card card-question" data-id="${card.id}"> 
            <p data-id="${card.id}" class="cardText">${card.question}</p>
            <p class="timesCorrect" data-id="${card.id}">You have been correct ${card.timesCorrect} times</p>
            <button class="answerButton" data-id="${card.id}">Answer the Question</button>
            <button class="deleteCard" data-id="${card.id}">Delete</button>
        </div>`
    ).join('');
    console.log(html);
    container.innerHTML = html;
    container.insertAdjacentElement('beforeend', randomCardBtn);
    container.insertAdjacentElement('beforeend', createNew);
}

function deleteCard(id) {
    cards = cards.filter(card => card.id !== id);
    container.dispatchEvent(new CustomEvent('cardsUpdated'));
}

function getRandomCard() {
    console.log(cards.length)
    const randomIndex = Math.floor(Math.random() * cards.length);
    console.log(randomIndex);
    randCard = cards[randomIndex];
    answerQuestion(randCard.id);
}

// go back to page 1 and delete page2 when the back button is pressed
async function handleBackButton() {
    page2.classList.remove('open');
    page1.classList.remove('offscreen');
    await wait(50);
    page2.firstElementChild.remove();
    await wait(50);
    page2.firstElementChild.remove();
}

async function answerQuestion(id) {
    // find the object in our cards array that has a specified id
    // display the question larger with an input for answering the question
    let item = cards.filter(card => card.id === id).pop();
    console.log(item);
    const form = `<button class="back">go back</button>
    <form class="innerForm">
        <p class="formText">${item.question}</p>
        <p class="areYouRight"></p>
        <input type="text" class="answerBox" placeholder="answer here">
        <input type="submit" class="submit">
    </form>`;
    page2.innerHTML = form;
    await wait(50);
    page2.classList.add('open');
    page1.classList.add('offscreen');
    const answerQuestion = document.querySelector('.innerForm');
    answerQuestion.addEventListener('submit', async function handleQuestionAnswer(e) {
        e.preventDefault();
        const answerBox = page2.querySelector('.answerBox');
        answerBox.disabled = true;
        const areYouRight = document.querySelector('.areYouRight');
        if(answerBox.value.includes(item.answer)){
            console.log(`the answer is ${item.answer} you got it right Good job!`);
            item.timesCorrect++;
            console.log(item.timesCorrect);
            areYouRight.textContent = `the answer is "${item.answer}" you got it right Good job!`;
            areYouRight.classList.add('show');
            container.dispatchEvent(new CustomEvent('cardsUpdated'));
        } else {
            console.log(`the answer is ${item.answer} you got it wrong you suck`);
            areYouRight.textContent = `the answer is "${item.answer}" you got it wrong better luck next time`;
            areYouRight.classList.add('show');
        }

    });
    const backButton = document.querySelector('.back');
    backButton.addEventListener('click', handleBackButton);
}

function mirrorToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cards));
}

function restoreFromLocalStorage() {
    const lsCards = JSON.parse(localStorage.getItem('cards'));
    if(lsCards.length) {
        cards.push(...lsCards);
        container.dispatchEvent(new CustomEvent('cardsUpdated'));
    }
}

// our event listeners
container.addEventListener('cardsUpdated', displayCards);
container.addEventListener('cardsUpdated', mirrorToLocalStorage)
createNew.addEventListener('click', newCard);
container.addEventListener('click', function(e) {
    id = e.target.dataset.id;
    if(e.target.matches('.card-question') || e.target.matches('.cardText') || e.target.matches('.answerButton') || e.target.matches('.timesCorrect')) {
        answerQuestion(parseInt(id));
    }
    if(e.target.matches('.deleteCard')){
        deleteCard(parseInt(id));
    }
});
randomCardBtn.addEventListener('click', getRandomCard);
randomCardNav.addEventListener('click', getRandomCard);
newCardNav.addEventListener('click', newCard);

restoreFromLocalStorage();
