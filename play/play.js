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

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
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
        return window.location.assign("../lastPage/end.html");
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

