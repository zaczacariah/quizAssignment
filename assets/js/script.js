// Declare Start Screen Deets
let startScreen = document.querySelector('.app__quizWelcome');
let startButton = document.querySelector('.app__quizWelcome__start');
localStorage.setItem("HS", JSON.stringify([]));


// Declare Quiz Deets
let quizContainer = document.querySelector('.app__quiz');
let quizQuestion = document.querySelector('.app__quiz-title');
let quizAnswers = document.querySelectorAll('.answer');
let timeEl = document.querySelector('.time__count');
let timer;
let timeLeft = 75;
// Declare Quiz End
let quizEnd = document.querySelector('.app__result');
let prevScore = 0;
let quizHSButton = document.querySelector('.app__highscore-link');
let quizHS = document.querySelector('.app__highscore');
let quizBreak = false;
// Delcare High score elements
let clearButton = document.querySelector('.clear');
let backButton = document.querySelector('.back')

// Get each section
let sections = document.querySelectorAll('section');


// Delcare route tracking - is that the terminology?
let whereWasI = 'welcome';
let promiseResolve;

// Declare Questions & Answers Array
let questions = [
    {
        title: "Commonly used data types DO NOT include:",
        answers: [
            { text: "strings", correct: false },
            { text: "booleans", correct: false },
            { text: "alerts", correct: true },
            { text: "numbers", correct: false },
        ]
    }, 
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        answers: [
            { text: "quotes", correct: false },
            { text: "curly brackets", correct: false },
            { text: "parentheses", correct: true },
            { text: "square brackets", correct: false },
        ]
    },
    {
        title: "Arrays in JavaScript can be used to store ____.",
        answers: [
            { text: "numbers and strings", correct: false },
            { text: "other arrays", correct: false },
            { text: "booleans", correct: false },
            { text: "all of the above", correct: true },
        ]
    },
    {
        title: "String values must be enclosed within ____ when being assigned to variables.",
        answers: [
            { text: "commas", correct: false },
            { text: "curly brackets", correct: false },
            { text: "quotes", correct: true },
            { text: "parentheses", correct: false },
        ]
    },
    {
        title: "A very useful tool used during development and debugging for printing content to the debugger is:",
        answers: [
            { text: "JavaScript", correct: false },
            { text: "terminal / bash", correct: false },
            { text: "for loops", correct: false },
            { text: "console.log", correct: true },
        ]
    }
];

// Event Handlooskies
startButton.addEventListener('click', function () {

    whereWasI = 'quiz';
    startScreen.classList.add('hide');
    quizContainer.classList.remove('hide');
    initialiseQuiz();
})

quizHSButton.addEventListener('click', () => {
    prevRoute = 'highscores';
    showHighScores();
});

backButton.addEventListener('click', () => {

    // Check where we are going back to
    switch (whereWasI){
        case 'welcome':
            sections.forEach((section) => {

                if(section.matches(".app__quizWelcome") === false){
                    
                    section.classList.add('hide');
                } else {
                    section.classList.remove('hide');
                }  
            })
            break;

        case 'quiz':
            sections.forEach((section) => {

                if(section.matches(".app__quiz") === false){ 
                    section.classList.add('hide');
                } else {
                    section.classList.remove('hide');
                } 
            });
            break;

        case 'end':
            sections.forEach((section) => {

                if(section.matches(".app__result") === false)
                {   
                    section.classList.add('hide');
                } else 
                {  
                    section.classList.remove('hide');
                }  
            });
            break;
    }
    
    quizHS.classList.add('hide');
    quizHSButton.classList.remove('hide');
})

// Reinitialise Scores
clearButton.addEventListener("click", () => {
    localStorage.setItem("HS", JSON.stringify([]));
    quizHS.children[1].innerHTML = '';
});

function updateTimer() {
    timeEl.textContent = timeLeft;
}

