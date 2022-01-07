const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");

let currentQuestion = {};
let acceptAnswers = false;
let score = 0;
let questionCount = 0;
let availableQuestions = [];

let questions = [];

fetch("questions.json")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions;
    start();
  })
  .catch((err) => {
    console.error(err);
  });


const correct = 5;
const totalQuestions = 3;

start = () => {
    questionCount = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestions();
}

getNewQuestions = () => {

    if(availableQuestions.length === 0 || questionCount >= totalQuestions){
        localStorage.setItem('mostRecentScore', score);
        //go to end page
        return window.location.assign("/end.html");
    }

    questionCount++;

    questionCounterText.innerText = `${questionCount}/${totalQuestions}`;

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( (choice) => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener("click", e => {

        if(!acceptAnswers) return;

        acceptAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

         const classToApply =
           selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

           if(classToApply === "correct"){
               incrementScore(correct);
           }

         selectedChoice.parentElement.classList.add(classToApply);

         setTimeout(() => {
           selectedChoice.parentElement.classList.remove(classToApply);
           getNewQuestions();
         }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};