function startTimer() {
    // Start the timer and update every second
    timer = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            updateTimer();
        } else {
            clearInterval(timer); // Stop the timer when time runs out
            quizContainer.classList.add('hide');
            quizEnd.classList.remove('hide'); 
            promiseResolve(false); // Resolve the promise with false
        }
    }, 1000);
}

async function initialiseQuiz() {
    quizBreak = false;
    timeLeft = 75;
    
    timeEl.textContent = timeLeft;
    var totalScore = 0;
    
        startTimer();
        for (let question of questions){
            //Populate Quiz Question
            quizQuestion.textContent = question.title;
            quizAnswers.forEach((ans, index) => {
                ans.textContent = question.answers[index].text;//probably need to get a property of ans isntead of ans
            });

            //Await for user Choice! (returning an index for selected value)
            var userChoice = await waitForBroToAnswer();

            // Check if user made a choice or if time ran out
            if(userChoice === false){
                //break the loop if time ran out
                break;
            }
            //Check to see if the selected button was the correct answer
            if(question.answers[parseFloat(userChoice)].correct === true){
                //add to score if correct!
                totalScore++;
                console.log("Total score: ", totalScore);
            } else {
                //reduce time if not
                timeLeft -= 10;    
            
            }
        }
        clearInterval(timer);

    //Questions have all been finished
        //Show Ending Screen
       
    quizContainer.classList.add('hide');
    quizEnd.classList.remove('hide'); 
    whereWasI = 'end';
    prevScore = totalScore;   
}

//Handle waiting for user choice
function waitForBroToAnswer() {

    // Create a new promise (more on return properties inside)
    return new Promise((resolve, reject) => {
        //Access the resolve func outside of the loop
        promiseResolve = resolve;
        //Add event listener to the quizContainer and handle the click event inside ClickEvent
        quizContainer.addEventListener("click", event => { clickEvent(event, resolve) });
        // if(timeLeft === 0){
        //     quizContainer.removeEventListener("click", event => { clickEvent(event, resolve) });
        //     reject(new Error("Timeout: User did not make a choice."));
        // }

        
    })
}

//Click Event Function (have I done this dumb?) 
    // Pass the event and the resolve function
function clickEvent(event, resolve){

    //check the type of element clicked is a button in quizContainer
    if(event.target && event.target.tagName === 'BUTTON'){
        //Remove the event listener and return the index number of the answer clicked
        document.removeEventListener("click", event => { clickEvent(event, resolve) });
        resolve(event.target.children[0].dataset.answer);

        //Check if the span inside the button was clicked
    } else if(event.target && event.target.parentNode.tagName === 'BUTTON'){
        document.removeEventListener("click", event => { clickEvent(event, resolve) });
        resolve(event.target.dataset.answer);
    }
    
}


function handleSave(event) {
    event.preventDefault();
    var highScores = JSON.parse(localStorage.getItem("HS")) || [];

    var newScore = { name: event.target.elements[0].value, score: prevScore };
    highScores.push(newScore);

    localStorage.setItem("HS", JSON.stringify(highScores));

    quizEnd.classList.add('hide');
    // We want them to go back to the start screen if they press back
    whereWasI = 'welcome';
    showHighScores();
}

function showHighScores(){
    // Clear the li's from the ol 
    quizHS.children[1].innerHTML = '';

    // Grab the existing scores
    var highScores = JSON.parse(localStorage.getItem("HS")) || false;
    


        highScores.forEach((score, index) => {
            var li = document.createElement('li');

            // Alt li bg color
            li.setAttribute(
                "style", 
                `background: ${index % 2 === 0 ? 'rgb(187 156 255 / 50%);' : 'rgb(156 166 255 / 50%);'}`)
            li.textContent = `${index+1}. ${score.name}: ${score.score}`;
            quizHS.children[1].appendChild(li);
        });

        //hide sections
        sections.forEach((section) => {
            // Fortunately, hide class will only be added if not present
            section.classList.add('hide');
        })

        //show High Scores
        quizHSButton.classList.add('hide');
        quizHS.classList.remove('hide');

    

}